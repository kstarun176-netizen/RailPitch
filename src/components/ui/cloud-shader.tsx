"use client";

import React, { useEffect, useRef } from "react";

interface CloudShaderProps {
  className?: string;
  children?: React.ReactNode;
  speed?: number;
  cloudCoverage?: number;
  cloudDensity?: number;
  skyColor?: [number, number, number];
  cloudColor?: [number, number, number];
  sunColor?: [number, number, number];
}

export function CloudShader({
  className = "",
  children,
  speed = 0.6,
  cloudCoverage = 0.52,
  cloudDensity = 1.1,
  skyColor = [0.24, 0.58, 0.82],     // Vibrant clear sky blue
  cloudColor = [0.98, 0.99, 1.0],   // Soft luminous white cloud
  sunColor = [1.0, 0.94, 0.78],     // Golden sun highlights
}: CloudShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with 3D FBM Volumetric-like Cloud Ray Simulation
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_coverage;
      uniform float u_density;
      uniform vec3 u_skyColor;
      uniform vec3 u_cloudColor;
      uniform vec3 u_sunColor;

      varying vec2 v_uv;

      // Hash function
      float hash(vec2 p) {
        p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
        return -1.0 + 2.0 * fract(16.0 * p.x * p.y * (p.x + p.y));
      }

      // 2D Value Noise
      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(mix(hash(i + vec2(0.0, 0.0)), 
                       hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), 
                       hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // Fractional Brownian Motion
      float fbm(vec2 uv) {
        float f = 0.0;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        f += 0.5000 * noise(uv); uv = m * uv;
        f += 0.2500 * noise(uv); uv = m * uv;
        f += 0.1250 * noise(uv); uv = m * uv;
        f += 0.0625 * noise(uv); uv = m * uv;
        f += 0.03125 * noise(uv); uv = m * uv;
        return f * 0.5 + 0.5;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = st * vec2(aspect, 1.0);

        // Wind drift & flow animation
        vec2 drift = vec2(u_time * 0.035, u_time * 0.008);
        
        // Multi-layered cloud sampling
        vec2 q = p * 1.6 - drift;
        float f1 = fbm(q);
        
        vec2 r = p * 3.2 - drift * 1.5 + vec2(f1 * 0.4, f1 * 0.3);
        float f2 = fbm(r);

        vec2 s = p * 6.5 - drift * 2.2 + vec2(f2 * 0.3, -f2 * 0.2);
        float f3 = fbm(s);

        // Combine octaves
        float cloudShape = f1 * 0.55 + f2 * 0.3 + f3 * 0.15;

        // Altitude gradient (denser towards top/middle, softer at horizon)
        float heightMask = smoothstep(0.0, 0.85, st.y);
        cloudShape = cloudShape * heightMask;

        // Density thresholding
        float cloud = smoothstep(1.0 - u_coverage, 1.0, cloudShape * u_density);

        // Sky gradient: Deep blue at top to bright horizon azure & coastal mist at bottom
        vec3 horizonColor = vec3(0.72, 0.88, 0.95);
        vec3 zenithColor = u_skyColor;
        vec3 sky = mix(horizonColor, zenithColor, pow(st.y, 0.75));

        // Subtle Sun Glow in top-right
        vec2 sunPos = vec2(aspect * 0.82, 0.88);
        float sunDist = length(p - sunPos);
        float sunGlow = exp(-sunDist * 1.8) * 0.6 + exp(-sunDist * 5.0) * 0.4;
        sky += u_sunColor * sunGlow * 0.5;

        // Cloud self-shadowing and sun-highlight rim lighting
        float cloudShadow = smoothstep(0.3, 0.9, cloudShape);
        vec3 cloudLit = mix(vec3(0.78, 0.84, 0.90), u_cloudColor, cloudShadow);
        cloudLit += u_sunColor * (sunGlow * cloud * 0.35);

        // Final color mix
        vec3 finalColor = mix(sky, cloudLit, cloud * 0.92);

        // Gentle vignette around corners
        float vignette = smoothstep(1.8, 0.5, length((st - 0.5) * vec2(aspect * 0.75, 1.0)));
        finalColor = mix(finalColor * 0.94, finalColor, vignette);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uCoverage = gl.getUniformLocation(program, "u_coverage");
    const uDensity = gl.getUniformLocation(program, "u_density");
    const uSkyColor = gl.getUniformLocation(program, "u_skyColor");
    const uCloudColor = gl.getUniformLocation(program, "u_cloudColor");
    const uSunColor = gl.getUniformLocation(program, "u_sunColor");

    let animationFrameId: number;
    let startTime = performance.now();

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl?.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    function render() {
      if (!gl || !canvas) return;
      resize();

      const elapsed = (performance.now() - startTime) * 0.001 * speed;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uCoverage, cloudCoverage);
      gl.uniform1f(uDensity, cloudDensity);
      gl.uniform3fv(uSkyColor, skyColor);
      gl.uniform3fv(uCloudColor, cloudColor);
      gl.uniform3fv(uSunColor, sunColor);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [speed, cloudCoverage, cloudDensity, skyColor, cloudColor, sunColor]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none block"
        style={{ zIndex: 0 }}
      />
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}

export function CloudShaderDemo() {
  return (
    <CloudShader className="h-[40rem] w-full" />
  );
}
