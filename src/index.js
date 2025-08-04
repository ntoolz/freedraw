// Brush colour and size
let penColor = "#000000";
let penWidth = 5;
const gridSize = 50; // size of each cell
let showGrid = false;
let lineMode = false;

// Drawing state
let latestPoint;
let drawing = false;

// Set up our drawing context
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let brush;

//pen width
const penwidth = document.querySelector('#a');
penwidth.addEventListener("change",()=>{
  penWidth = penwidth.value;
});

//pen color
const favcolor = document.querySelector('#favcolor');
const alphaInput = document.getElementById('alpha');
const ribbon = document.querySelector("#ribbon");

favcolor.addEventListener("change",()=>{
  penColor = getRGBA(favcolor.value);
  alphaInput.style.accentColor = penwidth.style.accentColor = favcolor.value;
});


alphaInput.addEventListener("change",()=>{
  penColor = getRGBA(favcolor.value);
});

function getRGBA(colorInput) {
  debugger;
  const hex = colorInput;
  const alpha = alphaInput.value;

  // Convert hex to RGB
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


let showgrid = document.querySelector('#showgrid');
showgrid.addEventListener("change",()=>{
  debugger;
  if(showgrid.checked)
  {
    showGrid = true
  }
  else{
    showGrid = false;
  }
  resizeCanvas();
});


// Drawing functions

//Draw line
let linemode = document.querySelector('#linemode');
linemode.addEventListener("change",(e)=> {
  //
  console.log("LineMode:ON")
});

let points = [];

canvas.addEventListener('click', (e) => {
  debugger;
  if(linemode.checked == false)
    return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  points.push({ x, y });

  if (points.length === 2) {
    drawLine(points[0], points[1]);
    points = []; // Reset for next line
  }
});

function drawLine(p1, p2) {
  let ctx = context;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y); // You can replace this with ctx.lineTo(200, 100) if you want fixed endpoint
  ctx.strokeStyle = penColor; // Set line color
  ctx.lineWidth = penWidth;       // Optional: set thickness
  ctx.stroke();
}


// Resize canvas to full screen
function resizeCanvas() {
  debugger;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawGrid(context); // redraw grid after resize
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial setup

// 🧮 Grid settings
function drawGrid(ctx) {

  if(showGrid==false)
    return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ccc'; // grid line color
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

const continueStroke = newPoint => {
  context.beginPath();
  context.moveTo(latestPoint[0], latestPoint[1]);
  context.strokeStyle = penColor;
  context.lineWidth = penWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineTo(newPoint[0], newPoint[1]);
  context.stroke();

  latestPoint = newPoint;
};

// Event helpers

const startStroke = point => {
  drawing = true;
  latestPoint = point;
};

const getTouchPoint = evt => {
  if (!evt.currentTarget) {
    return [0, 0];
  }
  const rect = evt.currentTarget.getBoundingClientRect();
  const touch = evt.targetTouches[0];
  return [touch.clientX - rect.left, touch.clientY - rect.top];
};

const BUTTON = 0b01;
const mouseButtonIsDown = buttons => (BUTTON & buttons) === BUTTON;

// Event handlers

const mouseMove = evt => {
  if (!drawing) {
    return;
  }
  continueStroke([evt.offsetX, evt.offsetY]);
};

const mouseDown = evt => {
  if (drawing) {
    return;
  }
  evt.preventDefault();
  canvas.addEventListener("mousemove", mouseMove, false);
  startStroke([evt.offsetX, evt.offsetY]);
};

const mouseEnter = evt => {
  if (!mouseButtonIsDown(evt.buttons) || drawing) {
    return;
  }
  mouseDown(evt);
};

const endStroke = evt => {
  if (!drawing) {
    return;
  }
  drawing = false;
  evt.currentTarget.removeEventListener("mousemove", mouseMove, false);
};

const touchStart = evt => {
  if (drawing) {
    return;
  }
  evt.preventDefault();
  startStroke(getTouchPoint(evt));
};

const touchMove = evt => {
  if (!drawing) {
    return;
  }
  continueStroke(getTouchPoint(evt));
};

const touchEnd = evt => {
  drawing = false;
};

// Register event handlers
canvas.addEventListener("touchstart", touchStart, false);
canvas.addEventListener("touchend", touchEnd, false);
canvas.addEventListener("touchcancel", touchEnd, false);
canvas.addEventListener("touchmove", touchMove, false);

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", endStroke, false);
canvas.addEventListener("mouseout", endStroke, false);
canvas.addEventListener("mouseenter", mouseEnter, false);
