import { drawUnicorn, unicorn, unicorns } from "./unicorns.js";
import { clamp } from "./utils.js";

const canvas = document.querySelector("canvas");
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize); // resize setup
const ctx = canvas.getContext("2d");

const scenes = [
  [
    Date.now(),
    () => {
      ctx.textBaseline = "top";
      ctx.fillStyle = "white";
      ctx.fillText("Hey", 0, 0);
    },
  ],
  [
    0,
    () => {
      ctx.textBaseline = "top";
      ctx.fillStyle = "white";
      ctx.fillText("Hey2", 0, 0);
    },
  ],
  [
    0,
    () => {
      ctx.textBaseline = "top";
      ctx.fillStyle = "white";
      ctx.fillText("Hey3", 0, 0);
    },
  ],
];
const sceneFadeDur = 500;

function sceneSize(i) {
  const n = Date.now();
  let w = 400,
    h = 100;
  let maxScreensPerLine = Math.floor((innerWidth - 20) / (w + 40));
  let r = Math.floor(i / maxScreensPerLine);
  // console.log(((i + 1) * (w + 40) + 20) / innerWidth);

  return [
    20 + (i % maxScreensPerLine) * (w + 40),
    150 * (r + 1), //- Math.min(1, ((1-(scenes[i][0] - n)) / sceneFadeDur) ** 2) * 60 + 60,
    w,
    h,
  ];
}

function animate() {
  requestAnimationFrame(animate);
  let dt = 1;
  //update
  unicorns.forEach((unicorn) => {
    let sceneData = sceneSize(unicorn.c);
    if (unicorn.a === 1) {
      //if the unicorn is seeking a color
      unicorn.x += 20 * dt;
      unicorn.y = sceneData[1] + sceneData[3];
      if (unicorn.x > sceneData[0] + sceneData[2]) {
        // if the unicorn is out of the current scene
        if (unicorn.c >= scenes.length - 1) {
          // if the unicorn has reached the end of all scenes
          unicorn.a = 2; //returning
        } else {
          unicorn.c++;
          unicorn.x = sceneSize(unicorn.c)[0];
          scenes[unicorn.c][0] = Date.now(); // fade in the scene
        }
      }
      // console.log(unicorn.x, unicorn.y);
    }
  });
  //draw
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const n = Date.now();
  scenes.forEach((scene, i) => {
    if (scene[0] !== 0) {
      let sceneData = sceneSize(i);
      ctx.save();
      ctx.translate(sceneData[0], sceneData[1]);
      ctx.beginPath();
      ctx.rect(0, 0, sceneData[2], sceneData[3]);
      ctx.fillStyle = "#388ee4";
      ctx.globalAlpha = clamp(0, 1, (n - scene[0]) / sceneFadeDur);
      ctx.fill();
      ctx.globalAlpha = 1; //(n - scene[0])/ sceneFadeDur
      scene[1]();
      ctx.restore();
    }
  });
  unicorns.forEach((unicorn) => {

    drawUnicorn(ctx, unicorn, 25);
  });
}
animate(); // THE ENGINE STARTUP
