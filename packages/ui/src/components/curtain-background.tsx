"use client";

import { useEffect, useMemo, useRef, type ComponentProps } from "react";

import { cn } from "@workspace/ui/lib/utils";

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_colors[3];

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x
    + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 point = uv * vec2(ratio, 1.0);
  float time = u_time * 0.2;
  float broadNoise = snoise(point * 0.5 + time);
  float detailNoise = snoise(point * 0.9 - time * 0.5 + broadNoise);
  float light = pow(abs(detailNoise), 2.5) * 0.5;
  vec3 color = mix(vec3(0.02, 0.01, 0.01), u_colors[2] * 0.08, 0.18);

  color += u_colors[0] * smoothstep(0.1, 1.0, broadNoise) * 0.5;
  color += u_colors[1] * light;

  float grain = fract(
    sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time
  );
  color += (grain - 0.5) * u_grain * 0.5;

  float distanceFromCenter = length(uv - 0.5);
  color *= smoothstep(1.2, 0.2, distanceFromCenter);

  gl_FragColor = vec4(color, 1.0);
}
`;

const DEFAULT_COLORS = ["#ef4444", "#dc2626", "#b91c1c"] as const;
const HEX_COLOR_PATTERN = /^#?[\da-f]{6}$/i;

function normalizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!HEX_COLOR_PATTERN.test(trimmed)) return fallback;
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.slice(1);
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ];
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export interface CurtainBackgroundProps extends ComponentProps<"div"> {
  colors?: readonly [string, string, string] | readonly string[];
  speed?: number;
  grain?: number;
  height?: string | number;
  paused?: boolean;
}

export function CurtainBackground({
  colors = DEFAULT_COLORS,
  speed = 0.3,
  grain = 0.6,
  height = "100%",
  paused = false,
  className,
  style,
  children,
  ...props
}: CurtainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorKey = colors.join("|");

  const palette = useMemo(() => {
    const normalized = DEFAULT_COLORS.map((fallback, index) =>
      normalizeHexColor(colors[index] ?? fallback, fallback),
    ) as [string, string, string];

    return {
      normalized,
      values: new Float32Array(normalized.flatMap(hexToRgb)),
    };
    // colorKey represents the serializable color list and avoids restarts when
    // callers recreate an equivalent array during render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER,
    );
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const buffer = gl.createBuffer();
    const position = gl.getAttribLocation(program, "position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const grainUniform = gl.getUniformLocation(program, "u_grain");
    const colorsUniform = gl.getUniformLocation(program, "u_colors[0]");

    if (
      !buffer ||
      position < 0 ||
      !resolution ||
      !time ||
      !grainUniform ||
      !colorsUniform
    ) {
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(colorsUniform, palette.values);
    gl.uniform1f(grainUniform, Math.max(0, grain));

    let frame = 0;
    let elapsed = 0;
    let lastFrameTime: number | null = null;
    let isVisible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
    };

    const draw = () => {
      gl.uniform1f(time, elapsed * Math.max(0, speed));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const shouldAnimate = () =>
      !paused &&
      !reduceMotion.matches &&
      isVisible &&
      document.visibilityState === "visible";

    const render = (now: number) => {
      if (lastFrameTime !== null) {
        elapsed += Math.min((now - lastFrameTime) / 1000, 0.05);
      }
      lastFrameTime = now;
      draw();
      frame = shouldAnimate() ? requestAnimationFrame(render) : 0;
    };

    const syncAnimation = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = null;
      draw();
      if (shouldAnimate()) frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      syncAnimation();
    });

    resize();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    reduceMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    syncAnimation();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reduceMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [grain, palette, paused, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        height,
        background: `linear-gradient(135deg, ${palette.normalized[2]}, ${palette.normalized[0]}, ${palette.normalized[1]})`,
        ...style,
      }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
      {children ? (
        <div className="relative z-10 size-full">{children}</div>
      ) : null}
    </div>
  );
}

export { CurtainBackground as Curtain };
