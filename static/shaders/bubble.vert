  #version 300 es
   in vec3 position;
  in vec2 uv;
  in vec3 normal;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;
  uniform mat3 normalMatrix;

  out vec2 vUv;
  out vec3 vNormal;
  out vec3 normalInterp;
  out vec3 vertPos;
  out vec3 vMPos;


  void main() {
    vUv = uv;
    vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    vNormal = vec3(vec4(normalMatrix) * vec4(normal, 0.0));
    vMPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * vertPos4;
  }
