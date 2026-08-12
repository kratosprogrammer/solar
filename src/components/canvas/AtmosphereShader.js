// ─── Fresnel Atmosphere Shader ────────────────────────────────────────────────
export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = 1.0 - max(dot(vWorldNormal, viewDir), 0.0);
    fresnel = pow(fresnel, 4.0) * uIntensity;
    gl_FragColor = vec4(uAtmosphereColor, clamp(fresnel, 0.0, 0.7));
  }
`

// ─── Earth Day/Night Terminator Shader ────────────────────────────────────────
// Blends day texture on sun-facing side, night city lights on dark side
export const earthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const earthFragmentShader = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform vec3 uSunPosition;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;

  void main() {
    // Vector from surface point towards Sun at (0,0,0)
    vec3 toSun = normalize(uSunPosition - vWorldPos);

    // dot > 0 on Sun-facing day side, dot < 0 on dark night side
    float sunDot = dot(vWorldNormal, toSun);

    // Smooth transition at the terminator line [-0.1, 0.1]
    float dayFactor = smoothstep(-0.1, 0.1, sunDot);

    vec4 dayColor   = texture2D(uDayMap,   vUv);
    vec4 nightColor = texture2D(uNightMap, vUv);

    // City lights glow in golden yellow/white on the dark side
    vec3 cityLights = nightColor.rgb * 2.2;
    vec3 darkOcean  = dayColor.rgb * 0.04; // faint dark outline on night side
    vec3 nightSide  = cityLights + darkOcean;

    // Blend between Night (0) and Day (1)
    vec3 finalColor = mix(nightSide, dayColor.rgb, dayFactor);

    // Subtle warm sunset/sunrise glow along the terminator boundary
    float terminator = 1.0 - abs(sunDot * 5.0);
    terminator = clamp(terminator, 0.0, 1.0) * 0.12;
    finalColor += vec3(0.8, 0.4, 0.1) * terminator;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`
