import { ReactP5Wrapper } from "@p5-wrapper/react";

/**
 * Sketch function for p5.js
 * @param {import("p5")} p5 - The p5 instance
 */
function sketch(p5) {
  // Calculations consider (0, 0) default starting point of WebGL mode canvas
  const centerToEdge = { x: p5.windowWidth/2, y: p5.windowHeight/2 };
  const catCenter = {
    x: -centerToEdge.x*0.65,
    y: centerToEdge.y*0.7,
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.angleMode(p5.DEGREES);
  };

  p5.draw = () => {
    // Face
    p5.push();
    p5.fill(20);
    p5.ellipse(catCenter.x, catCenter.y, 520, 490, 80);
    p5.pop();

    // Ears
    p5.push();
    p5.fill('pink');
    p5.stroke(20);
    p5.strokeWeight(15);
    p5.triangle(catCenter.x-180, catCenter.y-170, catCenter.x-170, catCenter.y-370, catCenter.x-30, catCenter.y-240); // Left ear
    p5.triangle(catCenter.x+180, catCenter.y-170, catCenter.x+170, catCenter.y-370, catCenter.x+30, catCenter.y-240); // Right ear
    p5.pop();

    // Whiskers
    p5.push();
    p5.noFill();
    p5.stroke(255);
    p5.strokeWeight(4);
    // Left whiskers
    p5.arc(catCenter.x+300, catCenter.y, 250, 50, 180, 300, p5.OPEN);
    p5.arc(catCenter.x+250, catCenter.y+30, 150, 10, 180, 0, p5.OPEN);
    p5.arc(catCenter.x+300, catCenter.y+60, 250, 40, 50, 180, p5.OPEN);
    // Right whiskers
    p5.arc(catCenter.x-300, catCenter.y, 250, 50, 240, 0, p5.OPEN);
    p5.arc(catCenter.x-250, catCenter.y+30, 150, 10, 180, 0, p5.OPEN);
    p5.arc(catCenter.x-300, catCenter.y+60, 250, 50, 0, 120, p5.OPEN);
    p5.pop();

    // Nose
    p5.push();
    p5.fill('pink');
    p5.triangle(catCenter.x-25, catCenter.y, catCenter.x+25, catCenter.y, catCenter.x, catCenter.y+30);
    p5.pop();

    // Mouth
    p5.push();
    p5.noFill();
    p5.stroke(255);
    p5.arc(catCenter.x-50, catCenter.y+30, 100, 75, 0, 100, p5.OPEN);
    p5.arc(catCenter.x+50, catCenter.y+30, 100, 75, 80, 180, p5.OPEN);
    p5.pop();

    // Fangs
    p5.push();
    p5.noStroke();
    p5.triangle(catCenter.x-50, catCenter.y+67, catCenter.x-30, catCenter.y+65, catCenter.x-40, catCenter.y+90);
    p5.triangle(catCenter.x+50, catCenter.y+67, catCenter.x+30, catCenter.y+65, catCenter.x+40, catCenter.y+90);
    p5.pop();

    // Eyes

    // Left eye position from center
    const leftEyeX = catCenter.x - 75;
    const leftEyeY = catCenter.y - 75;
    // Right eye position from center
    const rightEyeX = catCenter.x + 75;
    const rightEyeY = catCenter.y - 75;

    // Add arcs to make eyes look closed/happy when mouse is held down
    if (p5.mouseIsPressed) {
      p5.push();
      p5.noFill();
      p5.strokeWeight(5);
      p5.arc(leftEyeX, leftEyeY, 75, 75, 180, 360, p5.OPEN); // Left eye arc
      p5.arc(rightEyeX, rightEyeY, 75, 75, 180, 360, p5.OPEN); // Right eye arc
      p5.pop();
    } else {
      // Calculate angle between mouse and eyes center
      const angle = p5.atan2(p5.mouseY - (centerToEdge.y + catCenter.y - 75), p5.mouseX - (centerToEdge.x + catCenter.x));

      // Draw left eye
      p5.push();
      p5.fill(255);
      p5.translate(leftEyeX, leftEyeY);
      p5.ellipse(0, 0, 75, 75);
      p5.rotate(angle);
      p5.fill(0);
      p5.ellipse(12.5, 0, 40, 40);
      p5.pop();

      // Draw right eye
      p5.push();
      p5.translate(rightEyeX, rightEyeY);
      p5.fill(255);
      p5.ellipse(0, 0, 75, 75);
      p5.rotate(angle);
      p5.fill(0);
      p5.ellipse(12.5, 0, 40, 40);
      p5.pop();
    }
  };
}

export default function Sketch() {
  return <ReactP5Wrapper sketch={sketch} />;
};
