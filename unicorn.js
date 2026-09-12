// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");
// const sin = Math.sin;

import { ctx } from "./canvas.js";
import { clamp, cos, sin } from "./utils.js";

// const cos = Math.cos;
const st = Date.now();
/**
 * Animation of unicorn works very simply: Each leg moves: back and forth. We use sin(time*speed) for the angle of the leg.
 */
let anim = [
  0.8, 0.54, 4.74, 0.61, 0.8, 0.38, 0.49, 0.4, 0.8, 0.78, 10.89, 0, 0.8, 0.54,
  -12.48, 0, 0.8, 0.54, -5, 0.61, 0.8, 0.38, 5, 0.4, 0.8, 0.78, 0.42, 0, 0.8,
  0.54, 3.18, 0,
];
// let jumping = [0.85, -0.01, 0, 0, 1.4, -0.14, 0, -0.06];

let jumping = [0.91, 0.13, 0.36, 0.03, 1.23, -0.04, 0.29, 0.21];
let frozen = [0, 0, 0, 0, 0.24, -0.14, 0, -0.06]; // frequency, amplitude, offset, angle offset for each leg
function drawUnicorn(
  unicornX,
  unicornY,
  unicornVX,
  unicornVY,
  unicornW,
  unicornH,
  unicornRunning,
  unicornAnimationStartTime,
  unicornDir,
  unicornInAir
) {
  ctx.beginPath();
  ctx.rect(
    unicornX - unicornW / 2,
    unicornY - unicornH / 2,
    unicornW,
    unicornH
  );
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.save();
  ctx.translate(unicornX - 127 * unicornDir, unicornY - 60);
  ctx.scale(0.7 * unicornDir, 0.7);
  const n = Date.now() / 100;
  const s = 1;

  // legs
  ctx.strokeStyle = "#80808084";
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const knees = [];
  const knee = (x, y, i) => {
    let fr =
      (unicornInAir ? 1 : -1) *
        clamp((Date.now() - unicornAnimationStartTime) / 350, 0, 1) +
      (unicornInAir ? 0 : 1);
    let rp = unicornInAir ? jumping : frozen;
    // console.log((Date.now() - st/)/4999);

    let angle = sin(n * anim[i] + anim[i + 2]) * anim[i + 1] + anim[i + 3];
    let cs = [
      x + sin(angle * (1 - fr) + rp[i / 4] * fr) * 30,
      y + cos(angle * (1 - fr) + rp[i / 4] * fr) * 30,
    ];
    knees.push(...cs);
    ctx.lineTo(...cs);
  };

  ctx.beginPath();
  ctx.moveTo(192, 81);
  knee(192, 81, 0);
  // ctx.lineTo(...knees);
  ctx.moveTo(120, 81);
  knee(120, 81, 4);
  ctx.lineWidth = 15;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(knees[0], knees[1]);
  knee(knees[0], knees[1], 8);
  ctx.moveTo(knees[2], knees[3]);
  knee(knees[2], knees[3], 12);
  ctx.lineWidth = 10;
  ctx.stroke();
  // forelegs
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(192, 81);
  knee(192, 81, 16);
  ctx.moveTo(120, 81);
  knee(120, 81, 20);
  ctx.lineWidth = 15;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(knees[8], knees[9]);
  knee(knees[8], knees[9], 24);
  ctx.moveTo(knees[10], knees[11]);
  knee(knees[10], knees[11], 28);
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    253,
    50 + sin(n * 1.6 + 1.8) * 3,
    13,
    25,
    (Math.PI * 6) / 8,
    0,
    Math.PI * 2
  ); //head
  ctx.ellipse(
    270,
    69 + sin(n * 1.6 + 1.6) * 4,
    3,
    (sin(n * 0.2) / 2 + 0.5) * 13 + 3,
    (Math.PI * 6) / 8,
    0,
    Math.PI * 2
  ); //mouth
  ctx.clip("evenodd");
  ctx.beginPath();
  ctx.ellipse(
    253,
    50 + sin(n * 1.6 + 1.8) * 3,
    13,
    25,
    (Math.PI * 6) / 8,
    0,
    Math.PI * 2
  ); //head

  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(
    233,
    42 + sin(n * 1.6 + 1.6) * 4,
    7,
    15,
    (Math.PI * 2) / 9,
    0,
    Math.PI * 2
  ); //neck
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.ellipse(250, 44 + sin(n * 1.6 + 1.8) * 3, 2, 3, 1.6, 0, Math.PI * 2); //eye
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(
    223,
    56 + sin(n * 1.6 + 1.8) * 3,
    12,
    25,
    (Math.PI * 2) / 9,
    0,
    Math.PI * 2
  ); //upper neck
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(160, 70 + sin(n * 1.6 + 1.5) * 6, 60, 25, 0, 0, Math.PI * 2); //body
  ctx.fill();

  ctx.beginPath();
  // horn
  ctx.moveTo(270, 12 + sin(n * 1.6 + 1.8) * 3);
  ctx.lineTo(248, 33 + sin(n * 1.6 + 1.8) * 3);
  ctx.lineTo(257, 40 + sin(n * 1.6 + 1.8) * 3);
  ctx.fillStyle = "yellow";
  ctx.fill();
  //mane+tail
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(235, 29 + sin(n * 1.6 + 1.8) * 3);
    ctx.bezierCurveTo(
      208,
      33 + sin(n * 1.6 + 1.8) * 1.5,
      230 - i * 1,
      72 - i * 4,
      177 - i * 2,
      65 - i * 1
    );
    ctx.moveTo(103, 69 + sin(n * 1.6 + 1.8) * 3);
    ctx.bezierCurveTo(
      77,
      75 + sin(n * 1.6 + 1.8) * 1.5,
      91 - i * 1,
      99 - i * 4,
      75 - i * 2,
      104 - i * 1
    );
    ctx.strokeStyle = "#" + ((i / 7) * 0xffffff).toString(16) + "50";
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  ctx.restore();
  // setTimeout(draw, 1000 / 50);
}
// draw();

// addEventListener("click", (e) => {
//   console.log(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
// });

export { drawUnicorn };
