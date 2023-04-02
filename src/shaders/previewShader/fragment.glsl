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
uniform vec2 uMouse;
uniform sampler2D uTexture;
uniform sampler2D uNextTexture;
uniform float uScroll;
uniform vec2 uResolution;

// * varyings
varying vec2 vUv;
varying float vElevation;


void main(void) {

  float progress = sin(uTime);
  

  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  //  

  float strength = smoothstep(progress, progress + 0.3, 0.5*(uv.x + uv.y));
  
  vec4 nextTexture = texture2D(uNextTexture, uv);
  vec4 texture = texture2D(uTexture, uv);

  vec4 final = mix(texture, nextTexture, strength);

  // gl_FragColor = vec4(vec3(strength), 1.0); 
  gl_FragColor = final; 
  // gl_FragColor = texture; 
}

