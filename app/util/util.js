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

  console.log(gl.getShaderInfoLog(shader));
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

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const createGlBuffer = (gl, array, program) => {
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
      console.log("drawn");
    }
  }
  console.log(vertices)
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) throw new Error("failed to create buffer");
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var aPosition = gl.getAttribLocation(program, "a_position");
  if (aPosition < 0) throw new Error("failed to get attribute from program");

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    aPosition,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.enableVertexAttribArray(aPosition);

  return vertices.length/2;
};

const draw = (gl, array, program, type) => {
  var n = createGlBuffer(gl, array, program);
  if (n<0) throw new Error('failed to initialize buffer');

  
  // gl.drawArrays(gl.LINE_STRIP, 0, n);
  // gl.drawArrays(gl.LINE_LOOP, 0, n);
  gl.drawArrays(type, 0, n);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

const getCoordinate = (event, points, canvas) => {
  var x = event.clientX, y = event.clientY;

  var midX = canvas.width/2, midY = canvas.height/2;

  var rect = event.target.getBoundingClientRect();

  // return [((x - rect.left) - midX)/midX, (midY - (y - rect.top))/midY];
  return {x:((x - rect.left) - midX)/midX, y:(midY - (y - rect.top))/midY};
}

export { setUpCanvasBackground, createProgram, createShader, draw, getCoordinate };
