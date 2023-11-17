"use strict";
var program;
var gl;
var vertices = [];
var v
var faces = []
var indexed_vertices = []

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    const program = initShaderFiles( "flight-vshader.glsl", "flight-fshader.glsl" ); // connecting to the shaders
    gl.useProgram(program);

    // An EXAMPLE: A triangle
    v = get_patch(-1,1,-1,1)
    vertices = v.vertices
    faces = v.indices
    for(var i=0;i<faces.length;i++){
        // if(i===58808){
        //     console.log(faces[i])
        //     console.log(vertices[faces[i]])
        // }
        indexed_vertices.push(vertices[faces[i]])
    }
    // console.log(vertices)
    // console.log(indexed_vertices)
    // Connecting vertices to the shader
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); // Creating a Buffer
    gl.bufferData(gl.ARRAY_BUFFER, flatten(indexed_vertices), gl.STATIC_DRAW); // Transforming (flattening) vertices into data type that Shaders can understand

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition"); // Connecting vPosition from vertex shader to vertices
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    // Associate out shader variables with our data buffer
    let vColors = gl.getAttribLocation(program, "vColors"); // Connecting vColors from vertex shader to vertices
    gl.vertexAttribPointer(vColors, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColors);

    render(); // calling render function
};



let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    modelViewMatrix = lookAt(eye, at, up);
    
    projectionMatrix = frustum(left_, right_, bottom_, top_, near_, far_);

    modelviewInv = inverse4(modelViewMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, indexed_vertices.length);
    // gl.drawArrays(gl.POINTS, 0, 3);
};

const frustum = (l, r, b, t, n, f) => {
    if (l == r) throw "frustum(): left and right are equal";
    if (b == t) throw "frustum(): bottom and top are equal";
    if (n == f) throw "frustum(): near and far are equal";

    const w = r - l,
        h = t - b,
        d = f - n;

    let result = mat4(
        (2.0 * n) / w,
        0.0,
        (r + l) / w,
        0.0,
        0.0,
        (2.0 * n) / h,
        (t + b) / h,
        0.0,
        0.0,
        0.0,
        -(f + n) / d,
        (-2.0 * f * n) / d,
        0.0,
        0.0,
        -1,
        0.0
    );

    return result;
};