import { canvas, ctx } from "./canvas.js";
import { clamp, coords, cos, sin } from "./utils.js";

let rain = [];
while (rain.length < canvas.width / 25) {
  rain.push(Math.random() * canvas.width);
}
let lastFlash = Date.now();
let flashSeed = 1;
let seed = 1;
const thunder = () => {
  seed++;
  return Math.sin(((seed * 45 + flashSeed) * 37) ** 4 + 17) / 2 + 0.5;
};
let unicornY = 0;
let unicornX = 0;
let groundY = 0;
function init() {
    unicornY = canvas.height - 260;
    unicornX = canvas.width / 2;
    groundY = canvas.height - 260;
}
init()
function drawUnicorn(n) {
  n = n / 500;
  const s = 1.2;
  const a = sin(n * 4 + 0.4) * s,
    a2 = sin(n * 4 + 1.5) * s,
    a3 = sin(n * 4 + 0.8) * s,
    a4 = sin(n * 4 + 0.2) * s;
  ctx.strokeStyle = "#ffc2c2b6";
  ctx.lineWidth = 5;
  ctx.stroke(
    new Path2D(
      `M${unicornX - 40},${unicornY - 25} l${sin(a3) * 20},${cos(a3) * 20}M${
        unicornX + 40
      },${unicornY - 25} l${sin(a4) * 20},${cos(a4) * 20}`
    )
  );
  ctx.beginPath();
  ctx.rect(unicornX + 40, unicornY - 80, 30, 25);
  ctx.rect(unicornX - 50, unicornY - 60, 100, 40);
  ctx.fillStyle = "#ffc2c2";
  ctx.fill();
  console.log();
  ctx.strokeStyle = "#ffc2c2";
  ctx.stroke(
    new Path2D(
      `M${unicornX - 40},${unicornY - 25} l${sin(a) * 20},${cos(a) * 20}M${
        unicornX + 40
      },${unicornY - 25}l${sin(a2) * 20},${cos(a2) * 20}`
    )
  );
}

function animate() {
  requestAnimationFrame(animate);
  const n = Date.now();
  let dt = 1;
  //update
  if (n - lastFlash >= 3000 || Math.random() < 0.002) {
    lastFlash = n;
    flashSeed = Math.random() * 10;
  }

  //draw
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  // THUNDER!
  if (n - lastFlash <= 250) {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.globalAlpha = (1 - ((n - lastFlash) / 250) * sin(n / 100) > 0.99) * 0.7;
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.globalAlpha = 1 - ((n - lastFlash) / 250) ** 3;
    ctx.lineWidth = ctx.globalAlpha * 5;
    for (let i = 0; i < Math.random() * 3; i++) {
      seed = i;
      ctx.shadowColor = "rgb(255, 255, 255)";
      ctx.shadowBlur = 50;
      // if (Math.random() < 0.1) {
      ctx.stroke(
        new Path2D(
          `M${thunder() * canvas.width},0${Array(
            Math.floor((8 + thunder() * 10) * (1 - ctx.globalAlpha ** 3)) * 2
          )
            .fill(0)
            .map((_) => `l${Math.random()*5+thunder()*80-40}, 40`)}`
        )
      );
      // ${coords(40, thunder() * 0.7 + 1.22)}
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
    }
    ctx.globalAlpha = 1;
  }
  ctx.beginPath();
  ctx.rect(0, groundY, canvas.width, canvas.height - groundY);
  ctx.fillStyle = "brown";
  ctx.fill();

  // RAIN!
  ctx.lineWidth = 0.5;
  rain.forEach((p, i) => {
    i = 10 + Math.sin(i * 399) * 5;
    ctx.strokeStyle = "white";
    ctx.stroke(new Path2D(`M${p + 4},${((n / 10) * i) % canvas.height}l0,-30`));
  });

  //running unicorn
  drawUnicorn(n);
}
animate(); // THE STARTUP

addEventListener("resize", init);
