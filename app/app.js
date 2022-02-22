import {
  setUpCanvasBackground,
  createShader,
  createProgram,
  draw,
  getCoordinate,
} from "./util/util.js";

function main() {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  const points = [];

  if (!gl) return;

  const vertexShaderSource = document.querySelector("#vertex-shader").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  var vertices = [
    -0.5, -0.5, -0.5, +0.5, 0.0, +0.5, 0.0, 0.0, 0.0, -0.5, +0.5, -0.5,
  ];

  setUpCanvasBackground(gl);
  draw(gl, vertices, program, gl.TRIANGLES);

  canvas.addEventListener("mousedown", (event) => {
    // console.log(getCoordinate(event, [], canvas));
    // points.push(getCoordinate(event, points, canvas));
    // var point = getCoordinate(event, points, canvas)
    points.push(getCoordinate(event, points, canvas).x);
    points.push(getCoordinate(event, points, canvas).y);
    draw(gl, points, program, gl.TRIANGLES);
  });
}

main();
