const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

// Create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

// Create particles forming a sphere
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < particleCount; i++) {
  const phi = Math.acos(2 * Math.random() - 1);
  const theta = Math.random() * Math.PI * 2;
  const radius = 3;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  positions.push(x, y, z);
}

particles.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3)
);

const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load(
  'https://threejs.org/examples/textures/sprites/circle.png'
);

const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1,
  map: circleTexture,
  transparent: true,
  alphaTest: 0.5,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

let targetZoom = camera.position.z;
window.addEventListener('wheel', (event) => {
  const delta = event.deltaY * 0.01;
  targetZoom += delta;

  targetZoom = Math.max(3, Math.min(targetZoom, 20));
});

function animate() {
  requestAnimationFrame(animate);

  camera.position.z += (targetZoom - camera.position.z) * 0.1;

  particleSystem.rotation.y += 0.001;
  particleSystem.rotation.x += 0.0005;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Dropdown behavior
const dropdown = document.getElementById("gpuDropdown");
const loadingMenu = document.getElementById("loadingMenu");
const loadingText = document.getElementById("loadingText");

// Notification sound
const notificationSound = new Audio("path/to/notification-sound.mp3");

// Dropdown change listener
dropdown.addEventListener("change", () => {
  if (dropdown.value !== "none") {
    startLoading();
  }
});

// Start loading process
function startLoading() {
  loadingMenu.style.display = "block";
  loadingText.innerText = "Loading...";
  loadingText.style.color = "blue";

  setTimeout(() => {
    loadingText.innerText = "✔ Done!";
    loadingText.style.color = "green";
    loadingText.style.transform = "scale(1.5)";

    setTimeout(() => {
      loadingMenu.style.display = "none";
      loadingText.style.transform = "scale(1)";

      // Show Overclock notification
      showNotification("Overclock Done", "The GPU overclock is complete.");
    }, 1000);
  }, 3000);
}

// Notification function with sound
function showNotification(title, body) {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: "logo.png",
    });

    // Play notification sound
    notificationSound.play();
  } else {
    console.warn("Notification permission not granted!");
  }
}

// Optimize Button Click
document.getElementById("optimizeBtn").addEventListener("click", () => {
  showNotification("Optimizer Activated", "The optimizer has been successfully activated.");
});

// Handle notification permissions on page load for mobile devices
if (Notification.permission === "default") {
  Notification.requestPermission().catch((err) => {
    console.warn("Notification permission request failed:", err);
  });
}
