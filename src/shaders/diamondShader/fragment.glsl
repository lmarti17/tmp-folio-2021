// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-1_basic

precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
// * uniforms
uniform float uTime;
uniform sampler2D uTexture;
uniform float uScroll;
uniform vec2 uResolution;

// * varyings
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 eyeVector;

void main(void) {

  vec3 X = dFdx(vNormal);
  vec3 Y = dFdy(vNormal); 
  vec3 normal = normalize(cross(X, Y));
  float strength = dot(normal, vec3(1.));


  // vec2 uv = gl_FragCoord.xy / uResolution;

  // vec3 refracted = refract(eyeVector, vUv, 1./3.);
  // uv += refracted.xy;


  // vec4 texture = texture2D(uTexture, vUv);

  // gl_FragColor = texture; 
  gl_FragColor = vec4(strength);
  // gl_FragColor = vec4(eyeVector, 1.0); 
}

