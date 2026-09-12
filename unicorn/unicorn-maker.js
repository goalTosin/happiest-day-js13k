const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const sin = Math.sin;
const cos = Math.cos;
const st = Date.now();
/**
 * Animation of unicorn works very simply: Each leg moves: back and forth. We use sin(time*speed) for the angle of the leg.
 */
let anim = [
  0.8, 0.54, 4.74, 0.61, 0.8, 0.38, 0.49, 0.4, 0.8, 0.78, 10.89, 0, 0.8, 0.54, -12.48, 0, 0.8, 0.54,
  -5, 0.61, 0.8, 0.38, 5, 0.4, 0.8, 0.78, 0.42, 0, 0.8, 0.54, 3.18, 0,
];
let frozen = [0, 0, 0, 0, 0.24, -0.14, 0, -0.06]; // frequency, amplitude, offset, angle offset for each leg
let jumping = [0, 0, 0, 0, 0.24, -0.14, 0, -0.06]; // frequency, amplitude, offset, angle offset for each leg
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() / 100;
  const s = 1;

  // legs
  ctx.strokeStyle = "#80808084";
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const knees = [];
  const knee = (x, y, i) => {
    let fr = 1 - Math.max(0, Math.min(1, (Date.now() - st) / 100));
    // console.log((Date.now() - st/)/4999);

    let angle = sin(t * anim[i] + anim[i + 2]) * anim[i + 1] + anim[i + 3];
    let cs = [
      x + sin(angle * fr + jumping[i / 4] * (1 - fr)) * 30,
      y + cos(angle * fr + jumping[i / 4] * (1 - fr)) * 30,
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
  ctx.ellipse(253, 50 + sin(t * 1.6 + 1.8) * 3, 13, 25, (Math.PI * 6) / 8, 0, Math.PI * 2); //head
  ctx.ellipse(
    270,
    69 + sin(t * 1.6 + 1.6) * 4,
    3,
    (sin(t * 0.2) / 2 + 0.5) * 13 + 3,
    (Math.PI * 6) / 8,
    0,
    Math.PI * 2,
  ); //mouth
  ctx.clip("evenodd");
  ctx.beginPath();
  ctx.ellipse(253, 50 + sin(t * 1.6 + 1.8) * 3, 13, 25, (Math.PI * 6) / 8, 0, Math.PI * 2); //head

  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(233, 42 + sin(t * 1.6 + 1.6) * 4, 7, 15, (Math.PI * 2) / 9, 0, Math.PI * 2); //neck
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.ellipse(250, 44 + sin(t * 1.6 + 1.8) * 3, 2, 3, 1.6, 0, Math.PI * 2); //eye
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.ellipse(223, 56 + sin(t * 1.6 + 1.8) * 3, 12, 25, (Math.PI * 2) / 9, 0, Math.PI * 2); //upper neck
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(160, 70 + sin(t * 1.6 + 1.5) * 6, 60, 25, 0, 0, Math.PI * 2); //body
  ctx.fill();

  ctx.beginPath();
  // horn
  ctx.moveTo(270, 12 + sin(t * 1.6 + 1.8) * 3);
  ctx.lineTo(248, 33 + sin(t * 1.6 + 1.8) * 3);
  ctx.lineTo(257, 40 + sin(t * 1.6 + 1.8) * 3);
  ctx.fillStyle = "yellow";
  ctx.fill();
  //mane+tail
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(235, 29 + sin(t * 1.6 + 1.8) * 3);
    ctx.bezierCurveTo(
      208,
      33 + sin(t * 1.6 + 1.8) * 1.5,
      230 - i * 1,
      72 - i * 4,
      177 - i * 2,
      65 - i * 1,
    );
    ctx.moveTo(103, 69 + sin(t * 1.6 + 1.8) * 3);
    ctx.bezierCurveTo(
      77,
      75 + sin(t * 1.6 + 1.8) * 1.5,
      91 - i * 1,
      99 - i * 4,
      75 - i * 2,
      104 - i * 1,
    );
    ctx.strokeStyle = "#" + ((i / 7) * 0xffffff).toString(16) + "50";
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  setTimeout(draw, 1000 / 50);
}
draw();

addEventListener("click", (e) => {
  console.log(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

function wrap(f, v) {
  return f(v);
}
const container = document.createElement("div");
container.className = "container";

// anim.forEach((p, i) => {
//   if (i % 4 === 0) {
//     return;
//   }
//   const input = document.createElement("input");
//   input.type = "range";
//   input.min = i % 2 === 0 ? -15 : 0;
//   input.max = i % 2 === 0 ? 15 : 1.6;
//   input.step = 0.01;
//   input.value = p;
//   input.oninput = (e) => {
//     anim[i] = input.valueAsNumber;
//     console.log(input.valueAsNumber);
//   };
//   container.append(input);
// });
jumping.forEach((p, i) => {
  const input = document.createElement("input");
  input.type = "range";
  input.min = -4;
  input.max = 4;
  input.step = 0.01;
  input.value = p;
  input.oninput = (e) => {
    jumping[i] = input.valueAsNumber;
    // console.log(input.valueAsNumber);
  };
  container.append(input);
});
document.body.append(container);
