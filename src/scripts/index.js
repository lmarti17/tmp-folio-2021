import fitty from "fitty";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
import sketch from "./background";

const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(TextPlugin);

function numberMap(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function disableBodyScroll() {
  document.body.style.top = `-${window.scrollY}px`;
  document.body.style.top = 0;
  document.body.style.position = "fixed";
  document.body.style.left = "0";
  document.body.style.right = "0";
}

disableBodyScroll();

function enableBodyScroll() {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  scrollY && window.scrollTo(0, parseInt(scrollY) * -1);
}

function charming(
  element,
  {
    tagName = "span",
    split,
    setClassName = function (index) {
      return "char" + index;
    },
  } = {}
) {
  element.normalize();
  let index = 1;
  function inject(element) {
    const parentNode = element.parentNode;
    const nodeValue = element.nodeValue;
    const array = split ? split(nodeValue) : nodeValue.split("");
    array.forEach(function (string) {
      const node = document.createElement(tagName);
      const className = setClassName(index++, string);
      if (className) {
        node.className = className;
      }
      node.appendChild(document.createTextNode(string));
      node.setAttribute("aria-hidden", "true");
      parentNode.insertBefore(node, element);
    });
    if (nodeValue.trim() !== "") {
      parentNode.setAttribute("aria-label", nodeValue);
    }
    parentNode.removeChild(element);
  }
  (function traverse(element) {
    // `element` is itself a text node
    if (element.nodeType === 3) {
      return inject(element);
    }
    // `element` has a single child text node
    const childNodes = Array.prototype.slice.call(element.childNodes); // static array of nodes
    const length = childNodes.length;
    if (length === 1 && childNodes[0].nodeType === 3) {
      return inject(childNodes[0]);
    }
    // `element` has more than one child node
    childNodes.forEach(function (childNode) {
      traverse(childNode);
    });
  })(element);
}

class App {
  constructor() {
    this.wH = window.innerHeight;
    this.wW = window.innerWidth;

    this.prepareDOM();
  }

  prepareDOM() {
    // init shader
    this.p5sketch = new p5(sketch);
    // TITLES
    this.title = document.getElementById("title");

    this.subtitle = document.getElementById("subtitle");
    if (isMobile) {
      fitty(this.title, { maxSize: 45 });
      fitty(this.subtitle, { maxSize: 22 });
    }
    if (isTablet) {
      fitty(this.subtitle);
    }
    if (!isMobile) {
      fitty(this.title);
    }

    // SPLIT TITLES & SUBTITLE
    charming(this.title, { setClassName: () => "title__fragments" });
    charming(this.subtitle, {
      setClassName: () => "subtitle__fragments",
      split: function (string) {
        return string.match(/.{1,2}/g);
      },
    });

    // UPDATE LIVE SINCE
    let tag = document.getElementById("live-since-day");

    const baseDate = new Date("10/10/2021");
    const nowDate = new Date();
    tag.innerHTML = Math.floor((nowDate - baseDate) / 1000 / 60 / 60);

    // Launch animation when DOM is ready
    this.animate();
  }

  animate() {
    CustomEase.create(
      "title",
      "M0,0 C0.054,0.148 0.139,0.414 0.31,0.492 0.45,0.556 0.49,0.504 0.586,0.56 0.644,0.594 0.686,0.876 0.788,0.944 0.894,1.014 0.98,1 1,1 "
    );

    CustomEase.create("opacity", ".3,.8,.55,1");

    let tl = gsap.timeline({
      defaults: {
        stagger: {
          each: 0.02,
          from: "edges",
        },
      },
      onStart: () => {
        gsap.set("#home", { opacity: 1 });
      },
      onComplete: () => this.p5sketch.loop(),
    });
    tl.to("#defaultCanvas0", { opacity: 1, ease: "opacity", duration: 2 });
    tl.fromTo(
      ".title__fragments",
      { y: isMobile ? this.wH / 2 : this.wH - 150 },
      {
        y: 0,
        ease: "title",
        duration: 2,
      },
      "<=0.25"
    )
      .fromTo(
        ".title__fragments",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "opacity",
          duration: 1.5,
        },
        "<=0"
      )
      .fromTo(
        ".subtitle__fragments",
        {
          y: "100%",
        },
        {
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            // set event listeners
            if (!isMobile && !isTablet) {
              this.addEventListeners();
            }
            enableBodyScroll();
          },
          stagger: {
            from: "start",
            each: 0.1,
          },
        },
        "-=0.20"
      )
      .fromTo(
        ".animatedIn span",
        {
          y: "100%",
        },
        {
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: {
            from: "start",
            each: 0.1,
          },
        },
        "-=0.2"
      );
  }

  addEventListeners() {
    this.titleLetters = Array.from(
      document.getElementsByClassName("title__fragments")
    );
    this.titleLettersCoords = this.titleLetters.map((el) => {
      let coords = el.getBoundingClientRect();
      return {
        x: coords.x + coords.width / 2,
        y: coords.y + coords.height / 2,
      };
    });

    window.addEventListener("mousemove", this.handleTitleAnimation);

    let mailDom = document.getElementById("mail");
    mailDom.addEventListener("click", this.handleMailClick);
    mailDom.addEventListener("touchstart", this.handleMailClick);
  }

  // Move the main letters depending on mouse position
  handleTitleAnimation = ({ pageX, pageY }) => {
    this.titleLettersCoords.forEach((el, index) => {
      let distance = Math.sqrt(
        Math.pow(el.x - pageX, 2) + Math.pow(el.y - pageY, 2)
      );
      if (distance < 350) {
        gsap.to(this.titleLetters[index], {
          y: numberMap(distance, 0, 350, -40, 0),
          duration: 0.4,
          ease: "opacity",
        });
      } else {
        gsap.to(this.titleLetters[index], {
          y: 0,
          duration: 0.25,
          ease: "opacity",
        });
      }
    });
  };

  // Handle email click
  // copy email address
  // animate email text into feedback and backwards
  handleMailClick = (e) => {
    e.preventDefault();

    if (navigator.clipboard) {
      navigator.clipboard.writeText("contact@lucasmartin.fr");
    }
    gsap.to("#mail", {
      duration: 0.5,
      text: {
        value: "copied",
        newClass: "copied",
      },
      ease: "power4.out",
      onStart: () => {
        gsap.set("#mail", { pointerEvents: "none" });
      },
      onComplete: () =>
        gsap.to("#mail", {
          duration: 0.5,
          delay: 1.5,
          text: {
            value: "contact@lucasmartin.fr",
          },
          onComplete: () => {
            gsap.set("#mail", { pointerEvents: "initial" });
          },
          ease: "power4.out",
        }),
    });
  };
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("load", () => {
  new App();
});
