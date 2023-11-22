"use strict";
let vBuffer;
let cBuffer;
let nBuffer;
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
var width = (xMax-xMin)/4;
var height = (zMax-zMin)/4;
let Escape = false;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var nMatrix, nMatrixLoc;

let eye = vec3(1200, 1200, 300.0);
let at_vec = vec3(0.0, 0.0, 300.0);
let at = add(eye, at_vec);
let up = vec3(0.0, 1.0, 0.0);
let dir = normalize(subtract(at_vec, eye), false);

let left_ = -0.1;
let right_ = 0.1;
let bottom_ = -0.5;
let top_ = 1.5;
let near_ = 0.1;
let far_ = -0.1;

let leftValue, rightValue, bottomValue, topValue, nearValue, farValue;

let leftBound = [-0.5,0.0]
let rightBound = [0,0.5]
let bottomBound = [-1,-0.3]
let topBound = [0.5,2]
let nearBound = [0.05,0.15]
let farBound = [-0.15,-0.05]

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

let viewType = 0;
let shadingType = 0;
var shadingTypeLoc;
let sky = vec4(0.55686, 0.70196, 0.81961, 1.0)
let space = vec4(0.0,0.0,0.0,1.0)

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
    const view = document.getElementById("view");
    const shading = document.getElementById("shading");

    leftValue = document.getElementById("left");
    rightValue = document.getElementById("right");
    bottomValue = document.getElementById("bottom");
    topValue = document.getElementById("top");
    nearValue = document.getElementById("near");
    farValue = document.getElementById("far");

    leftValue.innerHTML = left_;
    rightValue.innerHTML = right_;
    bottomValue.innerHTML = bottom_;
    topValue.innerHTML = top_;
    nearValue.innerHTML = near_;
    farValue.innerHTML = far_;

    gl = canvas.getContext("webgl2"); // getting the webgl2 context
    if (!gl) alert("WebGL isn't available"); // Alerts if WebGL is not supported by the browser

    gl.viewport(0, 0, canvas.width, canvas.height); // setting the viewing port and the default color of the canvas
    gl.enable(gl.DEPTH_TEST);

    xMax = canvas.width;
    zMax = canvas.height;

    program = initShaderFiles( "flight-vshader.glsl", "flight-fshader.glsl" ); // connecting to the shaders
    gl.useProgram(program);

    [points,normals] = getPatch(xMin, xMax, zMin, zMax);

    vBuffer = gl.createBuffer(); // Creating a Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); // Creating a Buffer
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.DYNAMIC_DRAW); // Transforming (flattening) vertices into data type that Shaders can understand

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition"); // Connecting vPosition from vertex shader to vertices
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    assignColors();
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);

    let vColor = gl.getAttribLocation(program, "vColors");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.DYNAMIC_DRAW);

    let vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
    shadingTypeLoc = gl.getUniformLocation(program, "shadingType");

    document.addEventListener("keydown", handleKeyDown);

    window.cancelAnimationFrame(anim);

    if (Escape) {
        window.cancelAnimationFrame(anim);
    } else {
        window.requestAnimationFrame(render);
    }
};


let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(!Escape){
        [points,normals] = getPatch(xMin, xMax, zMin, zMax);
        assignColors();

        // dir = normalize(subtract(at_vec, eye), false);
        // eye = add(eye, scale(speed, dir));
        // at_vec = add(eye, dir);
        
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
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        
        projectionMatrix = frustum(left_, right_, bottom_, top_, near_, far_);

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniform1i(shadingTypeLoc, shadingType);

        if (shadingType === 0) shading.innerHTML = "Flat Shading";
        else if (shadingType === 1) shading.innerHTML = "Smooth Shading";
        else shading.innerHTML = "Phong Shading";

        if(viewType===0){
            view.innerHTML = "Faces";
            gl.clearColor(sky[0], sky[1], sky[2], sky[3]);
            gl.drawArrays(gl.TRIANGLES, 0, points.length);
        }else if(viewType===1){
            view.innerHTML = "Wireframe";
            gl.clearColor(space[0], space[1], space[2], space[3]);
            gl.drawArrays(gl.LINES, 0, points.length);
        }else if(viewType===2){
            view.innerHTML = "Points";
            gl.clearColor(sky[0], sky[1], sky[2], sky[3]);
            gl.drawArrays(gl.POINTS, 0, points.length);
        }
        anim = window.requestAnimationFrame(render);
    }
    
};