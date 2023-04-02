// vert file and comments from adam ferriss
// https://github.com/aferriss/p5jsShaderExamples

// our vertex data
attribute vec3 aPosition;

// our texcoordinates
// attribute vec2 aTexCoord;

// this is a variable that will be shared with the fragment shader
// we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
// it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 eyeVector;

void main() {


  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // send the vertex information on to the fragment shader
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // * Varyings
  vUv = uv;
  // keep the light in place and rotate the object
  vNormal = normalize(normalMatrix * normal);
  // vNormal = normal;


 // * getting eve Vector based on Camera
//  vec4 worlPosition = modelMatrix * vec4(position, 1.0); // equivalent as modelPosition
  eyeVector = normalize(modelPosition.xyz - cameraPosition);
}