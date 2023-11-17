#version 300 es

precision highp float;

in vec4 aColor; // colors received from vertex shader

out vec4 fragColor; // output color of the pixel

void main()
{
    fragColor = aColor; // Example color calculation
}
