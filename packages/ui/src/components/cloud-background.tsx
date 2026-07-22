"use client";

import { useEffect, useMemo, useRef, type ComponentProps } from "react";

import { cn } from "@workspace/ui/lib/utils";

const VERTEX_SHADER = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colorBottom;
uniform vec3 u_colorMid;
uniform vec3 u_colorTop;
uniform float u_speed;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  vec2 curve = local * local * (3.0 - 2.0 * local);

  return mix(a, b, curve.x)
    + (c - a) * curve.y * (1.0 - curve.x)
    + (d - b) * curve.x * curve.y;
}

float fbm(vec2 point, float time) {
  float value = 0.0;
  float amplitude = 0.5;
  float octave = 0.0;
  mat2 rotation = mat2(0.86, 0.51, -0.51, 0.86);

  for (int index = 0; index < 6; index++) {
    vec2 morph = vec2(
      sin(time * 0.5 + octave),
      cos(time * 0.3 - octave)
    ) * 0.05;
    value += amplitude * noise(point + morph);
    point = rotation * point * 2.0;
    amplitude *= 0.5;
    octave += 1.0;
  }

  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float time = u_time * u_speed;
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 point = (uv - 0.5) * aspect;
  vec2 wind = vec2(time * 0.1, time * 0.02);
  float pattern = fbm(point * 2.2 - wind, time);
  float middleClouds = smoothstep(0.3, 0.65, pattern);
  float brightClouds = smoothstep(0.7, 0.95, pattern);
  vec3 color = mix(u_colorBottom, u_colorMid, middleClouds);

  color = mix(color, u_colorTop, brightClouds);
  gl_FragColor = vec4(color, 1.0);
}
`;

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

export interface CloudBackgroundProps extends ComponentProps<"div"> {
  colorBottom?: string;
  colorMid?: string;
  colorTop?: string;
  speed?: number;
  height?: string | number;
  paused?: boolean;
}

export function CloudBackground({
  colorBottom = "#87ceeb",
  colorMid = "#f8f8f8",
  colorTop = "#ffffff",
  speed = 1,
  height = "100%",
  paused = false,
  className,
  style,
  children,
  ...props
}: CloudBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = useMemo(() => {
    const bottom = normalizeHexColor(colorBottom, "#87ceeb");
    const middle = normalizeHexColor(colorMid, "#f8f8f8");
    const top = normalizeHexColor(colorTop, "#ffffff");

    return {
      bottom,
      middle,
      top,
      values: [hexToRgb(bottom), hexToRgb(middle), hexToRgb(top)] as const,
    };
  }, [colorBottom, colorMid, colorTop]);

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
    const bottomColor = gl.getUniformLocation(program, "u_colorBottom");
    const middleColor = gl.getUniformLocation(program, "u_colorMid");
    const topColor = gl.getUniformLocation(program, "u_colorTop");
    const speedUniform = gl.getUniformLocation(program, "u_speed");

    if (
      !buffer ||
      position < 0 ||
      !resolution ||
      !time ||
      !bottomColor ||
      !middleColor ||
      !topColor ||
      !speedUniform
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

    gl.uniform3fv(bottomColor, colors.values[0]);
    gl.uniform3fv(middleColor, colors.values[1]);
    gl.uniform3fv(topColor, colors.values[2]);
    gl.uniform1f(speedUniform, Math.max(0, speed));

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
      gl.uniform1f(time, elapsed);
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
  }, [colors, paused, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        height,
        background: `linear-gradient(135deg, ${colors.bottom}, ${colors.middle} 58%, ${colors.top})`,
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

export { CloudBackground as Clouds };
