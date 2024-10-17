import { ReactP5Wrapper } from "@p5-wrapper/react";

// Calculations consider (0, 0) default starting point of WebGL mode canvas
const centerToEdge = { x: window.innerWidth/2, y: window.innerHeight/2 };
const catCenter = {
  x: -centerToEdge.x*0.65,
  y: centerToEdge.y*0.7,
};

/**
 * Sketch function for p5.js.
 * @param {import("p5")} p5 - The p5 instance
 */
function sketch(p5) {
  let catGraphics;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.angleMode(p5.DEGREES);

    // Create an off-screen graphics buffer
    catGraphics = p5.createGraphics(p5.width, p5.height, p5.WEBGL);
    catGraphics.angleMode(p5.DEGREES);

    // Pre-render static graphics
    drawFace(catGraphics, 520);
    drawFur(catGraphics, 520);
    drawEars(catGraphics, 180, 180, 180, 370, 30, 250);
    drawWhiskers(catGraphics);
    drawNose(catGraphics, -25, 0, 25, 0, 0, 30, 'pink');
    drawMouth(catGraphics, 50, 30, 100, 75);
    drawFangs(catGraphics, 50, 67, 30, 65, 40, 90);
    drawPaws(catGraphics, 200, (centerToEdge.y / 2)-110);
  };

  p5.draw = () => {
    // Display pre-rendered buffer
    p5.image(catGraphics, -p5.width / 2, -p5.height / 2);

    // Change cursor based on mouse position
    if (isMouseInRadius(p5, 263)) {
      p5.cursor(p5.HAND);
    } else {
      p5.cursor(p5.ARROW)
    }

    // Eyes
    const eyeOffset = 75;
    const eyeRadius = 75;
    const leftEyeCoords = { x: catCenter.x - eyeOffset, y: catCenter.y - eyeOffset };
    const rightEyeCoords = { x: catCenter.x + eyeOffset, y: catCenter.y - eyeOffset };

    // Add arcs to make eyes look closed/happy when mouse is held down
    if (p5.mouseIsPressed && isMouseInRadius(p5, 263)) {
      drawEyesHappy(p5, leftEyeCoords, rightEyeCoords, eyeRadius, 5);
    } else {
      drawEyesOpen(p5, leftEyeCoords, rightEyeCoords, eyeRadius);
    }
  };
}

/**
 * Draws cat face using an ellipse.
 * @param {import("p5")} p5 - The p5 instance
 */
function drawFace(p5, radius) {
  p5.push();
  p5.fill(20);
  p5.noStroke();
  p5.ellipse(catCenter.x, catCenter.y, radius, radius, 80);
  p5.pop();
}

/**
 * Draws fur on cat face.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} radius - Radius of cat face
 */
function drawFur(p5, radius) {
  p5.push();
  p5.stroke(50);

  // Generate fur strokes
  for (let i = 0; i < 5000; i++) {
    let angle = p5.random(0, 360); // Random angle in degrees

    // Random radius inside cat face using a square root for even distribution
    let r = p5.sqrt(p5.random()) * 0.5; // Scales points towards the center
    let posX = catCenter.x + r * p5.cos(angle) * radius;
    let posY = catCenter.y + r * p5.sin(angle) * radius;

    // Calculate offset for the fur strands to create outward growth
    let furLength = p5.random(2, 5); // Random length of fur strand
    let offsetX = posX + p5.cos(angle) * furLength;
    let offsetY = posY + p5.sin(angle) * furLength;

    // Random stroke weight for natural variation
    p5.strokeWeight(p5.random(1, 2));
    p5.line(posX, posY, offsetX, offsetY); // Draw individual fur strand
  }

  p5.pop();
}

/**
 * Draws cat ears using mirrored triangles.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} x1 - Outer bottom x offset for both triangles (mirrored)
 * @param {number} y1 - Outer bottom y offset for both triangles
 * @param {number} x2 - Top x offset for both triangles (mirrored)
 * @param {number} y2 - Top y offset for both triangles
 * @param {number} x3 - Inner bottom x offset for both triangles (mirrored)
 * @param {number} y3 - Inner bottom y offset for both triangles
 */
function drawEars(p5, x1, y1, x2, y2, x3, y3) {
  p5.push();
  p5.fill('pink');
  p5.stroke(20);
  p5.strokeWeight(10);
  p5.triangle(catCenter.x-x1, catCenter.y-y1, catCenter.x-x2, catCenter.y-y2, catCenter.x-x3, catCenter.y-y3); // Left ear
  p5.triangle(catCenter.x+x1, catCenter.y-y1, catCenter.x+x2, catCenter.y-y2, catCenter.x+x3, catCenter.y-y3); // Right ear
  p5.pop();
}

