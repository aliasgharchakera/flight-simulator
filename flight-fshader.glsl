#version 300 es

precision highp float;

in vec4 aColor; // colors received from vertex shader
in vec3 aNormal; 
in vec3 pos;

out vec4 fragColor; // output color of the pixel

uniform highp int shadingType;

vec4 lightPosition = vec4(1.0, 2.0, 1.0, 1.0); 
float shininess = 10.0;

void main()
{
    if (shadingType == 2){
        vec3 L = normalize(lightPosition.xyz - pos);
        vec3 N = normalize(aNormal);
        vec3 V = normalize(-pos);
        vec3 R = reflect(-L, N);
        vec3 H = normalize(L + V);

        float Kd = max(dot(L, N), 0.0);
        float Ks = pow(max(dot(N, H), 0.0), shininess);

        vec4 ambient = aColor;
        vec4 diffuse = aColor * 0.8;
        vec4 spec = vec4(1.0, 1.0, 1.0, 1.0) * Ks;

        // if (dot(L, N) < 0.0){
        //     specular = vec4(0.0, 0.0, 0.0, 1.0);
        // }

        // fragColor = ambient + diffuse + specular;
        
        float lambertTerm = max(dot(N, L), 0.0);
        float specular = 0.0;

        if(lambertTerm > 0.0){
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, shininess);
        }

        fragColor = ambient + diffuse * lambertTerm + spec * specular;
    }
    else{
        fragColor = aColor;
    }
}
