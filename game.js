// Basic First-Person 2.5D Game Preview Example

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Camera/player
let player = {
  x: 400, y: 200,
  angle: 0, // radians
  speed: 2,
  turnSpeed: Math.PI / 60
};

// Simple object definitions
let objects = [
  {type: "bed", x: 120, y: 130},
  {type: "server", x: 320, y: 100},
  {type: "console", x: 400, y: 220},
  {type: "atv", x: 700, y: 310},
  {type: "suv", x: 650, y: 70}
];

// Key state
let keys = {};
document.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

// Mouse look
let mouseDown = false;
canvas.addEventListener('mousedown', () => mouseDown = true);
canvas.addEventListener('mouseup', () => mouseDown = false);
canvas.addEventListener('mousemove', e => {
  if (mouseDown) {
    player.angle += e.movementX * 0.01;
  }
});

// Movement
function update() {
  // Forward/Backward
  if (keys['w'] || keys['arrowup']) {
    player.x += Math.cos(player.angle) * player.speed;
    player.y += Math.sin(player.angle) * player.speed;
  }
  if (keys['s'] || keys['arrowdown']) {
    player.x -= Math.cos(player.angle) * player.speed;
    player.y -= Math.sin(player.angle) * player.speed;
  }
  // Turn
  if (keys['a'] || keys['arrowleft']) player.angle -= player.turnSpeed;
  if (keys['d'] || keys['arrowright']) player.angle += player.turnSpeed;
}

// Draw scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fake 3D: Draw objects from player's view
  for (let obj of objects) {
    // Calculate relative position
    let dx = obj.x - player.x;
    let dy = obj.y - player.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let angleToObj = Math.atan2(dy, dx) - player.angle;

    // Only draw if within 90 deg FOV
    if (Math.abs(angleToObj) < Math.PI / 2) {
      let size = Math.max(10, 120 - dist * 0.3);
      let screenX = 400 + Math.tan(angleToObj) * 300 - size/2;
      let color = {
        "bed":"#bbf",
        "server":"#8f8",
        "console":"#ff8",
        "atv":"#f88",
        "suv":"#fff"
      }[obj.type] || "#ccc";
      ctx.fillStyle = color;
      ctx.fillRect(screenX, 200 - size/2, size, size);
      ctx.strokeStyle = "#222";
      ctx.strokeRect(screenX, 200 - size/2, size, size);
      ctx.fillStyle = "#222";
      ctx.font = "bold 12px Arial";
      ctx.fillText(obj.type.toUpperCase(), screenX+5, 200);
    }
  }

  // HUD (crosshair)
  ctx.strokeStyle = "#0ff";
  ctx.beginPath();
  ctx.moveTo(400-10, 200); ctx.lineTo(400+10, 200);
  ctx.moveTo(400, 200-10); ctx.lineTo(400, 200+10);
  ctx.stroke();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// JSON Loader
function loadJSON() {
  try {
    let data = JSON.parse(document.getElementById('jsonArea').value);
    if (data.objects) objects = data.objects;
  } catch (e) {
    alert("Invalid JSON!");
  }
}