/**
 * Draws cat whiskers using mirrored arcs. Coords are kept static to simplify implementation
 * as this function is only expected to be used once anyway.
 * @param {import("p5")} p5 - The p5 instance
 */
function drawWhiskers(p5) {
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
}

/**
 * Draws cat nose using triangle.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} x1 - Top left x offset
 * @param {number} y1 - Top left y offset
 * @param {number} x2 - Top right x offset
 * @param {number} y2 - Top right y offset
 * @param {number} x3 - Bottom x offset
 * @param {number} y3 - Bottom x offset
 * @param {string} colour - Nose colour (e.g. `pink`)
 */
function drawNose(p5, x1, y1, x2, y2, x3, y3, colour) {
  p5.push();
  p5.fill(colour);
  p5.triangle(catCenter.x+x1, catCenter.y+y1, catCenter.x+x2, catCenter.y+y2, catCenter.x+x3, catCenter.y+y3);
  p5.pop();
}

/**
 * Draws cat mouth using mirrored arcs.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} x - x offset for arc centers
 * @param {number} y - y offset for arc centers
 * @param {number} w - Width for each arc
 * @param {number} h - Height for each arc
 */
function drawMouth(p5, x, y, w, h) {
  p5.push();
  p5.noFill();
  p5.stroke(255);
  p5.arc(catCenter.x-x, catCenter.y+y, w, h, 0, 100, p5.OPEN);
  p5.arc(catCenter.x+x, catCenter.y+y, w, h, 80, 180, p5.OPEN);
  p5.pop();
}

/**
 * Draws fangs under cat mouth using mirrored triangles.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} x1 - Bottom left x offset for both triangles (mirrored)
 * @param {number} y1 - Bottom left y offset for both triangles
 * @param {number} x2 - Bottom right x offset for both triangles (mirrored)
 * @param {number} y2 - Bottom right y offset for both triangles
 * @param {number} x3 - Top x offset for both triangles (mirrored)
 * @param {number} y3 - Top y offset for both triangles
 */
function drawFangs(p5, x1, y1, x2, y2, x3, y3) {
  p5.push();
  p5.noStroke();
  p5.triangle(catCenter.x-x1, catCenter.y+y1, catCenter.x-x2, catCenter.y+y2, catCenter.x-x3, catCenter.y+y3);
  p5.triangle(catCenter.x+x1, catCenter.y+y1, catCenter.x+x2, catCenter.y+y2, catCenter.x+x3, catCenter.y+y3);
  p5.pop();
}

/**
 * Draws mirrored cat paws at the bottom of the cat/screen.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} x - The x-offset from cat center
 * @param {number} y - The y-offset from cat center
 */
function drawPaws(p5, x, y) {
  const firstPawCenter = { x: catCenter.x-x, y: catCenter.y+y }
  const secondPawCenter = { x : catCenter.x+x, y: catCenter.y+y }

  p5.push();
  p5.fill(10); // Slightly darker paws than rest of body
  p5.stroke(50);

  // First paw
  p5.ellipse(firstPawCenter.x - 35, firstPawCenter.y, 30, 40);
  p5.ellipse(firstPawCenter.x - 15, firstPawCenter.y, 30, 70);
  p5.ellipse(firstPawCenter.x + 10, firstPawCenter.y, 30, 70);
  p5.ellipse(firstPawCenter.x + 30, firstPawCenter.y, 30, 40);

  // Second paw
  p5.ellipse(secondPawCenter.x - 35, secondPawCenter.y, 30, 40);
  p5.ellipse(secondPawCenter.x - 15, secondPawCenter.y, 30, 70);
  p5.ellipse(secondPawCenter.x + 10, secondPawCenter.y, 30, 70);
  p5.ellipse(secondPawCenter.x + 30, secondPawCenter.y, 30, 40);

  // Claws
  p5.fill(255);
  // Left paw claws
  p5.triangle(firstPawCenter.x - 43, firstPawCenter.y - 5, firstPawCenter.x - 33, firstPawCenter.y - 5, firstPawCenter.x - 38, firstPawCenter.y + 10);
  p5.triangle(firstPawCenter.x - 22, firstPawCenter.y - 15, firstPawCenter.x - 12, firstPawCenter.y - 15, firstPawCenter.x - 18, firstPawCenter.y + 10);
  p5.triangle(firstPawCenter.x + 3, firstPawCenter.y - 15, firstPawCenter.x + 13, firstPawCenter.y - 15, firstPawCenter.x + 7, firstPawCenter.y + 10);
  p5.triangle(firstPawCenter.x + 23, firstPawCenter.y - 7, firstPawCenter.x + 35, firstPawCenter.y - 7, firstPawCenter.x + 29, firstPawCenter.y + 10);

  // Right paw claws
  p5.triangle(secondPawCenter.x - 43, secondPawCenter.y - 5, secondPawCenter.x - 33, secondPawCenter.y - 5, secondPawCenter.x - 38, secondPawCenter.y + 10);
  p5.triangle(secondPawCenter.x - 22, secondPawCenter.y - 15, secondPawCenter.x - 12, secondPawCenter.y - 15, secondPawCenter.x - 18, secondPawCenter.y + 10);
  p5.triangle(secondPawCenter.x + 3, secondPawCenter.y - 15, secondPawCenter.x + 13, secondPawCenter.y - 15, secondPawCenter.x + 7, secondPawCenter.y + 10);
  p5.triangle(secondPawCenter.x + 23, secondPawCenter.y - 7, secondPawCenter.x + 35, secondPawCenter.y - 7, secondPawCenter.x + 29, secondPawCenter.y + 10);

  p5.pop();
}

