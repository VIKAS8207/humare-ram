// WebGL liquid dissolve: the image "melts" away from several seed points that
// grow as noise-warped metaballs, merge, and clear the screen. Plain WebGL1,
// no dependencies. Output is premultiplied alpha so the page shows through.

const SEED_COUNT = 3;
// Base spots (x, y in 0..1, y up) and start delay (0..0.2 of the timeline)
const BASE_SEEDS: [number, number, number][] = [
  [0.22, 0.7, 0.0],
  [0.78, 0.45, 0.1],
  [0.45, 0.2, 0.2],
];

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define N ${SEED_COUNT}
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uP;
uniform float uT;
uniform vec3 uSeeds[N];
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  float aspect = uRes.x / uRes.y;
  vec2 p = vUv * vec2(aspect, 1.0);

  // Watery warp of the field
  vec2 warp = vec2(fbm(p * 2.5 + uT * 0.25), fbm(p * 2.5 + 7.3 - uT * 0.2)) - 0.5;
  vec2 pw = p + warp * 0.2;

  float diag = length(vec2(aspect, 1.0));
  float R = diag * 1.1;
  float f = 0.0;
  for (int i = 0; i < N; i++){
    float t = clamp((uP - uSeeds[i].z) / 0.78, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float r = t * R;
    vec2 d = pw - uSeeds[i].xy * vec2(aspect, 1.0);
    f += (r * r) / (dot(d, d) + 1e-4);
  }

  float rim = exp(-pow((f - 1.0) * 3.0, 2.0)) * step(0.001, uP);

  // object-fit: cover, with a small lens wobble near the edge
  vec2 s = uRes / uImg;
  vec2 size = uImg * max(s.x, s.y);
  vec2 uv = (vUv * uRes - 0.5 * uRes) / size + 0.5;
  uv += (vec2(fbm(p * 6.0 + uT), fbm(p * 6.0 - uT)) - 0.5) * 0.03 * rim;
  vec3 col = texture2D(uTex, uv).rgb;

  // Same overlay as the DOM: black at bottom -> 60% mid -> transparent top
  float y = vUv.y;
  float g = y < 0.5 ? mix(1.0, 0.6, y / 0.5) : mix(0.6, 0.0, (y - 0.5) / 0.5);
  col *= 1.0 - g;

  float alpha = (1.0 - smoothstep(0.85, 1.15, f)) * (1.0 - smoothstep(0.92, 1.0, uP));
  col += rim * vec3(1.0, 0.55, 0.15) * 0.55;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export type LiquidReveal = {
  render: (progress: number) => void;
  destroy: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("liquid-reveal shader:", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

export function createLiquidReveal(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
): LiquidReveal | null {
  if (!image.complete || !image.naturalWidth) return null;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // Full-screen triangle
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  gl.uniform1i(u("uTex"), 0);
  gl.uniform2f(u("uImg"), image.naturalWidth, image.naturalHeight);

  // Jitter seed spots a bit so every load dissolves differently
  const seeds = new Float32Array(SEED_COUNT * 3);
  BASE_SEEDS.forEach(([x, y, z], i) => {
    seeds[i * 3] = Math.min(0.97, Math.max(0.03, x + (Math.random() - 0.5) * 0.08));
    seeds[i * 3 + 1] = Math.min(0.97, Math.max(0.03, y + (Math.random() - 0.5) * 0.08));
    seeds[i * 3 + 2] = z;
  });
  gl.uniform3fv(u("uSeeds"), seeds);

  const uRes = u("uRes");
  const uP = u("uP");
  const uT = u("uT");
  let lastP = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  };

  const render = (progress: number) => {
    lastP = progress;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uP, progress);
    gl.uniform1f(uT, performance.now() / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const onResize = () => {
    resize();
    render(lastP);
  };
  window.addEventListener("resize", onResize);
  resize();

  return {
    render,
    destroy() {
      window.removeEventListener("resize", onResize);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
