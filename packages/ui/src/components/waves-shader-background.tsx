"use client";

import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colors[4];
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;

float hash21(vec2 point) {
  point = fract(point * vec2(234.34, 435.345));
  point += dot(point, point + 34.23);
  return fract(point.x * point.y);
}

float grainHash(vec2 point) {
  vec3 p3 = fract(vec3(point.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 curve = local * local * (3.0 - 2.0 * local);
  return mix(
    mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), curve.x),
    mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0)), curve.x),
    curve.y
  );
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int index = 0; index < 5; index++) {
    value += amplitude * noise(point);
    point = point * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float value) {
  float position = clamp(value, 0.0, 1.0) * 3.0;
  vec3 color = mix(u_colors[0], u_colors[1], smoothstep(0.0, 1.0, position));
  color = mix(color, u_colors[2], smoothstep(0.0, 1.0, position - 1.0));
  return mix(color, u_colors[3], smoothstep(0.0, 1.0, position - 2.0));
}

vec3 shade(vec2 uv, vec2 point, float time) {
  float wave = uv.y
    + sin(uv.x * (3.0 + u_shape.y * 9.0) + time * 0.8) * 0.08
    + (fbm(point * 2.0 + time * 0.1) - 0.5) * u_shape.y * 0.6;
  return palette(wave);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 point = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  point *= u_shape.x;

  float rotation = u_transform.x;
  float cosine = cos(rotation);
  float sine = sin(rotation);
  point = mat2(cosine, -sine, sine, cosine) * point;
  point += u_transform.yz;
  point += u_transform.w * vec2(sin(u_time * 0.31), cos(u_time * 0.23));

  float warp = u_shape.z;
  point += warp * (vec2(
    fbm(point * u_shape.w + u_finish.w),
    fbm(point * u_shape.w + vec2(5.2, 1.3))
  ) - 0.5);

  vec3 color;
  float blur = u_finish.y;
  if (blur > 0.0) {
    float pointOffset = blur * u_shape.x;
    vec2 uvOffset = vec2(blur) * min(u_resolution.x, u_resolution.y)
      / u_resolution.xy;
    color = shade(uv, point, u_time) * 0.36;
    color += shade(
      uv + vec2(uvOffset.x, 0.0),
      point + vec2(pointOffset, 0.0),
      u_time
    ) * 0.16;
    color += shade(
      uv - vec2(uvOffset.x, 0.0),
      point - vec2(pointOffset, 0.0),
      u_time
    ) * 0.16;
    color += shade(
      uv + vec2(0.0, uvOffset.y),
      point + vec2(0.0, pointOffset),
      u_time
    ) * 0.16;
    color += shade(
      uv - vec2(0.0, uvOffset.y),
      point - vec2(0.0, pointOffset),
      u_time
    ) * 0.16;
  } else {
    color = shade(uv, point, u_time);
  }

  color = (color - 0.5) * u_surface.x + 0.5;
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(luma), color, u_surface.y);
  color += u_surface.z;

  float vignette = length(uv - 0.5) * 1.41421356;
  color *= 1.0 - u_surface.w * smoothstep(0.35, 1.0, vignette);
  color += (grainHash(gl_FragCoord.xy + u_finish.w) - 0.5) * u_finish.x;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const DEFAULT_COLORS = ["#031c26", "#1b6ca8", "#5ad2f4", "#eaf9ff"] as const;
const DEFAULT_OFFSET = [0.11, -0.19] as const;
const HEX_PATTERN = /^#?[\da-f]{6}$/i;

function normalizeColor(value: string, fallback: string) {
  const color = value.trim();
  if (!HEX_PATTERN.test(color)) return fallback;
  return color.startsWith("#") ? color : `#${color}`;
}

