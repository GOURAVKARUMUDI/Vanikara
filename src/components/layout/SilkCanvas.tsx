"use client";

import { useEffect, useRef } from "react";
import type { PageAtmosphere } from "./SiteBackground";

/**
 * "Liquid silk": a domain-warped noise field rendered with raw WebGL.
 * Warm wing colours drift on the left, cool wing colours on the right,
 * with thin bright folds where the fabric creases. It follows the theme,
 * the time of day (data-daypart) and the page atmosphere, and leans
 * gently toward the pointer and with scroll.
 *
 * Budget: half-resolution canvas, 30fps cap, paused in hidden tabs, one
 * still frame for reduced-motion users. If WebGL is unavailable nothing
 * renders and the CSS light field underneath stays in charge.
 */

const VERTEX = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time, u_scroll, u_strength, u_dark, u_bias;
uniform vec2 u_pointer;
uniform vec3 u_base, u_warm, u_gold, u_cool, u_cyan, u_deep;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}
  return v;
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float aspect=u_res.x/u_res.y;
  vec2 p=vec2(uv.x*aspect,uv.y-u_scroll*.3)*.85;
  float t=u_time*.035;

  vec2 q=vec2(fbm(p+vec2(0.,t)),fbm(p+vec2(5.2,1.3)-t*.8));
  vec2 r=vec2(fbm(p+2.2*q+vec2(1.7,9.2)+t*1.1),fbm(p+2.2*q+vec2(8.3,2.8)-t*.9));

  vec2 pa=vec2(uv.x*aspect,uv.y);
  vec2 pp=vec2(u_pointer.x*aspect,u_pointer.y);
  float pd=length(pa-pp);
  float pg=exp(-pd*pd*5.);
  float f=fbm(p+2.4*r+pg*.35);

  float side=smoothstep(.08,.92,uv.x+(r.x-.5)*.55-u_bias*.28);
  vec3 warm=mix(u_gold,u_warm,smoothstep(.3,.8,f));
  vec3 cool=mix(u_cyan,u_cool,smoothstep(.25,.75,f));
  vec3 wing=mix(warm,cool,side);
  wing=mix(wing,u_deep,u_dark*smoothstep(.5,.95,r.y)*.55);

  float silk=smoothstep(.55,1.,pow(.5+.5*sin((f*3.2+r.y*2.)*3.14159),5.));
  float body=smoothstep(.32,.86,f);
  float calm=1.-.5*exp(-(uv.x-.3)*(uv.x-.3)*7.)*smoothstep(.1,.7,uv.y);
  float lift=.72+.28*smoothstep(0.,1.,uv.y);

  float amount=u_strength*calm*lift*(.3+.7*body);
  vec3 col=mix(u_base,wing,amount);
  col=mix(col,wing,silk*.16*u_strength);
  col+=wing*silk*.07*u_dark*u_strength;
  col=mix(col,wing,pg*.1*u_strength);
  col+=(hash(gl_FragCoord.xy+fract(u_time))-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;

const ATMOSPHERE_STRENGTH: Record<PageAtmosphere, number> = {
  home: 1,
  product: 0.95,
  about: 0.8,
  contact: 0.72,
  dashboard: 0.38,
  minimal: 0.34,
};

/** Warm/cool balance by time of day: dawn and dusk lean warm, night leans cool. */
const DAYPART_BIAS: Record<string, number> = { dawn: 0.35, day: 0, dusk: 0.55, night: -0.3 };

function hexToRgb(value: string): [number, number, number] | null {
  const hex = value.trim().replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  const n = parseInt(hex, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
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

export default function SilkCanvas({
  atmosphere,
  onReady,
}: {
  atmosphere: PageAtmosphere;
  onReady: (ready: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atmosphereRef = useRef(atmosphere);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl || gl.isContextLost()) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT.replace("precision highp float;", gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision ? "precision highp float;" : "precision mediump float;"));
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const U = {
      res: u("u_res"), time: u("u_time"), scroll: u("u_scroll"), strength: u("u_strength"), dark: u("u_dark"), bias: u("u_bias"),
      pointer: u("u_pointer"), base: u("u_base"), warm: u("u_warm"), gold: u("u_gold"), cool: u("u_cool"), cyan: u("u_cyan"), deep: u("u_deep"),
    };

    // Theme-driven values, eased toward their targets each frame
    const state = { strength: 0, dark: 0, bias: 0, scroll: 0, px: 0.62, py: 0.62 };
    const target = { strength: 0, dark: 0, bias: 0, scroll: 0, px: 0.62, py: 0.62 };
    let base: [number, number, number] = [0.97, 0.98, 0.99];
    let baseTarget = base;

    const readTheme = () => {
      const css = getComputedStyle(root);
      const color = (name: string, fallback: [number, number, number]) => hexToRgb(css.getPropertyValue(name)) ?? fallback;
      const dark = root.getAttribute("data-theme") === "dark";
      baseTarget = color("--surface-base", dark ? [0.02, 0.03, 0.09] : [0.97, 0.98, 0.99]);
      gl.uniform3fv(U.warm, color("--vanikara-bright-orange", [1, 0.42, 0]));
      gl.uniform3fv(U.gold, color("--vanikara-gold", [1, 0.7, 0]));
      gl.uniform3fv(U.cool, color("--vanikara-blue", [0, 0.43, 1]));
      gl.uniform3fv(U.cyan, color("--vanikara-cyan", [0, 0.81, 1]));
      gl.uniform3fv(U.deep, color("--vanikara-deep-blue", [0.03, 0.17, 0.45]));
      target.dark = dark ? 1 : 0;
      target.strength = (dark ? 0.48 : 0.44) * ATMOSPHERE_STRENGTH[atmosphereRef.current];
      target.bias = DAYPART_BIAS[root.getAttribute("data-daypart") ?? "day"] ?? 0;
    };

    let width = 0;
    let height = 0;
    const resize = () => {
      const scale = window.innerWidth < 768 ? 0.45 : 0.5;
      width = Math.max(1, Math.min(1400, Math.round(window.innerWidth * scale)));
      height = Math.max(1, Math.round(window.innerHeight * (width / window.innerWidth)));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(U.res, width, height);
    };

    const timeOffset = Math.random() * 200;
    let frame = 0;
    let last = 0;
    let running = false;
    let first = true;

    const draw = (now: number, snap: boolean) => {
      const k = snap ? 1 : 0.06;
      for (const key of Object.keys(state) as (keyof typeof state)[]) state[key] += (target[key] - state[key]) * k;
      base = base.map((c, i) => c + (baseTarget[i] - c) * (snap ? 1 : 0.08)) as [number, number, number];
      gl.uniform1f(U.time, timeOffset + now / 1000);
      gl.uniform1f(U.scroll, state.scroll);
      gl.uniform1f(U.strength, state.strength);
      gl.uniform1f(U.dark, state.dark);
      gl.uniform1f(U.bias, state.bias);
      gl.uniform2f(U.pointer, state.px, state.py);
      gl.uniform3fv(U.base, base);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        onReady(true);
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now, false);
    };

    const start = () => {
      if (running || document.visibilityState !== "visible") return;
      if (reduced.matches) {
        draw(0, true);
        return;
      }
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());
    const onResize = () => {
      resize();
      if (!running) draw(performance.now(), true);
    };
    const onScroll = () => {
      target.scroll = window.scrollY / Math.max(1, window.innerHeight);
    };
    const onPointer = (e: PointerEvent) => {
      target.px = e.clientX / window.innerWidth;
      target.py = 1 - e.clientY / window.innerHeight;
    };
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (!running) draw(performance.now(), true);
    });
    const onAtmosphere = () => {
      readTheme();
      if (!running) draw(performance.now(), true);
    };
    const onReducedChange = () => {
      if (reduced.matches) {
        stop();
        draw(0, true);
      } else start();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      onReady(false);
    };

    resize();
    readTheme();
    onScroll();
    Object.assign(state, target, { strength: 0 });
    base = baseTarget;
    start();

    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme", "data-daypart"] });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    reduced.addEventListener("change", onReducedChange);
    window.addEventListener("vk-atmosphere", onAtmosphere);

    return () => {
      stop();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      reduced.removeEventListener("change", onReducedChange);
      window.removeEventListener("vk-atmosphere", onAtmosphere);
      // Free GPU resources but keep the context itself: the same canvas is
      // reused if the effect runs again (React dev re-mounts, fast refresh).
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      onReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atmosphere changes on navigation: ease the strength toward the new page's level
  useEffect(() => {
    atmosphereRef.current = atmosphere;
    window.dispatchEvent(new Event("vk-atmosphere"));
  }, [atmosphere]);

  return <canvas ref={canvasRef} aria-hidden="true" className="site-bg__canvas" />;
}
