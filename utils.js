function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(v,a=0,b=1) {
  return Math.max(a,Math.min(b,v))
}
function coords(l,a) {
  return cos(a)*l+','+sin(a)*l
}
const sin = Math.sin
const cos = Math.cos

export { randItem, clamp, sin,cos,coords  };
