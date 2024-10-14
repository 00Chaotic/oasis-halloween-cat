import { ReactP5Wrapper } from "@p5-wrapper/react";

/**
 * Sketch function for p5.js
 * @param {import("p5")} p5 - The p5 instance
 */
function sketch(p5) {
  // Calculations consider (0, 0) default starting point of WebGL mode canvas
  const centerToEdge = { x: p5.windowWidth/2, y: p5.windowHeight/2 };
  const catCenter = {x: -centerToEdge.x*0.65, y: centerToEdge.y*0.7 };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.angleMode(p5.DEGREES);
  };

  p5.draw = () => {
    // Calculate angle between mouse and canvas center
    const angle = p5.atan2(p5.mouseY - (centerToEdge.y + catCenter.y), p5.mouseX - (centerToEdge.x + catCenter.x))

    // Left eye position from center
    const leftX = -50;
    const leftY = 0;

    // Draw left eye
    p5.push();
    p5.translate(leftX, leftY);
    p5.fill(255);
    p5.ellipse(0, 0, 50, 50);
    p5.rotate(angle);
    p5.fill(0);
    p5.ellipse(12.5, 0, 25, 25);
    p5.pop();

    // Right eye position from center
    const rightX = 50;
    const rightY = 0;

    // Draw right eye
    p5.push();
    p5.translate(rightX, rightY);
    p5.fill(255);
    p5.ellipse(0, 0, 50, 50);
    p5.rotate(angle);
    p5.fill(0);
    p5.ellipse(12.5, 0, 25, 25);
    p5.pop();

    // Add arcs to make eyes look angry when mouse is pressed
    if (p5.mouseIsPressed) {
      p5.push();
      p5.fill(20);
      p5.arc(-50, 0, 50, 50, 190, 10, p5.OPEN); // Left eye arc
      p5.arc(50, 0, 50, 50, 170, 350, p5.OPEN); // Right eye arc
      p5.pop();
    }
  };
}

export default function Sketch() {
  return <ReactP5Wrapper sketch={sketch} />;
};
