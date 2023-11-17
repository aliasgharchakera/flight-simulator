#version 300 es

in vec4 vPosition; // vertices in js is connected to vPosition here
in vec3 vColors; // colors in js is connected to vColors here
out vec4 aColor; // this will be used to pass colors to the fragment shader

uniform mat4 modelViewMatrix, projectionMatrix;
    
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vPosition; // assigning position as it is, i.e. without changing any value
    // gl_Position = vPosition; // assigning position as it is, i.e. without changing any value
    aColor = vec4(vColors,1.0); // assigning color as it is, i.e. without changing any value
}

