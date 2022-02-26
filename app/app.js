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
  var buffer;
  var colorbuffer;
  var mouseClicked = false;
  var end = []
  var lines = [];
  var start = [];
  var bufferline =[]

  var currColor = [0, 1, 0, 1];
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
  gl.program = program;

  gl.uniform4f(fColorLocation, 0, 1, 0, 1);
  setUpCanvasBackground(gl);

  segitigaBtn.onclick = () => {
    drawTriangleCanvas();
  };

  persegiPanjangBtn.onclick = () => {
    drawPersegiPanjangCanvas();
  };

  polygonBtn.onclick = () => {
    drawPoligonCanvas();
  };

  garisBtn.onclick = () => {
    drawLineCanvas();
  }

  // used to save the model
  saveBtn.onclick = () => {
    if (exportFileName.value === undefined || exportFileName.value === "")
      exportFileName.value = "model";
    var value = {
      name: `${exportFileName.value}`,
      objects: objects,
    };
    saveModel(`${exportFileName.value}.json`, JSON.stringify(value));
  };

  // used to import model and draw to canvas
  importBtn.onclick = () => {
    console.log(importFileName.files[0].name);
    var fileName = importFileName.files[0].name;
    var fileValue = fetch(`./models/${fileName}`)
      .then((response) => {
        return response.json();
      })
      .then((jsondata) => {
        draw(
          gl,
          jsondata.objects.triangles.vertices,
          program,
          gl.TRIANGLES,
          jsondata.objects.triangles.name
        );
        draw(
          gl,
          jsondata.objects.persegi_panjang.vertices,
          program,
          gl.TRIANGLES,
          jsondata.objects.persegi_panjang.name
        );
        draw(
          gl,
          jsondata.objects.poligon.vertices,
          program,
          gl.TRIANGLE_STRIP,
          jsondata.objects.poligon.name
        );
      });
  };

  function keyDown(event) {
    if (document.activeElement.type != "text") {
      currColor = incColor(
        gl,
        String.fromCharCode(event.keyCode),
        fColorLocation,
        currColor
      );
    }
    drawAll();
  }

  irBtn.addEventListener("click", () => {
    currColor = incColor(gl, "R", fColorLocation, currColor);
    drawAll();
  });

  igBtn.addEventListener("click", () => {
    currColor = incColor(gl, "G", fColorLocation, currColor);
    drawAll();
  });

  ibBtn.addEventListener("click", () => {
    currColor = incColor(gl, "B", fColorLocation, currColor);
    drawAll();
  });

  iaBtn.addEventListener("click", () => {
    currColor = incColor(gl, "A", fColorLocation, currColor);
    drawAll();
  });

  drBtn.addEventListener("click", () => {
    currColor = incColor(gl, "T", fColorLocation, currColor);
    drawAll();
  });

  dgBtn.addEventListener("click", () => {
    currColor = incColor(gl, "H", fColorLocation, currColor);
    drawAll();
  });

  dbBtn.addEventListener("click", () => {
    currColor = incColor(gl, "N", fColorLocation, currColor);
    drawAll();
  });

  daBtn.addEventListener("click", () => {
    currColor = incColor(gl, "S", fColorLocation, currColor);
    drawAll();
  });
  function drawAll() {
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
  function drawLineCanvas() {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * 200000, gl.STATIC_DRAW);
    var a_position = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);

    function createLine(start, end) {
      const width = 0.003;
      const deg = Math.atan2(end[1]-start[1], end[0]-start[0]) * 180 / Math.PI;
      var p1 = rotation(start[0], start[1], start[0], start[1]-width, -deg);
      var p2 = rotation(start[0], start[1], start[0], start[1]+width, -deg);
      var p3 = rotation(end[0], end[1], end[0], end[1]+width, -deg);
      var p4 = rotation(end[0], end[1], end[0], end[1]-width, -deg);
      return [
          p1[0], p1[1],
          p2[0], p2[1],
          p3[0], p3[1], 
          p4[0], p4[1],
      ];
    }
    function renderLine(gl, start, end, buffer) {
      var renderedLine = [];
      if (start.length != 0) {
          createLine(start,end).forEach(el => renderedLine.push(el));
      }
    
      lines.forEach((el) => {
          el.forEach((el2) => renderedLine.push(el2));
      });
    
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(renderedLine));
      for (var i = 0; i < renderedLine.length / 8; ++i) gl.drawArrays(gl.TRIANGLE_STRIP, 4 * i, 4);
    }
    function rotation(ax, ay, bx, by, angle) {
      var rad = (Math.PI / 180) * angle,
          cos = Math.cos(rad),
          sin = Math.sin(rad),
          run = bx - ax,
          rise = by - ay,
          cx = (cos * run) + (sin * rise) + ax,
          cy = (cos * rise) - (sin * run) + ay;
      return [cx, cy];
    }
    canvas.addEventListener('mousemove', (e) => {
      if (mouseClicked) {
          var x = -1 + 2*e.offsetX/canvas.width;
          var y = -1 + 2*(canvas.height - e.offsetY)/canvas.height;
          end = [x,y];
          renderLine(gl, start, end, buffer);
      }
      });
    canvas.addEventListener('mouseup', () => {
      mouseClicked = false;
      lines.push(createLine(start, end));
      start = [];
      end = []; 
      renderLine(gl, start, end, buffer);
    });
    canvas.onmousedown = (e) => {
    mouseClicked = true;
    var x = -1 + 2*e.offsetX/canvas.width;
    var y = -1 + 2*(canvas.height - e.offsetY)/canvas.height;
    start = [x,y];
    end = [x,y];
    renderLine(gl, start, end, buffer);
  };
  }
}

main();
