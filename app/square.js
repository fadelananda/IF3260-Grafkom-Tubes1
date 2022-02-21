import {
    setUpCanvasBackground,
    createShader,
    createProgram,
} from "./util/util.js";
  
function main() {
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  
    if (!gl) return;
  
    const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    const fragmentShaderSource = document.querySelector("#fragment-shader").text;
    const squareLenEl = document.querySelector("#square-length");
    let squareLen = Math.max(1, parseInt(squareLenEl.value));

  
    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
  
    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);
    
    render(gl, program, squareLen);
    squareLenEl.addEventListener('input', (e) => {
        const currLen = parseInt(e.target.value);
        if(currLen < 0) squareLen = 100;
        else squareLen = parseInt(e.target.value) || 100;
        render(gl, program, squareLen);
    });
}

function render(gl, program, length) {
    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    
    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();
    
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // code above this line is initialization code.
    // code below this line is rendering code.
    
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
    // Clear the canvas
    setUpCanvasBackground(gl);
  
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
  
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setSquare(gl, length)
  
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

function setSquare(gl, length) {
    var x1 = 0;
    var x2 = length;
    var y1 = 0;
    var y2 = length;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW);
}
main();
  