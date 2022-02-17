const canvas = document.querySelector('#webgl-canvas');
const gl = canvas.getContext('webgl');

const setUpCanvasBackground = (gl) => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

setUpCanvasBackground(gl);