/**
 * Draws open cat eyes using mirrored ellipses.
 * @param {import("p5")} p5 - The p5 instance
 * @param {{x: number, y: number}} leftEyeCoords - Coords for the center of the left eye
 * @param {{x: number, y: number}} rightEyeCoords - Coords for the center of the right eye
 * @param {number} radius - Radius of the (outer) eye ellipses
 */
function drawEyesOpen(p5, leftEyeCoords, rightEyeCoords, radius) {
  // Calculate angle between mouse and eyes center
  const angle = p5.atan2(p5.mouseY - (centerToEdge.y + leftEyeCoords.y), p5.mouseX - centerToEdge.x - ((leftEyeCoords.x + rightEyeCoords.x) / 2));

  // Draw left eye
  p5.push();
  p5.fill(255);
  p5.translate(leftEyeCoords.x, leftEyeCoords.y);
  p5.ellipse(0, 0, radius, radius);
  p5.rotate(angle);
  p5.fill(0);
  p5.ellipse(12.5, 0, radius/1.8, radius/1.8);
  p5.pop();

  // Draw right eye
  p5.push();
  p5.translate(rightEyeCoords.x, rightEyeCoords.y);
  p5.fill(255);
  p5.ellipse(0, 0, radius, radius);
  p5.rotate(angle);
  p5.fill(0);
  p5.ellipse(12.5, 0, radius/1.8, radius/1.8);
  p5.pop();
}

/**
 * Draws animated closed happy cat eyes using mirrored arcs.
 * @param {import("p5")} p5 - The p5 instance
 * @param {{x: number, y: number}} leftEyeCoords - Coords for the center of the left eye
 * @param {{x: number, y: number}} rightEyeCoords - Coords for the center of the right eye
 * @param {number} radius - Radius of the eye/arcs
 */
function drawEyesHappy(p5, leftEyeCoords, rightEyeCoords, radius, bounceSpeed) {
  const bounceOffset = p5.sin(p5.frameCount * bounceSpeed) * 10;

  p5.push();
  p5.noFill();
  p5.strokeWeight(10);
  p5.arc(leftEyeCoords.x, leftEyeCoords.y + bounceOffset, radius, radius, 180, 360, p5.OPEN); // Left eye arc
  p5.arc(rightEyeCoords.x, rightEyeCoords.y + bounceOffset, radius, radius, 180, 360, p5.OPEN); // Right eye arc
  p5.pop();
}

/**
 * Checks whether user's mouse position is within specified radius.
 * @param {import("p5")} p5 - The p5 instance
 * @param {number} radius - Radius to match against
 * @returns {boolean} Whether user's mouse is radius
 */
function isMouseInRadius(p5, radius) {
  const adjustedX = p5.mouseX - p5.width / 2;
  const adjustedY = p5.mouseY - p5.height / 2;

  const dist = p5.dist(adjustedX, adjustedY, catCenter.x, catCenter.y);

  return dist <= radius;
}

export default function Sketch() {
  return <ReactP5Wrapper sketch={sketch} />;
};
