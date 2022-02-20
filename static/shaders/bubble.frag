#version 300 es
precision mediump float;

uniform int mode;   // Rendering mode
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess
uniform mat4 viewMatrix;
// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPos; // Light position
uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform float uNormalUVScale;
uniform float uNormalScale;

in vec2 vUv;
in vec3 vNormal;  // Surface normal
in vec3 vertPos;  // Vertex position
in vec3 vMPos;
out vec4 FragColor;

vec3 getNormal() {
    vec3 pos_dx = dFdx(vMPos.xyz);
    vec3 pos_dy = dFdy(vMPos.xyz);
    vec2 tex_dx = dFdx(vUv);
    vec2 tex_dy = dFdy(vUv);
    vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);
    vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);
    mat3 tbn = mat3(t, b, normalize(vNormal));
    vec3 n = texture(tNormal, vUv * uNormalUVScale).rgb * 2.0 - 1.0;
    n.xy *= uNormalScale;
    vec3 normal = normalize(tbn * n);
    // Get world normal from view normal
    return normalize((vec4(normal, 0.0) * viewMatrix).xyz);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightPos - vertPos);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(-vertPos); // Vector to viewer
    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
  }

  vec3 tex = texture(tMap, vUv).rgb;
  vec3 normal = getNormal();
  float shading = dot(normal, lightPos) * 0.5;


  FragColor = vec4(Ka * (tex + shading)  + Kd * lambertian * (tex + shading) + Ks * specular * specularColor, 1.0);
  //FragColor = vec4(0., 0., 0., 0.);
}


