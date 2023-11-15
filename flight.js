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

window.onload = preRender; // calling preRender function when window is loaded

const preRender = () => {
    const indices = get_patch(0,1,0,1)
    let canvas = document.getElementById("gl-canvas"); // Retrieving Canvas element from html
    gl = canvas.getContext("webgl2"); // getting the webgl2 context
    if (!gl) alert("WebGL isn't available"); // Alerts if WebGL is not supported by the browser
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    program = initShaderFiles( "flight-vshader.glsl", "flight-fshader.glsl" ); // connecting to the shader

    // Associate out shader variables with our data buffer
    let vPosition = gl.getAttribLocation(program, "vPosition"); // Connecting vPosition from vertex shader to vertices

    // Creating a Buffer
    var positionBuffer =  gl.createBuffer()

    // Connecting vertices to the shader
    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height); // setting the viewing port and the default color of the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.useProgram(program); // using the shader program

    gl.bindVertexArray(vao);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(indices), gl.STATIC_DRAW); // Transforming (flattening) vertices into data type that Shaders can understand

    render(); // calling render function
};



let render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, indices.length);
};