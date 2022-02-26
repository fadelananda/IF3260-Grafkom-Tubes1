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

const garisBtn = document.querySelector("#garis-btn");
const persegiBtn = document.querySelector("#persegi-btn");
const persegiPanjangBtn = document.querySelector("#persegi-panjang-btn");
const segitigaBtn = document.querySelector("#segitiga-btn");
const polygonBtn = document.querySelector("#polygon-btn");
const irBtn = document.querySelector("#ir-btn");
const igBtn = document.querySelector("#ig-btn");
const ibBtn = document.querySelector("#ib-btn");
const iaBtn = document.querySelector("#ia-btn");
const drBtn = document.querySelector("#dr-btn");
const dgBtn = document.querySelector("#dg-btn");
const dbBtn = document.querySelector("#db-btn");
const daBtn = document.querySelector("#da-btn");

const objects = {
  triangles: {
    name: "triangles",
    vertices: [],
  },
  persegi_panjang: {
    name: "persegi_panjang",
    vertices: [],
  },
  poligon: {
    name: "poligon",
    vertices: [],
  },
};

function main() {
  const canvas = document.querySelector("canvas");

  const saveBtn = document.querySelector("#save-btn");
  const importBtn = document.querySelector("#import-btn");

  const exportFileName = document.querySelector("#export-filename");
  const importFileName = document.querySelector("#import-filename");

  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  const points = [];
  
  var currColor = [0,1,0,1]
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

  gl.uniform4f(fColorLocation, 0, 1, 0, 1);
  setUpCanvasBackground(gl);
  // draw(gl, vertices, program, gl.TRIANGLES);

  // canvas.addEventListener("mousedown", (event) => {
  //   // console.log(getCoordinate(event, [], canvas));
  //   // points.push(getCoordinate(event, points, canvas));
  //   // var point = getCoordinate(event, points, canvas)
  //   points.push(getCoordinate(event, points, canvas).x);
  //   points.push(getCoordinate(event, points, canvas).y);
  //   console.log(points);
  //   draw(gl, points, program, gl.TRIANGLES);
  //   // drawTriangles(gl, points, program);
  // });

  segitigaBtn.onclick = () => {
    drawTriangleCanvas();
  };

  persegiPanjangBtn.onclick = () => {
    drawPersegiPanjangCanvas();
  };

  polygonBtn.onclick = () => {
    drawPoligonCanvas();
  };

  // used to save the model
  saveBtn.addEventListener("click", () => {
    console.log(exportFileName.value);
    if (exportFileName.value === undefined)
      exportFileName.value = "random.json";
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
    if (document.activeElement.type != "text") {
      currColor = incColor(gl, String.fromCharCode(event.keyCode), fColorLocation, currColor);
    }
    drawAll()
  }

  irBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "R", fColorLocation, currColor);
    drawAll()
  })

  igBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "G", fColorLocation, currColor);
    drawAll()
  })

  ibBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "B", fColorLocation, currColor);
    drawAll()
  })

  iaBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "A", fColorLocation, currColor);
    drawAll()
  })

  drBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "T", fColorLocation, currColor);
    drawAll()
  })

  dgBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "H", fColorLocation, currColor);
    drawAll()
  })

  dbBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "N", fColorLocation, currColor);
    drawAll()
  })

  daBtn.addEventListener("click", () =>{
    currColor = incColor(gl, "S", fColorLocation, currColor);
    drawAll()
  })
  function drawAll(){
    // add garis dan persegi here
    draw(
      gl,
      objects.triangles.vertices,
      program,
      gl.TRIANGLES,
      objects.triangles.name
    );
    draw(
      gl,
      objects.persegi_panjang.vertices,
      program,
      gl.TRIANGLES,
      objects.persegi_panjang.name
    );
    draw(
      gl,
      objects.poligon.vertices,
      program,
      gl.TRIANGLE_STRIP,
      objects.poligon.name
    );
  }

  function drawTriangleCanvas() {
    canvas.onmousedown = (event) => {
      console.log("on draw triangle");
      objects.triangles.vertices.push(getCoordinate(event, canvas).x);
      objects.triangles.vertices.push(getCoordinate(event, canvas).y);
      draw(
        gl,
        objects.triangles.vertices,
        program,
        gl.TRIANGLES,
        objects.triangles.name
      );
    };
  }

  function drawPersegiPanjangCanvas() {
    canvas.onmousedown = (event) => {
      console.log("on draw persegi panjang");
      objects.persegi_panjang.vertices.push(getCoordinate(event, canvas).x);
      objects.persegi_panjang.vertices.push(getCoordinate(event, canvas).y);
      draw(
        gl,
        objects.persegi_panjang.vertices,
        program,
        gl.TRIANGLES,
        objects.persegi_panjang.name
      );
    };
  }

  function drawPoligonCanvas() {
    canvas.onmousedown = (event) => {
      console.log("on draw poligon canvas");
      objects.poligon.vertices.push(getCoordinate(event, canvas).x);
      objects.poligon.vertices.push(getCoordinate(event, canvas).y);
      draw(
        gl,
        objects.poligon.vertices,
        program,
        gl.TRIANGLE_STRIP,
        objects.poligon.name
      );
    };
  }
}

main();
