import vert from "../shaders/shader.vert";
import frag from "../shaders/shader.frag";

export default function sketch(myp5) {
  // a shader variable
  let theShader;

  myp5.setup = () => {
    myp5.rectMode(myp5.CENTER);

    myp5.pixelDensity(window.devicePixelRatio);
    // shaders require WEBGL mode to work
    myp5.createCanvas(window.innerWidth, window.innerHeight, myp5.WEBGL);

    theShader = myp5.createShader(vert, frag);

    myp5.noStroke();
    // shader() sets the active shader with our shader
    myp5.shader(theShader);

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

    myp5.noLoop();
  };

  myp5.draw = () => {
    theShader.setUniform("time", myp5.millis());
    // // rect gives us some geometry on the screen
    myp5.rect(0, 0, myp5.width, myp5.height);
  };

  myp5.windowResized = () => {
    myp5.resizeCanvas(window.innerWidth, window.innerHeight);
  };
}
