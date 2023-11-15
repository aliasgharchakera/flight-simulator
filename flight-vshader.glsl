#version 300 es

in vec4 vPosition;
in vec3 vColor;
out vec4 vtxColor;

uniform mat4 modelViewMatrix, projectionMatrix;


void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vPosition; // vertex position in CAMERA COORDINATES
    vtxColor = vec4(vColor, 1.0);
}