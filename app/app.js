import {
  setUpCanvasBackground,
  createShader,
  createProgram,
  draw,
  getCoordinate,
  incColor
} from "./util/util.js";

function main() {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  const points = [];
  document.onkeydown = keyDown;

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
  
  var fColorLocation = gl.getUniformLocation(program, "fColor");
  gl.useProgram(program);
  
  // var vertices = [
  //   -0.5, -0.5, -0.5, +0.5, 0.0, +0.5, 0.0, 0.0, 0.0, -0.5, +0.5, -0.5,
  // ];
  
  gl.uniform4f(fColorLocation, 1,0,0,1)
  setUpCanvasBackground(gl);
  // draw(gl, vertices, program, gl.TRIANGLES);

  canvas.addEventListener("mousedown", (event) => {
    // console.log(getCoordinate(event, [], canvas));
    // points.push(getCoordinate(event, points, canvas));
    // var point = getCoordinate(event, points, canvas)
    points.push(getCoordinate(event, points, canvas).x);
    points.push(getCoordinate(event, points, canvas).y);
    draw(gl, points, program, gl.TRIANGLES);
  });

  function keyDown(event) {
    incColor(gl,String.fromCharCode(event.keyCode),fColorLocation);
    draw(gl, points, program, gl.TRIANGLES)
  }
}

main();
