function wrap(f, v) {
  return f(v);
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(v, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v));
}
function coords(l, a) {
  return cos(a) * l + "," + sin(a) * l;
}
function addArrs(mult = 1, ...args) {
  return args.reduce((a, b) => a.map((v, i) => Math.abs(v + b[i] * mult)));
}
// modulo for negative numbers
function roll(x, m) {
  return x < 0 ? m-(-x)%m : x%m
}
//for minification purposes
const sin = Math.sin;
const cos = Math.cos;
const min = Math.min;
const now = Date.now
const rand = Math.random
const abs = Math.abs

export { wrap, randItem, clamp, sin, cos, min, rand, coords, addArrs, roll, now, abs };
