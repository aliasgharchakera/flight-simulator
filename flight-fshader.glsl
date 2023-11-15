#version 300 es
precision highp float;

in vec4 vtxColor;
out vec4 fragColor;

void main() { fragColor = vtxColor; }