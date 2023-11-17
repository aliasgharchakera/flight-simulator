"use strict";
var program;
var gl;
var vertices = [];
var v
var faces = []
var indexed_vertices = []

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

    // Associate out shader variables with our data buffer
    let vColors = gl.getAttribLocation(program, "vColors"); // Connecting vColors from vertex shader to vertices
    gl.vertexAttribPointer(vColors, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColors);

    render(); // calling render function
};



let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, indexed_vertices.length);
    // gl.drawArrays(gl.POINTS, 0, 3);
};