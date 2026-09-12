const canvas = document.querySelector("canvas");
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize); // resize setup
const ctx = canvas.getContext("2d");
export {canvas,ctx}