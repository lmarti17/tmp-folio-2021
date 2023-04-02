// vert file and comments from adam ferriss
// https://github.com/aferriss/p5jsShaderExamples
precision mediump float;

// our texcoordinates
// attribute vec2 aTexCoord;
uniform float uTime;
uniform vec2 uFrequency;
uniform vec2 uMouse;

// this is a variable that will be shared with the fragment shader
// we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
// it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
varying vec2 vUv;
varying float vElevation;


void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  

  float elevation = sin(modelPosition.x * uFrequency.x - uTime * 2.) * 0.2;
  elevation += sin(modelPosition.y * uFrequency.y - uTime * 2.) * 0.2;
  elevation *= 0.5;


  modelPosition.z += elevation;
  modelPosition.y += uMouse.y * 0.5;


  // send the vertex information on to the fragment shader
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // * Varyings
  vUv = uv;
  vElevation = elevation;
}