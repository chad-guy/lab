const textContainer = document.getElementById("textContainer");
let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// const fragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D u_texture;
//   uniform vec2 u_mouse;
//   uniform vec2 u_prevMouse;

//   float random(vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
//   }

//   void main() {
//     // Dirección del movimiento del mouse
//     vec2 mouseDirection = u_mouse - u_prevMouse;

//     // Distorsión base
//     vec2 distortion = vec2(
//       random(vUv + u_mouse.x) * 0.02,
//       random(vUv + u_mouse.y) * 0.02
//     );

//     // Efecto de tinta que sigue al mouse
//     vec2 toMouse = u_mouse - vUv;
//     float distToMouse = length(toMouse);
//     float inkEffect = smoothstep(0.4, 0.0, distToMouse);

//     // Combinar efectos
//     vec2 uvOffset = distortion + mouseDirection * inkEffect * 0.8;
//     vec2 uv = vUv - uvOffset;

//     // Añadir variación de color
//     vec4 texColor = texture2D(u_texture, uv);
//     float noise = random(uv * 10.0) * 0.1;

//     // Efecto de difusión de tinta
//     float inkSpread = smoothstep(0.2, 0.0, distToMouse) * 0.15;
//     texColor.rgb += vec3(noise) * inkSpread;

//     gl_FragColor = texColor;
//   }
// `;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Dirección del movimiento del mouse
    vec2 mouseDirection = u_mouse - u_prevMouse;

    // Distorsión base reducida
    vec2 distortion = vec2(
      random(vUv + u_mouse.x) * 0.01,  // Reducido de 0.02 a 0.01
      random(vUv + u_mouse.y) * 0.01   // Reducido de 0.02 a 0.01
    );

    // Efecto de tinta más contenido
    vec2 toMouse = u_mouse - vUv;
    float distToMouse = length(toMouse);
    float inkEffect = smoothstep(0.2, 0.0, distToMouse);  // Reducido de 0.4 a 0.2

    // Reducir el efecto de arrastre
    vec2 uvOffset = distortion + mouseDirection * inkEffect * 0.4;  // Reducido de 0.8 a 0.4
    vec2 uv = vUv - uvOffset;

    // Reducir la variación de color
    vec4 texColor = texture2D(u_texture, uv);
    float noise = random(uv * 10.0) * 0.05;  // Reducido de 0.1 a 0.05

    // Efecto de difusión más sutil
    float inkSpread = smoothstep(0.1, 0.0, distToMouse) * 0.08;  // Reducido de 0.2/0.15 a 0.1/0.08
    texColor.rgb += vec3(noise) * inkSpread;

    gl_FragColor = texColor;
  }
`;

// const fragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D u_texture;
//   uniform vec2 u_mouse;
//   uniform vec2 u_prevMouse;

//   float random(vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
//   }

//   void main() {
//     // Mouse movement and distance
//     vec2 mouseDirection = u_mouse - u_prevMouse;
//     vec2 toMouse = u_mouse - vUv;
//     float distToMouse = length(toMouse);

//     // Wave effect
//     float wave = sin(vUv.y * 40.0 + distToMouse * 10.0) * 0.002;
//     wave *= smoothstep(0.4, 0.0, distToMouse);

//     // Holographic distortion
//     vec2 uvOffset = vec2(
//       wave + mouseDirection.x * 0.1,
//       wave + mouseDirection.y * 0.1
//     ) * smoothstep(0.3, 0.0, distToMouse);

//     // RGB Split effect
//     float rgbSplit = 0.005 * smoothstep(0.4, 0.0, distToMouse);
//     vec4 redChannel = texture2D(u_texture, vUv + uvOffset + vec2(rgbSplit, 0.0));
//     vec4 greenChannel = texture2D(u_texture, vUv + uvOffset);
//     vec4 blueChannel = texture2D(u_texture, vUv + uvOffset - vec2(rgbSplit, 0.0));

//     // Glitch effect
//     float glitchIntensity = random(floor(vUv * 50.0 + u_mouse * 10.0)) * 0.04;
//     glitchIntensity *= smoothstep(0.3, 0.0, distToMouse);
//     vec2 glitchOffset = vec2(glitchIntensity * sin(u_mouse.x * 10.0));

//     // Combine effects
//     vec4 glitchedTexture = texture2D(u_texture, vUv + glitchOffset);
//     vec4 finalColor = vec4(
//       redChannel.r,
//       greenChannel.g,
//       blueChannel.b,
//       1.0
//     );

//     // Add scanlines
//     float scanline = sin(vUv.y * 200.0) * 0.02;
//     finalColor.rgb += scanline;

//     // Add holographic glow
//     float glow = smoothstep(0.4, 0.0, distToMouse) * 0.2;
//     finalColor.rgb += vec3(0.1, 0.5, 1.0) * glow;

//     gl_FragColor = finalColor;
//   }
// `;

