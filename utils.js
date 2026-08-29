function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(a,b,v) {
  return Math.max(a,Math.min(b,v))
}

export { randItem, clamp };
