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
  persegi: {
    name: "persegi",
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
  const squareLen = document.querySelector("#input-square-len")
  const squareActionEl = document.getElementsByName("square_action");
  let squareAction = document.querySelector('input[name="square_action"]:checked').value;

  squareActionEl[0].addEventListener('change', function() {
    if(squareActionEl[0].checked) {
      squareAction = squareActionEl[0].value;
      drawPersegiCanvas();
    }
  })

  squareActionEl[1].addEventListener('change', function() {
    if(squareActionEl[1].checked) {
      squareAction = squareActionEl[1].value;
      drawPersegiCanvas();
    }
  })

  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  const points = [];
  var buffer;
  var colorbuffer;
  var mouseClicked = false;
  var end = []
  var lines = [];
  var start = [];
  var bufferline =[]
  let squareAttr = {
    len: 0,
    point_idx: 0,
    x_dir: 1,
    y_dir: 1,
  }

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
    hideSquareUtils();
    drawTriangleCanvas();
  };

  persegiPanjangBtn.onclick = () => {
    hideSquareUtils();
    drawPersegiPanjangCanvas();
  };

  polygonBtn.onclick = () => {
    hideSquareUtils();
    drawPoligonCanvas();
  };

  garisBtn.onclick = () => {
    hideSquareUtils();
    drawLineCanvas();
  }

  persegiBtn.onclick = () => {
    showSquareUtils();
    drawPersegiCanvas();
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
    draw(
      gl,
      objects.persegi.vertices,
      program,
      gl.TRIANGLES,
      objects.persegi.name,
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

  function drawPersegiCanvas() {
    console.log(squareAction);
    if(squareAction === "Draw Persegi") {
      canvas.onmousedown = (event) => {
        console.log("on draw persegi canvas");
        objects.persegi.vertices.push(getCoordinate(event, canvas).x);
        objects.persegi.vertices.push(getCoordinate(event, canvas).y);
        if(objects.persegi.vertices.length%4 == 0)
          setInitialPersegiCoordinate();
        draw(
          gl,
          objects.persegi.vertices,
          program,
          gl.TRIANGLES,
          objects.persegi.name
        );
        // checkSquare(getCoordinate(event, canvas));
      }
    } else {
      canvas.onmousedown = function(event) {
        // var squareLen = document.querySelector("#input-square-len")
        // var new_square_len = squareLen.cloneNode(true);
        // squareLen.parentNode.replaceChild(new_square_len, squareLen);
        const { x, y } = getCoordinate(event, canvas);
        const currPoint = {
          x, y
        }
        const currIdxSquare = getNearestSquareFromCurrentPoint(currPoint);
        // console.log(currIdxSquare);
        if(currIdxSquare != null) {
          const x1 = objects.persegi.vertices[0+currIdxSquare*4];
          const y1 = objects.persegi.vertices[1+currIdxSquare*4];
          const x2 = objects.persegi.vertices[2+currIdxSquare*4];
          const y2 = objects.persegi.vertices[3+currIdxSquare*4];
          const x_dir = (x2-x1) > 0 ? 1 : -1;
          const y_dir = (y2-y1) > 0 ? 1 : -1;
          const currLen = Math.max(Math.abs(x1-x2), Math.abs(y1-y2));

          squareLen.disabled = false;
          squareLen.value = currLen;

          const resizeSquare = function(event) {
            console.log('tes');
            console.log(currIdxSquare);
            const x1 = objects.persegi.vertices[0+currIdxSquare*4];
            const y1 = objects.persegi.vertices[1+currIdxSquare*4];
            const inputLen =  parseFloat(event.target.value);

            const new_x2 = x1 + (inputLen)*x_dir;
            const new_y2 = y1 + (inputLen)*y_dir;
            
            let beforeCurrSquare = objects.persegi.vertices.slice(0, 0+(currIdxSquare)*4);
            let afterCurrSquare = objects.persegi.vertices.slice(0+(currIdxSquare+1)*4)
            let updatedPoints = [x1, y1, new_x2, new_y2];
            
            console.log(objects.persegi.vertices);
            console.log(beforeCurrSquare);
            console.log(updatedPoints);
            console.log(afterCurrSquare);
            
            objects.persegi.vertices = beforeCurrSquare.concat(updatedPoints).concat(afterCurrSquare);
            
            console.log("After concat:", objects.persegi.vertices)
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.DEPTH_TEST);
            drawAll();
          }
          squareLen.addEventListener("input", resizeSquare, true);
          const changeSquare = document.querySelector("#change_square");

          changeSquare.addEventListener("click", function(){
            squareLen.removeEventListener("input", resizeSquare, true);
          });
        }
      }
    }

    function setInitialPersegiCoordinate() {
      const last_idx = objects.persegi.vertices.length/4-1;
      console.log(objects.persegi.vertices);
      const x1 = objects.persegi.vertices[0+last_idx*4];
      const y1 = objects.persegi.vertices[1+last_idx*4];
      const x2 = objects.persegi.vertices[2+last_idx*4];
      const y2 = objects.persegi.vertices[3+last_idx*4];
      
      const x_dir = (x2-x1) > 0 ? 1 : -1;
      const y_dir = (y2-y1) > 0 ? 1 : -1;
      
      let mxLen = Math.max(Math.abs(x1-x2), Math.abs(y1-y2));
      const new_x2 = x1 + mxLen*x_dir;
      const new_y2 = y1 + mxLen*y_dir;

      let beforeEnd = objects.persegi.vertices.slice(0, 0+(last_idx)*4);
      let updatedEnd = [x1, y1, new_x2, new_y2];

      objects.persegi.vertices = beforeEnd.concat(updatedEnd);
    }
  }

  const getNearestSquareFromCurrentPoint = (givenCoordinate) => {
    const x_cor = givenCoordinate.x;
    const y_cor = givenCoordinate.y;
    const minDist = {val : 1000000007, idx_square: null };

    const computeDist = (x1, y1, x2, y2) => {
      const min_X = Math.min(Math.abs(x1-x_cor), Math.abs(x2-x_cor));
      const min_Y = Math.min(Math.abs(y1-y_cor), Math.abs(y2-y_cor));

      return Math.sqrt(min_X*min_X + min_Y*min_Y);
    }

    for (let i = 0; i < Math.floor(objects.persegi.vertices.length/4); i++) {
      // given, (x1, y1) (x2, y2)
      const x1 = objects.persegi.vertices[0+i*4];
      const y1 = objects.persegi.vertices[1+i*4];
      const x2 = objects.persegi.vertices[2+i*4];
      const y2 = objects.persegi.vertices[3+i*4];
      
      const mxLen = Math.max(Math.abs(x1-x2), Math.abs(y1-y2));
      const x_dir = (x2-x1) >= 0 ? 1 : -1;
      const y_dir = (y2-y1) >= 0 ? 1 : -1;
      
      const new_x2 = x1 + mxLen*x_dir;
      const new_y2 = y1 + mxLen*y_dir;
      

      const currDist = computeDist(x1, y1, new_x2, new_y2);

      if(currDist < minDist.val) {
        minDist.val = currDist;
        minDist.idx_square = i;
      }
    }
    return minDist.idx_square;
  }


  function showSquareUtils() {
    const squareUtils = document.querySelector("#square-utils");
    squareUtils.style.display = 'block';
  }

  
  function hideSquareUtils() {
    const squareUtils = document.querySelector("#square-utils");
    squareUtils.style.display = 'none';
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