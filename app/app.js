import { drawTriangles } from "./util/triangles.js";
import {
  setUpCanvasBackground,
  createShader,
  createProgram,
  draw,
  getCoordinate,
  saveModel,
} from "./util/util.js";


// const modif_point = (idx, new_points) => {
//   console.log("points(before): ", points);
//   const { x1, y1, x2, y2 } =  new_points;

//   const tmp_points = [];
//   for (let i = 0; i < Math.floor(points.length/4); i++) {
//     if(i == idx) {
//       tmp_points.push(x1);
//       tmp_points.push(y1);
//       tmp_points.push(x2);
//       tmp_points.push(y2);
//     } else {
//       const x1_ = points[0+i*4];
//       const y1_ = points[1+i*4];
//       const x2_ = points[2+i*4];
//       const y2_ = points[3+i*4];
//       tmp_points.push(x1_);
//       tmp_points.push(y1_);
//       tmp_points.push(x2_);
//       tmp_points.push(y2_);
//     }
//   }

//   points = [...tmp_points];
//   console.log("points(after): ", points);
// }

// export { modif_point };

function main() {
  const canvas = document.querySelector("canvas");

  const saveBtn = document.querySelector("#save-btn");
  const importBtn = document.querySelector("#import-btn");

  const exportFileName = document.querySelector("#export-filename");
  const importFileName = document.querySelector("#import-filename");
  const squareLen = document.querySelector("#input-square-len")

  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  let points = [];
  let squareAttr = {
    len: 0,
    point_idx: 0,
    x_dir: 1,
    y_dir: 1,
  }

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
  // draw(gl, vertices, program, gl.TRIANGLES);

  canvas.addEventListener("mousedown", (event) => {
    // console.log(getCoordinate(event, [], canvas));
    // points.push(getCoordinate(event, points, canvas));
    // var point = getCoordinate(event, points, canvas)
    points.push(getCoordinate(event, points, canvas).x);
    points.push(getCoordinate(event, points, canvas).y);
    draw(gl, points, program, gl.TRIANGLES);
    // drawTriangles(gl, points, program);
    checkSquare(getCoordinate(event, points, canvas));
  });

  // // lookup uniforms
  // var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  squareLen.addEventListener("input", (event) => {
    const deltaLen = parseFloat(event.target.value)-squareAttr.len;
    const changeSquareLenAttr = {
      delta: deltaLen,
      point_idx: squareAttr.point_idx,
    }

    draw(gl, points, program, gl.TRIANGLES, changeSquareLenAttr);
  });

  const checkSquare = (givenCoordinate) => {
    const x_cor = givenCoordinate.x;
    const y_cor = givenCoordinate.y;
    const minDist = {val : 1000000007, cor: {}};

    const computeDist = (x1, y1, x2, y2) => {
      const min_X = Math.min(Math.abs(x1-x_cor), Math.abs(x2-x_cor));
      const min_Y = Math.min(Math.abs(y1-y_cor), Math.abs(y2-y_cor));

      return Math.sqrt(min_X*min_X + min_Y*min_Y);
    }

    for (let i = 0; i < Math.floor(points.length/4); i++) {
      // given, (x1, y1) (x2, y2)
      const x1 = points[0+i*4];
      const y1 = points[1+i*4];
      const x2 = points[2+i*4];
      const y2 = points[3+i*4];
      
      const mxLen = Math.max(Math.abs(x1-x2), Math.abs(y1-y2));
      const x_dir = (x2-x1) >= 0 ? 1 : -1;
      const y_dir = (y2-y1) >= 0 ? 1 : -1;
      
      const new_x2 = x1 + mxLen*x_dir;
      const new_y2 = y1 + mxLen*y_dir;
      

      const currDist = computeDist(x1, y1, new_x2, new_y2);

      if(currDist < minDist.val) {
        minDist.val = currDist;
        minDist.cor = { x1, y1, new_x2, new_y2 };
        squareAttr.point_idx = i;
        squareAttr.x_dir = x_dir;
        squareAttr.y_dir = y_dir;
      }
    }
    console.log(minDist);

    if(minDist.val != 1000000007) {
      squareLen.disabled = false;
      const len = Math.abs(minDist.cor.x1 - minDist.cor.new_x2);
      squareLen.value = len;
      squareAttr.len = len;
    } else {
      squareLen.disabled = true;
    }
  }

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
}

main();
