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

const createGlBuffer = (gl, array, program, name) => {
  /**
   * Create buffer and get attribute
   */
  var vertices = []
  // gambar poligon
  // for (let i = 0; i < array.length/8; i++) {
  //   var tri1 = [
  //     array[6+i*8], array[7+i*8],
  //     array[4+i*8], array[5+i*8],
  //     array[2+i*8], array[3+i*8],
  //   ]
  
  //   var tri2 = [
  //     array[6+i*8], array[7+i*8],
  //     array[2+i*8], array[3+i*8],
  //     array[0+i*8], array[1+i*8],
  //   ]
  //   if (!tri1.includes(undefined) && !tri2.includes(undefined)){
  //     vertices = vertices.concat(tri1).concat(tri2)
  //     console.log("drawn");
  //   }
  // }
  //gambar persegi panjang
  for (let i = 0; i < array.length/4; i++) {
    // (1,1) (2,2)
    var tri1 = [
      array[0+i*4], array[1+i*4],
      array[2+i*4], array[3+i*4],
      array[0+i*4], array[3+i*4],
    ]
  
    var tri2 = [
      array[0+i*4], array[1+i*4],
      array[2+i*4], array[3+i*4],
      array[2+i*4], array[1+i*4],
    ]
    if (!tri1.includes(undefined) && !tri2.includes(undefined)){
      vertices = vertices.concat(tri1).concat(tri2)
    }
  }
  // console.log(vertices)
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) throw new Error("failed to create buffer");
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  if(name==="triangles")
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
  if(name==="persegi_panjang")
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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
  if(name==="triangles")
    return array.length/2;
  if(name==="persegi_panjang")
    return vertices.length/2;
  // array.length / size;
};

const draw = (gl, array, program, type, name) => {
  var n = createGlBuffer(gl, array, program, name);
  if (n < 0) throw new Error("failed to initialize buffer");
  // gl.drawArrays(gl.LINE_STRIP, 0, n);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);
  // if(name==="triangles")
  gl.drawArrays(type, 0, n);
  // else
  //   gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

const incColor = (gl, type, fColor) => {
  switch (type) {
    case "R":
      gl.uniform4f(fColor, 1, 0, 0, 1);
      console.log("r");
      break;
    case "G":
      gl.uniform4f(fColor, 0, 1, 0, 1);
      console.log("g");
      break;
    case "B":
      gl.uniform4f(fColor, 0, 0, 1, 1);
      console.log("b");
      break;
    case "A":
      gl.uniform4f(fColor, 0, 0, 0, 1);
      console.log("a");
      break;
  
    default:
      break;
  }
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
  incColor
};
