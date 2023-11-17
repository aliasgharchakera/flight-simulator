"use strict";
let vBuffer;
let cBuffer;
let canvas;
var program;
var gl;
var points = [];
var v
var normals = []

var xMin = -10;
var zMin = -10;
var xMax = 10;
var zMax = 10;
let Escape = false;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

let eye = vec3(1200, 1200, 300.0);
let at_vec = vec3(0.0, 0.0, 300.0);
let at = add(eye, at_vec);
let up = vec3(0.0, 1.0, 0.0);

let left_ = -0.1;
let right_ = 0.1;
let bottom_ = -0.5;
let top_ = 1.5;
let near_ = 0.1;
let far_ = -0.1;

let pitch = 0;
let yaw = 0;
let roll = 0;

let speed = 0.5;
let stopped = false;

var anim;
let reset = false;

var colors;
var c;
let colorScheme = 0;

function initShaderFiles(file1, file2) {
    function createElementWithFile(file, element_id) {
        const req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                // The request is done; did it work?
                if (req.status == 200) {
                    // ***Yes, use `req.responseText` here***
                    const head = document.head;
                    const element = document.createElement("shader");
                    element.setAttribute("id", element_id);
                    element.textContent = req.responseText;
                    head.appendChild(element);
                } else {
                    // ***No, tell the callback the call failed***
                    alert('Cannot read ' + req.responseURL)
                }
            }
        };
        req.open("GET", 'http://localhost:8000/'+file, false)
        req.send(null)
    }
    createElementWithFile(file1, "vtx-head");
    createElementWithFile(file2, "frg-head");

    return initShaders(gl, "vtx-head", "frg-head"); // connecting to the shaders
}



window.onload = () => {
    let canvas = document.getElementById("gl-canvas"); // Retrieving Canvas element from html
    gl = canvas.getContext("webgl2"); // getting the webgl2 context
    if (!gl) alert("WebGL isn't available"); // Alerts if WebGL is not supported by the browser

    gl.viewport(0, 0, canvas.width, canvas.height); // setting the viewing port and the default color of the canvas
    gl.clearColor(0.55686, 0.70196, 0.81961, 1.0);
    gl.enable(gl.DEPTH_TEST);

    xMax = canvas.width;
    zMax = canvas.height;

    program = initShaderFiles( "flight-vshader.glsl", "flight-fshader.glsl" ); // connecting to the shaders
    gl.useProgram(program);

    [points,normals] = getPatch(xMin, xMax, zMin, zMax);

    vBuffer = gl.createBuffer(); // Creating a Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); // Creating a Buffer
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW); // Transforming (flattening) vertices into data type that Shaders can understand

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition"); // Connecting vPosition from vertex shader to vertices
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener("keyup", handleKeyUp);

    window.cancelAnimationFrame(anim);

    if (Escape) {
        window.cancelAnimationFrame(anim);
    } else {
        window.requestAnimationFrame(render);
    }
};



let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let c = [];
    for (let i = 0; i < points.length; i++) {
        let color = vec3(0,0,0)
        let red = 0.0, green = 0.0, blue = 0.0;
        if (points[i][1] < -200){
            red = 0.18039, green = 0.22353, blue = 0.55686;
            color = vec3(red, green, blue)
        }else if (0.0 < points[i][1] && points[i][1] < 200.0){
            red = 0.588, green = 0.294;
            color = vec3(red, green, blue)
        }else if (points[i][1] > 350.0){
            red = 1.0, green = 1.0, blue = 1.0;
            color = vec3(red, green, blue)
        }else{
            red = 0.24, green = 0.294, blue = 0.08;
            color = vec3(red, green, blue)
        }
        c.push(color);
    }

    colors = [];
    for (var i = 0; i < c.length; i += 3) {
        if (colorScheme == 0) {
            let avg = getAvg(c[i], c[i + 1], c[i + 2]);
            colors.push(avg);
            colors.push(avg);
            colors.push(avg);
        }
        else{
            colors.push(c[i]);
            colors.push(c[i + 1]);
            colors.push(c[i + 2]);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    let colorLoc = gl.getAttribLocation(program, "vColors");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    [points,normals] = getPatch(xMin, xMax, zMin, zMax);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    if (Escape == false) {
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    }

    let rotate_x_matrix = rotateX(pitch);
    let rotate_y_matrix = rotateY(yaw);
    let rotate_z_matrix = rotateZ(roll);

    up = vec4(0, 1, 0, 0);
    up = mult(rotate_z_matrix, up);
    up = vec3(up[0], up[1], up[2]);

    at_vec = vec4(0.0, 0.0, speed,0);
    let rotate_xy = mult(rotate_y_matrix, rotate_x_matrix);
    at_vec = mult(rotate_xy, at_vec);
    at_vec = vec3(at_vec[0], at_vec[1], at_vec[2]);

    if (!stopped) adjustCameraPitch();

    at = add(eye, at_vec);
    modelViewMatrix = lookAt(eye, at, up);

    if (!stopped) eye = add(eye, at_vec);

    xMin = eye[0] - 1200;
    xMax = eye[0] + 1200;

    zMin = eye[2] - 1200;
    zMax = eye[2] + 1200;
    
    projectionMatrix = frustum(left_, right_, bottom_, top_, near_, far_);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    anim = window.requestAnimationFrame(render);
};