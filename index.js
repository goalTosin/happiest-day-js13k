/**
 * ----------------- THE GAME ---------------------
 * 7 Trials based on the colors of the rainbow
 * Minification: Everything is as minimal as possible, engineered to behave the best way, in the tiniest fashion. All variables are `let` and hardly `const` to preserve 1 byte (we can't waste it ;). All object's properties are 1 lettered, because minifiers dont touch objects. Canvas paths are drawn with Path2d to make them smaller to write.
 */

import { canvas, ctx } from "./canvas.js";
import { drawUnicorn } from "./unicorn.js";
import {
  addArrs,
  clamp,
  coords,
  cos,
  min,
  now,
  rand,
  roll,
  sin,
} from "./utils.js";

let platforms = [];
while (platforms.length < 500) {
  platforms.push({ x: platforms.length * 800, y: 300, w: 500, h: 100 });
}
// rain is just an array of numbers will be multiplied to range between the left and right side of the screen [454, 39, 21, 505, 368, ...]
let rain = [];
while (rain.length < canvas.width / 20) {
  rain.push(rand());
}

let levels = [
  {
    d: () => {
      // red river
      ctx.beginPath();
      ctx.rect(0, 50, canvas.width, canvas.width / 2 - camX);
      ctx.fillStyle = "#ff5314";
      ctx.fill();
    },
    p: [],
    n: ["Red River", "Lava lake"],
  },
];
let camX, camY;
let level = 0;
let unicornDir = 1;
let keysDown = {};
let dashed = true;
let lastFlash = now();
let flashSeed = rand() * 80; //controls how the flash happens
let strikeSeed = 1;
let unicornAnimationStartTime = 0;
let gravity = 0.2;
//controlled random number between 0 and 1 for thunder, using flashseed and strikeseed to control it
const thunder = () => {
  strikeSeed++;
  return sin(((strikeSeed * 45 + flashSeed) * 37) ** 4 + 17) / 2 + 0.5;
};
// 0 for start screen //1 for game screen
let screen = 1;
let unicornY = 0;
let unicornX = 0;
let unicornVY = 0;
let unicornVX = 0;
let unicornW = 128;
let unicornH = 80;
let transitionStart = 0;
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
let clean_colors = [
  "FF4444",
  "FF8800",
  "FFDD00",
  "44CC44",
  "4488FF",
  "6644CC",
  "CC44FF",
];

window.transitionTo = transitionTo;
function transitionTo(sc) {
  transitionStart = now();
  setTimeout(() => (screen = sc), 1500);
}
// function drawUnicorn(n) {
//   n = unicorn_running ? n / 500 : 0;
//   const s = 1.2;
//   const a = sin(n * 4 + 0.4) * s,
//     a2 = sin(n * 4 + 1.5) * s,
//     a3 = sin(n * 4 + 0.8) * s,
//     a4 = sin(n * 4 + 0.2) * s;
//   ctx.strokeStyle = "#ffc2c2b6";
//   ctx.lineWidth = 5;
//   ctx.stroke(
//     new Path2D(
//       `M${unicornX - 35},${unicornY + 5} l${sin(a3) * 20},${cos(a3) * 20}M${
//         unicornX + 35
//       },${unicornY + 5} l${sin(a4) * 20},${cos(a4) * 20}`
//     )
//   );
//   ctx.beginPath();
//   ctx.rect(unicornX + 25, unicornY - 30, 30, 25);
//   ctx.rect(unicornX - 55, unicornY - 10, 95, 20);
//   ctx.fillStyle = "#ffc2c2";
//   ctx.fill();
//   // debug
//   ctx.beginPath();
//   ctx.rect(
//     unicornX - unicornW / 2,
//     unicornY - unicornH / 2,
//     unicornW,
//     unicornH
//   );
//   ctx.strokeStyle = "#ff0000";
//   ctx.lineWidth = 5;
//   ctx.setLineDash([4, 4]);
//   ctx.stroke();
//   ctx.setLineDash([]);
//   // debug end
//   console.log();
//   ctx.strokeStyle = "#ffc2c2";
//   ctx.stroke(
//     new Path2D(
//       `M${unicornX - 35},${unicornY + 5} l${sin(a) * 20},${cos(a) * 20}M${
//         unicornX + 35
//       },${unicornY + 5}l${sin(a2) * 20},${cos(a2) * 20}`
//     )
//   );
// }
let inair = true;