function createTextTexture(text, font, size, color, fontWeight = "100") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const canvasWidth = window.innerWidth * 1.5;
  const canvasHeight = window.innerHeight * 1.5;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.fillStyle = color || "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const fontSize = size || Math.floor(canvasWidth * 0.3);

  ctx.fillStyle = "#1a1a1a";
  ctx.font = `${fontWeight} ${fontSize}px "${font || "Rowdies"}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  const scaleFactor = Math.min(1, (canvasWidth * 0.8) / textWidth);
  const aspectCorrection = canvasWidth / canvasHeight;

  ctx.setTransform(
    scaleFactor,
    0,
    0,
    scaleFactor / aspectCorrection,
    canvasWidth / 2,
    canvasHeight / 2
  );

  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = fontSize * 0.005;
  for (let i = 0; i < 3; i++) {
    ctx.strokeText(text, 0, 0);
  }
  ctx.fillText(text, 0, 0);

  return new THREE.CanvasTexture(canvas);
}

function initializeScene(texture) {
  scene = new THREE.Scene();

  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    -1,
    1,
    1 / aspectRatio,
    -1 / aspectRatio,
    0.1,
    1000
  );
  camera.position.z = 1;

  let shaderUniforms = {
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_prevMouse: { type: "v2", value: new THREE.Vector2() },
    u_texture: { type: "t", value: texture },
  };

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader,
      fragmentShader,
    })
  );

  scene.add(planeMesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  textContainer.appendChild(renderer.domElement);
}

function reloadTexture() {
  const newTexture = createTextTexture(
    "chadguy",
    "Rowdies",
    null,
    "#ffffff",
    "100"
  );
  planeMesh.material.uniforms.u_texture.value = newTexture;
}

initializeScene(
  createTextTexture("chadguy", "Rowdies", null, "#ffffff", "100")
);

function animateScene() {
  requestAnimationFrame(animateScene);

  mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
  mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

  planeMesh.material.uniforms.u_mouse.value.set(
    mousePosition.x,
    1.0 - mousePosition.y
  );

  planeMesh.material.uniforms.u_prevMouse.value.set(
    prevPosition.x,
    1.0 - prevPosition.y
  );

  renderer.render(scene, camera);
}

animateScene();

textContainer.addEventListener("mousemove", handleMouseMove);
textContainer.addEventListener("mouseenter", handleMouseEnter);
textContainer.addEventListener("mouseleave", handleMouseLeave);

function handleMouseMove(event) {
  easeFactor = 0.035;
  let rect = textContainer.getBoundingClientRect();
  prevPosition = { ...targetMousePosition };

  targetMousePosition.x = (event.clientX - rect.left) / rect.width;
  targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseEnter(event) {
  easeFactor = 0.01;
  let rect = textContainer.getBoundingClientRect();

  mousePosition.x = targetMousePosition.x =
    (event.clientX - rect.left) / rect.width;
  mousePosition.y = targetMousePosition.y =
    (event.clientY - rect.top) / rect.height;
}

function handleMouseLeave() {
  easeFactor = 0.01;
  targetMousePosition = { ...prevPosition };
}

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera.left = -1;
  camera.right = 1;
  camera.top = 1 / aspectRatio;
  camera.bottom = -1 / aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  reloadTexture();
}
