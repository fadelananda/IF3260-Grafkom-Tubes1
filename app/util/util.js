const setUpCanvasBackground = (gl) => {
  /**
   * Set canvas color to some rgba value
   */
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

const createShader = (gl, type, source) => {
  /**
   * Create shader
   */
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  // console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  /**
   * Create program
   */
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  // console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const createGlBuffer = (gl, array, program, name, attr) => {
  /**
   * Create buffer and get attribute
   */
  var vertices = [];
  //gambar persegi panjang
  vertices = gambarPersegiPanjang(array, vertices)
  //gambar garis
  for (let i = 0; i < array.length; i+=2) {
    
    
  }
  // console.log(vertices)
  if (name === "persegi") {
    vertices = getPersegiVertices(array);
  }
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) throw new Error("failed to create buffer");
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  if (name === "triangles" || name === "poligon")
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
  if (name === "persegi_panjang" || name === "persegi")
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  if (name === "lines")
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
  var aPosition = gl.getAttribLocation(program, "a_position");
  if (aPosition < 0) throw new Error("failed to get attribute from program");

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(aPosition, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(aPosition);

  // console.log("name");
  // console.log(name);
  if (name === "triangles" || name === "poligon" || name==="lines") return array.length / 2;
  if (name === "persegi_panjang" || name === "persegi") return vertices.length / 2;
  // array.length / size;
};

function gambarPersegiPanjang(array, vertices) {
  for (let i = 0; i < array.length / 4; i++) {
    // (1,1) (2,2)
    var tri1 = [
      array[0 + i * 4],
      array[1 + i * 4],
      array[2 + i * 4],
      array[3 + i * 4],
      array[0 + i * 4],
      array[3 + i * 4],
    ];

    var tri2 = [
      array[0 + i * 4],
      array[1 + i * 4],
      array[2 + i * 4],
      array[3 + i * 4],
      array[2 + i * 4],
      array[1 + i * 4],
    ];
    if (!tri1.includes(undefined) && !tri2.includes(undefined)) {
      vertices = vertices.concat(tri1).concat(tri2);
    }

  }
  return vertices
  
}

function getPersegiVertices(array) {
  var vertices =  []

  for (let i = 0; i < Math.floor(array.length/4); i++) {
    // given, (x1, y1) (x2, y2)
    // find the maximum length between x, y axis
    const x1 = array[0+i*4];
    const y1 = array[1+i*4];
    const x2 = array[2+i*4];
    const y2 = array[3+i*4];

    var tri1 = [
      x1, y1,
      x2, y1,
      x1, y2,
    ];
    
    var tri2 = [
      x1, y2,
      x2, y1,
      x2, y2
    ];

    if (!tri1.includes(undefined) && !tri2.includes(undefined)){
      vertices = vertices.concat(tri1).concat(tri2)
    }
  }

  return vertices
} 

const draw = (gl, array, program, type, name) => {
  var n = createGlBuffer(gl, array, program, name);
  if (n < 0) throw new Error("failed to initialize buffer");
  gl.drawArrays(type, 0, n);
};

const incColor = (gl, type, fColor, currColor) => {
  switch (type) {
    case "R":
      if (currColor[0] < 1) currColor[0]  = currColor[0]+0.1
      break;
    case "T":
      if (currColor[0] > 0) currColor[0] = currColor[0]-0.1
      break;
    case "G":
      if (currColor[1] < 1) currColor[1]  = currColor[1]+0.1
      break;
    case "H":
      if (currColor[1] > 0) currColor[1] = currColor[1]-0.1
      break;
    case "B":
      if (currColor[2] < 1) currColor[2]  = currColor[2]+0.1
      break;
    case "N":
      if (currColor[2] > 0) currColor[2] = currColor[2]-0.1
      break;
    case "A":
      if (currColor[3] < 1) currColor[3]  = currColor[3]+0.1
      break;
    case "S":
      if (currColor[3] > 0) currColor[3] = currColor[3]-0.1
      break;

    default:
      break;
  }
  
  gl.uniform4f(fColor, currColor[0], currColor[1], currColor[2], currColor[3]);
  return currColor
};

const getCoordinate = (event, canvas) => {
  var x = event.clientX,
    y = event.clientY;

  var midX = canvas.width / 2,
    midY = canvas.height / 2;

  var rect = event.target.getBoundingClientRect();

  // return [((x - rect.left) - midX)/midX, (midY - (y - rect.top))/midY];
  return {
    x: (x - rect.left - midX) / midX,
    y: (midY - (y - rect.top)) / midY,
  };
};

const saveModel = (file, text) => {
  //creating an invisible element
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", file);

  // Above code is equivalent to
  // <a href="path of file" download="file name">

  document.body.appendChild(element);

  //onClick property
  element.click();

  document.body.removeChild(element);
};

export {
  setUpCanvasBackground,
  createProgram,
  createShader,
  draw,
  getCoordinate,
  createGlBuffer,
  saveModel,
  incColor,
};
