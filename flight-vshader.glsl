#version 300 es

in vec4 vPosition;
in vec3 vColors;
in vec3 vNormal; 

out vec4 aColor; // this will be used to pass colors to the fragment shader
out vec3 aNormal; // this will be used to pass normals to the fragment shader
out vec3 pos; // this will be used to pass position to the fragment shader

uniform mat4 modelViewMatrix, projectionMatrix;
uniform mat3 normalMatrix;
uniform highp int shadingType; // 0: flat shading, 1: gouraud shading, 2: phong shading
    
vec4 lightPosition = vec4(0.0, 2.0, 1.0, 1.0);
float shininess = 10.0;
void main()
{
    // gl_Position = vPosition; // assigning position as it is, i.e. without changing any value
    aNormal = normalize(normalMatrix * vNormal);
    if (shadingType != 2){
        pos = -(modelViewMatrix * vPosition).xyz;
        vec3 L = normalize(lightPosition.xyz - pos);
        vec3 E = normalize(-pos);
        vec3 H = normalize(L + E);
        float Kd = max(dot(L, aNormal), 0.0);
        float Ks = pow(max(dot(aNormal, H), 0.0), shininess);

        vec4 ambient = vec4(vColors, 1.0);
        vec4 diffuse = vec4(vColors, 1.0) * Kd;
        vec4 specular = vec4(1.0, 1.0, 1.0, 1.0) * Ks;

        if (dot(L, aNormal) < 0.0) {
            diffuse = vec4(0.0, 0.0, 0.0, 1.0);
        }
        if (dot(aNormal, H) < 0.0) {
            specular = vec4(0.0, 0.0, 0.0, 1.0);
        }

        aColor = ambient + diffuse + specular;
        aColor.a = 1.0;

    }
    else{
        aColor = vec4(vColors, 1.0);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vPosition; // assigning position as it is, i.e. without changing any value
    gl_PointSize = 2.0;
}

