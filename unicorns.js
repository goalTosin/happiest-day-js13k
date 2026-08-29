/**
 * @typedef {Object} Unicorn 
 * @property {number} x
 * @property {number} y
 * @property {number} s animation state: 0 for idle, 1 for walking, 2 for running, 3 for dancing
 * @property {number} a current action: 0 for user-controlled, 1 for seeking color, 2 for returning
 * @property {number} c current scene index
 */
/**
 * @type {Unicorn[]}
 */

const unicorns = []; // the holy grail
/**
 * @returns {Unicorn}
 */
function unicorn(x, y, state, action =1) {
  return {
    x,
    y,
    s: state, 
    a: action,
    c: 0
  }; // i want to conserve the most space because minifiers cant minify object properties, hence the one-letter naming for all props
}
unicorns.push(unicorn(50, 50, 0, 1))
/**
 *
 * @param {CanvasRenderingContext2D} ctx
 */
function drawUnicorn(ctx, unicorn, h) {
  // let s = h
  // unicorn's center is at its base
  ctx.beginPath();
  ctx.rect(unicorn.x - 20, unicorn.y - h, 40, h);
  ctx.fillStyle = "#ffd7f8";
  ctx.fill();
}

function updateUnicorns() {}

export { unicorns, unicorn, drawUnicorn, updateUnicorns };
