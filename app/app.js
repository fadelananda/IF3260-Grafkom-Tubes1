var canvas = document.querySelector("canvas");
var gl = canvas.getContext('webgl');

/*========== Defining and storing the geometry =========*/

var tri1;
var tri2;
var points = [];
function createNew(width, height) {
   var x=width/canvas.width
   var y=height/canvas.height

   tri1 = [
      -x,-y,0.0,
      x,-y,0.0,
      x,y,0.0,
   ]

   tri2 = [
      -x,y,0.0,
      -x,-y,0.0,
      x,y,0.0,
   ]

   // Bind appropriate array buffer to it
   // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tri1), gl.STATIC_DRAW);
   gl.drawArrays(gl.TRIANGLES, 0, 3);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tri2), gl.STATIC_DRAW);
   gl.drawArrays(gl.TRIANGLES, 0, 3);
}

/*============ Creating a canvas =================*/



function onmousedown(event) {
   points.push(Math.random());
   points.push(Math.random());
   points.push(0)
   draw();
}

function clash(p1, p2, p3, p4) {
   var x = Math.random()
   console.log(x);
   points.push(p1);
   points.push(-p1);
   points.push(0)
   points.push(p2);
   points.push(p2);
   points.push(0)
   points.push(-p3);
   points.push(p3)
   points.push(0)
   points.push(-p4);
   points.push(-p4);
   points.push(0)
   draw();
}

function draw(){
   var n = initBuff();
   gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initBuff() {
   // var vertices = new Float32Array(points);
   var vertices = [];
   // console.log(points);
   var count = 0
   // console.log(Math.floor(points.length/12));
   while (count < Math.floor(points.length/12) && points.length%4==0) {
      x = points
      var temp1 = [
         x[9+count*12], x[10+count*12], x[11+count*12],
         x[6+count*12], x[7+count*12], x[8+count*12],
         x[3+count*12], x[4+count*12], x[5+count*12],
      ]
      
      var temp2 = [
         x[9+count*12], x[10+count*12], x[11+count*12],
         x[3+count*12], x[4+count*12], x[5+count*12],
         x[0+count*12], x[1+count*12], x[2+count*12],
      ]
      vertices = vertices.concat(temp1).concat(temp2)
      count+=1
      // console.log(count)
   }
   // console.log(vertices);
   var n = points.length/2;
   // console.log(n);
   var vertices = new Float32Array(vertices)
   console.log(vertices, n)
   
   var vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   
   var aPosition = gl.getAttribLocation(shaderProgram, 'coordinates');
   gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(aPosition);

   return n
}
// Create an empty buffer object to store vertex buffer
var vertex_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tri1), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Create an empty buffer object to store Index buffer
var Index_Buffer = gl.createBuffer();

/*====================== Shaders =======================*/

// Vertex shader source code
var vertCode =
'attribute vec3 coordinates;' +
'void main(void) {' +
' gl_Position = vec4(coordinates, 1.0);' +
'}';

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// Fragment shader source code
var fragCode =
'void main(void) {' +
' gl_FragColor = vec4(1.0, 0.0, 0.0, 0.1);' +
'}';

// Create fragment shader object 
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to
// store the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

canvas.addEventListener('mousedown', function(event) { onmousedown(event); });
// /* ======= Associating shaders to buffer objects =======*/

// // Bind vertex buffer object
// gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// // Bind index buffer object
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer); 

// // Get the attribute location
// var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// // Point an attribute to the currently bound VBO
// gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

// // Enable the attribute
// gl.enableVertexAttribArray(coord);

// /*============= Drawing the Quad ================*/

// // Clear the canvas
gl.clearColor(0, 0, 0, 1);

// // Enable the depth test
gl.enable(gl.DEPTH_TEST);

// // Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// // Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// gl.drawArrays(gl.TRIANGLES, 0, 3);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tri2), gl.STATIC_DRAW);
// gl.drawArrays(gl.TRIANGLES, 0, 3);