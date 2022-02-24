import { createGlBuffer } from "./util.js"

export const drawTriangles = (gl, array, program) => {
  var n = createGlBuffer(gl, array, program);
  if (n<0) throw new Error('failed to initialize buffer');

  gl.drawArrays(gl.TRIANGLES, 0, n);
};