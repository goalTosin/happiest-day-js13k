const { argv } = require("process");

if (argv.includes("-h") || argv.includes("--help") || argv.includes("-help")) {
  console.log(
    "Usage: node build [options]\n\nBasic options:\n-h, --help          Display this help message\n-r, --rollup-only   Build using only rollup"
  );
  process.exit();
}

const { exec, execSync } = require("child_process");
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const fs = require("fs");
const path = require("path");
const zipdir = require("zip-dir");

// function en(c) {
//   var x = "charCodeAt",
//     b,
//     e = {},
//     f = c.split(""),
//     d = [],
//     a = f[0],
//     g = 256;
//   for (b = 1; b < f.length; b++)
//     (c = f[b]),
//       null != e[a + c]
//         ? (a += c)
//         : (d.push(1 < a.length ? e[a] : a[x](0)), (e[a + c] = g), g++, (a = c));
//   d.push(1 < a.length ? e[a] : a[x](0));
//   for (b = 0; b < d.length; b++) d[b] = String.fromCharCode(d[b]);
//   return d.join("");
// }

// function compressJs(code) {
// console.log([...code.matchAll(/\b(var|let|const)\b \b.+?\b=.+?;/g)][0][0]);
// console.log([...code.matchAll(/function \b.+?\b(.*?)\{[\s\S]+?\}/g)][0][0]);
// code = code.replaceAll(/\b(var|let|const)\b \b.+?\b=.+?;/g,(variableDecl)=>{
//   if (variableDecl.substring(0,variableDecl.indexOf('=')+1).includes('function')) {
//     // console.log(variableDecl);
//     return variableDecl
//   }
//   console.log(variableDecl);
//   return variableDecl.substring(variableDecl.match(/\s/).index)
// })
// console.log(
//   [...code.matchAll(/this.hey/g)].map((k) => k.toString().substring(0, k.length - 1))
// );                |
// return `function z(b){var a,e={},d=[...b],c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")};eval(z(${JSON.stringify(
//   en(code)
// )}))`;
// }

function getFileSize(filePath) {
  return fs.readFileSync(filePath).byteLength;
}

function getDirSize(dir) {
  const children = fs.readdirSync(dir, { withFileTypes: true });
  return children.reduce((a, b) => {
    const getSize = (p) =>
      p.isFile()
        ? fs.readFileSync(path.join(dir, p.name)).byteLength
        : getDirSize(path.join(dir, p.name));
    return (a ? getSize(a) : 0) + (b ? getSize(b) : 0);
  });
}

function compressCss(code) {
  function removeCssComments(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, "");
  }
  function removeCssWhitespaces(css) {
    return css
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\s*{\s*/g, "{") // Remove spaces around curly braces
      .replace(/\s*}\s*/g, "}") // Remove spaces around closing curly braces
      .replace(/\s*;\s*/g, ";") // Remove spaces around semicolons
      .replace(/\s*:\s*/g, ":") // Remove spaces around colons
      .replace(/\s*,\s*/g, ",") // Remove spaces around commas
      .replace(/\s*>\s*/g, ">") // Remove spaces around child selectors
      .replace(/\s*\+\s*/g, "+") // Remove spaces around adjacent sibling selectors
      .replace(/\s*~\s*/g, "~") // Remove spaces around general sibling selectors
      .trim(); // Trim any leading or trailing whitespace
  }
  return removeCssWhitespaces(removeCssComments(code));
}

if (!existsSync("build")) {
  mkdirSync("build");
}

function logBuildSize() {
  const buildSize = getDirSize("./build");
  console.log(
    `Compiled to ${Number(buildSize / 1024).toFixed(2)}kb. ${
      existsSync("build.zip")
        ? `Zipped file size is ${Number(
            getFileSize("./build.zip") / 1024
          ).toFixed(2)}kb`
        : ""
    }`
  );
}
execSync("webpack", { stdio: "ignore" });

//.addListener("exit", () => {
if (!argv.includes("-w")) {
  execSync("npx roadroller build/bundle.js -o build/bundle.js", {
    stdio: "ignore",
  }); //.addListener("exit", () => {
  //});
}

writeFileSync(
  "build/index.html",
  readFileSync("index.html")
    .toString()
    .replaceAll(/\s+/g, " ")
    .replaceAll("> <", "><")
    .replaceAll(" />", "/>")
    .replace(
      /<script.*? src=".+?">\<\/script>/,
      '<script src="bundle.js"></script>'
    )
    .replaceAll(/<style>.+?<\/style>/g, (match) => {
      let css = compressCss(match.substring(7, match.length - 8));
      return `<style>${css}</style>`;
    })
);
zipdir("./build", { saveTo: "./build.zip" });
//});
logBuildSize();
