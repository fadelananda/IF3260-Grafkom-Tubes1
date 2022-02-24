import { drawTriangles } from "./util/triangles.js";
import {
  setUpCanvasBackground,
  createShader,
  createProgram,
  draw,
  getCoordinate,
  incColor,
  saveModel,
} from "./util/util.js";

function main() {
  const canvas = document.querySelector("canvas");

  const saveBtn = document.querySelector("#save-btn");
  const importBtn = document.querySelector("#import-btn");

  const exportFileName = document.querySelector("#export-filename");
  const importFileName = document.querySelector("#import-filename");

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
    // draw(gl, points, program, gl.TRIANGLES);
    drawTriangles(gl, points, program);
  });

  // used to save the model
  saveBtn.addEventListener("click", () => {
    console.log(exportFileName.value);
    var value = {
      name: `${exportFileName.value}`,
      vertices: points,
    };
    saveModel(`${exportFileName.value}.json`, JSON.stringify(value));
    console.log("save");
  });

  // used to import model and draw to canvas
  importBtn.addEventListener("click", () => {
    console.log(importFileName.files[0].name);
    var fileName = importFileName.files[0].name;
    var fileValue = fetch(`./models/${fileName}`)
      .then((response) => {
        return response.json();
      })
      .then((jsondata) => {
        draw(gl, jsondata.vertices, program, gl.TRIANGLES);
        console.log(jsondata.vertices);
      });
  });

  function keyDown(event) {
    incColor(gl,String.fromCharCode(event.keyCode),fColorLocation);
    draw(gl, points, program, gl.TRIANGLES)
  }
}

main();
