import fitty from "fitty";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

const isMobile = window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

gsap.registerPlugin(CustomEase);

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

    const baseDate = new Date("10/01/2021");
    const nowDate = new Date();
    tag.innerHTML = Math.floor((nowDate - baseDate) / 1000 / 60 / 60);

    // Launch animation when DOM is ready
    this.animate();
  }

  animate() {
    CustomEase.create(
      "title",
      "M0,0 C0.054,0.148 0.098,0.385 0.272,0.454 0.484,0.538 0.474,0.482 0.57,0.538 0.695,0.611 0.703,0.902 0.812,0.964 0.872,0.998 0.963,1 1,1 "
    );

    CustomEase.create("opacity", ".25,.48,.68,.96");

    CustomEase.create(
      "subtitle",
      "M0,0 C0.11,0.494 0.249,0.794 0.404,0.884 0.528,0.956 0.504,1 1,1"
    );

    let tl = gsap.timeline({
      delay: 1,
      defaults: {
        stagger: {
          each: 0.02,
          from: "random",
        },
      },
      onComplete: () => {
        // set event listeners
        if (!isMobile && !isTablet) {
          this.addEventListeners();
        }
      },
    });

    tl.fromTo(
      "#maskBlack",
      { attr: { rx: 0, ry: 0 } },
      {
        attr: {
          rx: Math.sqrt(5000),
          ry: Math.sqrt(3000),
        },
        duration: 1.5,
        ease: CustomEase.create(
          "intro",
          "M0,0 C0,0 0.005,0.077 0.134,0.206 0.19,0.262 0.486,0.301 0.556,0.364 0.699,0.493 0.684,0.728 0.762,0.868 0.841,1.011 1,1 1,1 "
        ),
        onComplete: () => {
          let layer = document.getElementById("layer");
          layer.parentNode.removeChild(layer);
        },
      }
    ).to(
      "#hello span",
      {
        y: -30,
        duration: 1,
        ease: "power3.in",
        stagger: {
          from: "start",
          each: 0.13,
        },
        onComplete: () => {
          let hello = document.getElementById("hello");
          hello.parentNode.removeChild(hello);
        },
      },
      "-=0.25"
    );
    tl.fromTo(
      ".title__fragments",
      { y: isMobile ? this.wH / 2 : this.wH },
      {
        y: 0,
        ease: "title",
        duration: 3,
      },
      "-=0.25"
    )
      .fromTo(
        ".title__fragments",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "opacity",
          duration: 1.25,
        },
        "<0"
      )
      .fromTo(
        ".subtitle__fragments",
        {
          y: 60,
        },
        {
          y: 0,
          duration: 0.8,
          ease: "subtitle",
          onComplete: () => enableBodyScroll(),
          stagger: {
            from: "start",
            each: 0.12,
          },
        },
        "-=0.35"
      )
      .fromTo(
        ".animatedIn span",
        {
          y: "102%",
        },
        {
          y: 0,
          duration: 0.8,
          ease: "subtitle",
          stagger: {
            from: "start",
            each: 0.13,
          },
        },
        "-=0.4"
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
  }

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
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("load", () => {
  new App();
});