function animate() {
  window.a = requestAnimationFrame(animate);
  const n = now();
  let dt = 1;
  //update
  //thunder STRIKE!
  if (n - lastFlash >= 3000 || rand() < 0.002) {
    lastFlash = n;
    flashSeed = rand() * 10;
  }
  unicornX += unicornVX * dt;
  unicornY += unicornVY * dt;
  unicornVY += gravity * dt;
  let collided = false;
  platforms.forEach((platform) => {
    if (
      Math.abs(platform.x - unicornX) <= (platform.w + unicornW) / 2 &&
      Math.abs(platform.y - unicornY) <= (platform.h + unicornH) / 2
    ) {
      // console.log("yer");

      collided = true;
      inair = false;
      let cl = [
        platform.x - platform.w / 2,
        platform.y - platform.h / 2,
        platform.x + platform.w / 2,
        platform.y + platform.h / 2,
      ];
      const ub = [
        unicornX + unicornW / 2,
        unicornY + unicornH / 2,
        unicornX - unicornW / 2,
        unicornY - unicornH / 2,
      ];
      const ar = addArrs(-1, ub, cl);
      let sm = min(...ar);
      ar.forEach((v, i) => {
        if (v === sm) {
          let x = [-1, 0, 1, 0][i];
          let y = [0, -1, 0, 1][i];
          unicornX += x * v;
          unicornY += y * v;
          unicornVX *= x === 0 ? 0.5 : 0;
          unicornVY *= y === 0 ? 0.5 : 0;
          // unicornVY *= y/2
        }
      });
    }
  });

  if (!collided && !inair) {
    inair = true;
    unicornAnimationStartTime = n;
  }

  let unicornRunning = true;

  if (keysDown["a"]) {
    unicornVX = -5;
    unicornDir = -1;
  } else if (keysDown["d"]) {
    unicornVX = 5;
    unicornDir = 1;
  } else if (unicornRunning) {
    unicornRunning = false;

    unicornAnimationStartTime = Date.now();
  }

  if (keysDown["w"] && !inair) {
    unicornVY = -5;
    unicornAnimationStartTime = Date.now(); // lerp into jumpung anumation
  }

  //draw
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  // THUNDER!

  if (n - lastFlash <= 250 && false) {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.globalAlpha = (1 - ((n - lastFlash) / 250) * sin(n / 100) > 0.99) * 0.7;
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.globalAlpha = 1 - ((n - lastFlash) / 250) ** 3;
    ctx.lineWidth = ctx.globalAlpha * 5;
    for (let i = 0; i < rand() * 3; i++) {
      strikeSeed = i;
      ctx.shadowColor = "rgb(255, 255, 255)";
      ctx.shadowBlur = 50;
      // if (rand() < 0.1) {
      ctx.stroke(
        new Path2D(
          `M${thunder() * canvas.width},0${Array(
            Math.floor((8 + thunder() * 10) * (1 - ctx.globalAlpha)) * 2
          )
            .fill(0)
            .map((_) => `l${rand() * 5 + thunder() * 80 - 40}, 40`)}`
        )
      );
      // ${coords(40, thunder() * 0.7 + 1.22)}
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
    }
    ctx.globalAlpha = 1;
  }
  // RAIN!
  if (false) {
    ctx.lineWidth = 0.5;
    rain.forEach((p, i) => {
      //  👇 u can adjust speed of rain drop
      i = 11 + Math.sin(i * 399) * 5;
      // adjust the speed variance 👆
      ctx.strokeStyle = "white";
      ctx.stroke(
        new Path2D(
          `M${roll(p - unicornX, 1) * canvas.width},${roll(
            (n / 10) * i - unicornY,
            canvas.height
          )}l-2,-35`
        )
      );
    });
  }

  switch (screen) {
    // HOME SCREEN
    case 0:
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00000020";
      ctx.fill();
      ctx.font = "bold 70px Calibri";
      ctx.save();
      const w = ctx.measureText("AURELIUS's").width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(
        min(1, canvas.width / (w + 60)),
        min(1, canvas.width / (w + 60))
      );
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      const g = ctx.createLinearGradient(
        canvas.width / 2 - w / 2,
        canvas.height / 2,
        canvas.width / 2 + w / 2,
        canvas.height / 2
      );
      colors.forEach((v, i) => {
        g.addColorStop(i / 6, v);
      });
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.fillStyle = g;
      ctx.textAlign = "center";
      ctx.filter = "source-in";
      const u = (canvas.height * 1) / 3;
      ctx.fillText("AURELIUS's", canvas.width / 2, u);
      // ctx.shadowColor = "#00000070";
      ctx.shadowBlur = 2;
      ctx.font = "normal 30px system-ui";
      ctx.fillStyle = "#dadaff";
      ctx.fillText("seven trials", canvas.width / 2, u + 40);
      ctx.font = "normal 15px system-ui";
      ctx.fillStyle = "#9d9d9d";
      ctx.fillText("to restore the rainbow", canvas.width / 2, u + 60);
      ctx.shadowOffsetY = n % 1000 < 500 ? 0 : 8;
      ctx.font = `normal ${n % 1000 < 500 ? 13 : 15}px system-ui`;
      ctx.fillText(
        "[SPACE] TO BEGIN",
        canvas.width / 2,
        canvas.height / 2 + 150 + (n % 1000 < 500 ? 2 : 0)
      );
      ctx.restore();
      break;
    // GAME SCREEN
    case 1:
      ctx.fillStyle = clean_colors[level];
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "start";
      ctx.textBaseline = "top";
      ctx.fillText(
        "lvl " + level + ": " + levels[level].n[1].toUpperCase(),
        15,
        15
      );
      (camX = unicornX), (camY = unicornY);
      ctx.save();
      ctx.translate(canvas.width / 2 - camX, canvas.height / 2 - camY);

      // ctx.beginPath();
      levels[level].d();

      platforms.forEach((p) => {
        ctx.beginPath();
        ctx.rect(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h);
        ctx.strokeStyle = "white";
        ctx.setLineDash([10, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        // console.log('bh');
      });

      //running unicorn
      drawUnicorn(
        unicornX,
        unicornY,
        unicornVX,
        unicornVY,
        unicornW,
        unicornH,
        unicornRunning,
        unicornAnimationStartTime,
        unicornDir,
        inair
      );
      ctx.restore();
      break;
  }
  // transitioning
  if (transitionStart !== 0 && n - transitionStart <= 3000) {
    ctx.beginPath();
    colors.forEach((color, i) => {
      const shift = 500 * (1 - (Math.sin((i / 7) * 3.141) / 2 + 0.5)); //500 * (1 - i / 7);
      const t = sin(
        (n - transitionStart <= 1000
          ? (n - transitionStart) / 2000
          : n - transitionStart <= 2000 + shift
          ? 0.5
          : Math.max(0, (n - transitionStart - 2000 - shift) / (1000 - shift)) +
            0.5) * Math.PI
      );
      let x = (t * canvas.width) / 2,
        y = (i / 7) * canvas.height,
        w = canvas.width / 2,
        h = canvas.height / 7;
      ctx.beginPath();
      ctx.rect(x - canvas.width / 2, y, w, h);
      ctx.rect(canvas.width - x, y, w, h);
      ctx.fillStyle = color;
      ctx.shadowColor = "#0000005c";
      ctx.shadowOffsetY = -5;
      ctx.shadowBlur = 5;

      ctx.fill();
      ctx.shadowColor = "#00000000";
    });
  }
}
animate(); // THE STARTUP

// addEventListener("click", () => {
//   unicorn_running = !unicorn_running;
// });
addEventListener("keydown", (e) => {
  if (
    e.code === "Space" &&
    screen === 0 &&
    now() - transitionStart >= 3000 &&
    !e.shiftKey
  ) {
    transitionTo(1);
  } else if (e.code === "Space") {
    if (window.a) {
      cancelAnimationFrame(window.a);
      window.a = null;
    } else {
      animate();
    }
  }
  if (e.code === "KeyN" && !window.a) {
    animate();
    cancelAnimationFrame(window.a);
    window.a = null;
  }
});
addEventListener("keydown", k);
addEventListener("keyup", k);
function k(e) {
  keysDown[e.key.toLowerCase()] = e.type === "keydown";
}

addEventListener("click", () => {
  if (screen === 0 && now() - transitionStart >= 3000) {
    transitionTo(1);
  }
});