function hexToRgb(value: string): [number, number, number] {
  const hex = value.slice(1);
  return [
    Number.parseInt(hex.slice(0, 2), 16) / 255,
    Number.parseInt(hex.slice(2, 4), 16) / 255,
    Number.parseInt(hex.slice(4, 6), 16) / 255,
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

export interface WavesShaderBackgroundProps extends React.ComponentPropsWithoutRef<"div"> {
  colors?: readonly [string, string, string, string];
  speed?: number;
  scale?: number;
  intensity?: number;
  warp?: number;
  detail?: number;
  contrast?: number;
  saturation?: number;
  brightness?: number;
  vignette?: number;
  grain?: number;
  blur?: number;
  seed?: number;
  rotation?: number;
  offset?: readonly [number, number];
  drift?: number;
  paused?: boolean;
  height?: string | number;
}

export function WavesShaderBackground({
  colors = DEFAULT_COLORS,
  speed = -0.727,
  scale = 2,
  intensity = 0.54,
  warp = 0.042,
  detail = 1.536,
  contrast = 1.158,
  saturation = 1,
  brightness = 0,
  vignette = 0.21,
  grain = 0.101,
  blur = 0.002,
  seed = 4012,
  rotation = 5.6549,
  offset = DEFAULT_OFFSET,
  drift = 0.116,
  paused = false,
  height = "100%",
  className,
  style,
  children,
  ...props
}: WavesShaderBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const palette = React.useMemo(
    () =>
      colors.map((color, index) =>
        hexToRgb(normalizeColor(color, DEFAULT_COLORS[index] ?? "#000000")),
      ),
    [colors],
  );

  React.useEffect(() => {
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
    const buffer = gl.createBuffer();
    if (!program || !buffer) {
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const colorUniform = gl.getUniformLocation(program, "u_colors");
    const shape = gl.getUniformLocation(program, "u_shape");
    const surface = gl.getUniformLocation(program, "u_surface");
    const finish = gl.getUniformLocation(program, "u_finish");
    const transform = gl.getUniformLocation(program, "u_transform");
    if (
      !resolution ||
      !time ||
      !colorUniform ||
      !shape ||
      !surface ||
      !finish ||
      !transform
    ) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.uniform3fv(colorUniform, new Float32Array(palette.flat()));
    gl.uniform4f(shape, scale, intensity, warp, detail);
    gl.uniform4f(surface, contrast, saturation, brightness, vignette);
    gl.uniform4f(finish, grain, blur, 0, seed);
    gl.uniform4f(transform, rotation, offset[0], offset[1], drift);

    let frame = 0;
    let elapsed = 0;
    let previousTime: number | null = null;
    let inView = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rawWidth = Math.max(1, Math.round(bounds.width * dpr));
      const rawHeight = Math.max(1, Math.round(bounds.height * dpr));
      const pixelScale = Math.min(
        1,
        Math.sqrt(2_000_000 / Math.max(1, rawWidth * rawHeight)),
      );
      canvas.width = Math.max(1, Math.round(rawWidth * pixelScale));
      canvas.height = Math.max(1, Math.round(rawHeight * pixelScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
    };

    const draw = () => {
      gl.uniform1f(time, elapsed * speed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const shouldAnimate = () =>
      !paused &&
      !reducedMotion.matches &&
      inView &&
      document.visibilityState === "visible" &&
      Math.abs(speed) > 0.0001;

    const render = (now: number) => {
      if (previousTime !== null) {
        elapsed += Math.min((now - previousTime) / 1000, 0.1);
      }
      previousTime = now;
      draw();
      frame = shouldAnimate() ? requestAnimationFrame(render) : 0;
    };

    const syncAnimation = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousTime = null;
      draw();
      if (shouldAnimate()) frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      syncAnimation();
    });
    const handleVisibilityChange = () => syncAnimation();

    resize();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    syncAnimation();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [
    blur,
    brightness,
    contrast,
    detail,
    drift,
    grain,
    intensity,
    offset,
    palette,
    paused,
    rotation,
    saturation,
    scale,
    seed,
    speed,
    vignette,
    warp,
  ]);

  const fallback = `linear-gradient(180deg, ${colors[3]} 0%, ${colors[2]} 35%, ${colors[1]} 68%, ${colors[0]} 100%)`;

  return (
    <div
      ref={containerRef}
      data-slot="waves-shader-background"
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height, background: fallback, ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
      />
      {children ? <div className="relative size-full">{children}</div> : null}
    </div>
  );
}

export { WavesShaderBackground as ShaderBackground };
