// import vert from "../shaders/shader.vert";
// import frag from "../shaders/shader.frag";

export default function sketch(p5) {
  // a shader variable
  let theShader;

  p5.setup = () => {
    p5.rectMode(p5.CENTER);

    p5.pixelDensity(window.devicePixelRatio);
    // shaders require WEBGL mode to work
    p5.createCanvas(window.innerWidth, window.innerHeight, p5.WEBGL);

    theShader = p5.createShader(vert, frag);

    p5.noStroke();
    // shader() sets the active shader with our shader
    p5.shader(theShader);

    theShader.setUniform("color1_min", [236, 90, 70]);
    theShader.setUniform("color1_max", [197, 63, 47]);
    theShader.setUniform("color2_min", [174, 154, 135]);
    theShader.setUniform("color2_max", [203, 188, 144]);
    theShader.setUniform("center", [0, 0.8]);

    window.addEventListener("scroll", (e) => {
      theShader.setUniform(
        "scroll",
        window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)
      );
    });

    p5.noLoop();
  };

  p5.draw = () => {
    theShader.setUniform("time", p5.frameCount);

    // // rect gives us some geometry on the screen
    p5.rect(0, 0, p5.width, p5.height);
  };

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };
}
