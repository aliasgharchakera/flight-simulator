#version 300 es

precision highp float;

// in vec3 aColor; // colors received from vertex shader

out vec4 fragColor; // output color of the pixel

void main()
{
    fragColor = vec4(0.0, 1.0, 0.0, 1.0); // Example color calculation
}
