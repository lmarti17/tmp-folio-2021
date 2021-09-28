// casey conchinha - @kcconch ( https://github.com/kcconch )
// louise lessel - @louiselessel ( https://github.com/louiselessel )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/
// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/2_texture-coordinates/2-1_basic

precision mediump float;

// this is the same variable we declared in the vertex shader
// we need to declare it here too!
uniform float time;

varying vec2 vUv;
uniform vec2 size;
uniform vec3 color1_min;
uniform vec3 color1_max;
uniform vec3 color2_min;
uniform vec3 color2_max;

uniform float scroll;

vec3 rgb(vec3 color){
  return vec3(color.x / 255.0, color.y/ 255.0, color.z / 255.0);
}

void main(void) {

  // copy the vUv
  // vUv is a value that goes from 0.0 - 1.0 depending on the pixels location
  // we can use it to access every pixel on the screen

  vec3 col1_min = rgb(color1_min); // rgb(236, 90, 70)
  vec3 col1_max = rgb(color1_max); // rgb(197, 63, 47)
  vec3 col2_min = rgb(color2_min); // rgb(174, 154, 135)
  vec3 col2_max = rgb(color2_max); // rgb(203, 188, 144)

  vec2 gradient_center = vec2(0, min(0.8 + scroll, 1.0));

  // lets slow down our time variable by multiplying it by a small number
  // try changing the speed
  
  float slowTime = time * 0.00025;

  vec3 color = mix(mix(col1_min, col1_max, abs(sin(slowTime))), mix(col2_min, col2_max, abs(sin(slowTime))), distance(vUv, gradient_center));
  

  gl_FragColor = vec4(color, 1.0);
}

