// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-1_basic

precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
uniform float uTime;

varying vec2 vUv;
uniform float size;
uniform vec3 uColor1Min;
uniform vec3 uColor1Max;
uniform vec3 uColor2Min;
uniform vec3 uColor2Max;
uniform vec2 uCenter;

uniform float uScroll;

void main(void) {

  vec2 gradient_center = vec2(uCenter.x, min(uCenter.y + uScroll, 1.125));
  

  // lets slow down our time variable by multiplying it by a small number
  // try changing the speed
  
  float slowTime = uTime;
  
  vec3 color = mix(
    mix(uColor1Min, uColor1Max, abs(sin(slowTime))),
    mix(uColor2Min, uColor2Max, abs(sin(slowTime))),
    distance(vUv, gradient_center));

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(vec3(0.5), 1.0);
}

