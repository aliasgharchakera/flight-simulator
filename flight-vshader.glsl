#version 300 es

in vec2 vPosition; // vertices in js is connected to vPosition here
in vec3 vColors; // colors in js is connected to vColors here
out vec3 aColor; // this will be used to pass colors to the fragment shader
    
void main()
{
    gl_Position = vec4(vPosition, 0.0, 1.0); // assigning position as it is, i.e. without changing any value
    aColor = vColors; // passing colors to fragment shaders
    gl_PointSize = 10.0; // Point size on screen. Optional.
}

