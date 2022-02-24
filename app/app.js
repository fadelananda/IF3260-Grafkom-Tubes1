
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

function createShaders(gl, vs_source, fs_source) {
  // Compile shaders
  var vertexShader = shader(gl, vs_source, gl.VERTEX_SHADER);
  var fragmentShader = shader(gl, fs_source, gl.FRAGMENT_SHADER);

  // Create program
  var glProgram = gl.createProgram();

  // Attach and link shaders to the program
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program");
      return false;
  }

  // Use program
  gl.useProgram(glProgram);
  gl.program = glProgram;

  return true;
}

function shader(gl, src, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
      return;
  }
  return shader;
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
  for (var i = 0; i < renderedLine.length / 8; ++i) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

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


function startProgram(gl, canvas, buffer, mouseClicked, start, end, bufferline, lines) {
  // Konfigurasi
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Shaders
  var vertexShaderSource = document.getElementById('vertexShader').innerHTML;
  var fragmentShaderSource = document.getElementById('fragmentShader').innerHTML;
  if (!createShaders(gl, vertexShaderSource, fragmentShaderSource)) {
      console.log('Failed to intialize shaders.');
      return;}
  // Vertex Buffer
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, 8 * 200000, gl.STATIC_DRAW);
      var vPosition = gl.getAttribLocation(gl.program, 'vPosition');
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);

      canvas.addEventListener('mousemove', (e) => {
        if (mouseClicked) {
            var x = -1 + 2*e.offsetX/canvas.width;
            var y = -1 + 2*(canvas.height - e.offsetY)/canvas.height;
            var radio = document.getElementsByTagName('input');
            // var eventType;
            
            for (var i = 0; i < radio.length; ++i) {
                if (radio[i].type == 'radio' && radio[i].checked) {
                    if (radio[i].value == 'line') {
                        end = [x,y];
                    }
                    else if (radio[i].value == 'ubah-garis') {
                      if (bufferline.length > 0) {
                          if (bufferline[5] == 0) {
                              lines[bufferline[0]] = createLine([x,y], [bufferline[3], bufferline[4]]);
                          } else {
                              lines[bufferline[0]] = createLine([bufferline[1], bufferline[2]], [x,y]);
                          }
                      }
                    }
                }
            }
            renderLine(gl, start, end, buffer);
        }
    });
    canvas.addEventListener('mouseup', () => {
      mouseClicked = false;

      var radio = document.getElementsByTagName('input');
          
      for (var i = 0; i < radio.length; ++i) {
          if (radio[i].type == 'radio' && radio[i].checked) {
              if (radio[i].value == 'line') {
                  // Line Event
                  lines.push(createLine(start, end));
                  start = [];
                  end = [];
              }
              else if (radio[i].value == 'ubah-garis') {
                bufferline= [];
            } 
          }
      }
      renderLine(gl, start, end, buffer);
  });

  canvas.addEventListener('mousedown', (e) => {
    mouseClicked = true;
    var x = -1 + 2*e.offsetX/canvas.width;
    var y = -1 + 2*(canvas.height - e.offsetY)/canvas.height;

    var radio = document.getElementsByTagName('input');
        
    for (var i = 0; i < radio.length; ++i) {
        if (radio[i].type == 'radio' && radio[i].checked) {
            if (radio[i].value == 'line') {
                start = [x,y];
                end = [x,y];
            }
            else if (radio[i].value == 'ubah-garis') {
              for (var i = 0; i < lines.length; ++i) {
                for (var j = 0; j < lines[i].length; j+=2) {
                    if (Math.sqrt((Math.pow(lines[i][j]-x, 2)+Math.pow(lines[i][j+1]-y, 2))) < 0.015) {
                        var x_left = (lines[i][0] + lines[i][2])/2,
                            y_left = (lines[i][1] + lines[i][3])/2,
                            x_right = (lines[i][4] + lines[i][6])/2,
                            y_right = (lines[i][5] + lines[i][7])/2;
                        if (j > 3) {
                            bufferline = [i, x_left, y_left, x_right, y_right, 1];
                        } else {
                            bufferline = [i, x_left, y_left, x_right, y_right, 0];
                        }
                      }
                    }
                  }
          } 
        }
    }
    renderLine(gl, start, end, buffer);
});

  }
const canvas = document.getElementById('canvas-webgl');
const gl = canvas.getContext('webgl');
var buffer;
var colorbuffer;
var mouseClicked = false;
var end = []
var lines = [];
var start = [];
var bufferline =[]

window.onload = startProgram(gl, canvas, buffer, mouseClicked, start, end, bufferline, lines);