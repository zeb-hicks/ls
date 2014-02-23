// const int LIGHT_COUNT = 8;

precision highp float;

// Lighting values.
// uniform vec3 lightPos[LIGHT_COUNT];
// uniform vec4 lightData[LIGHT_COUNT];
// uniform vec2 lightInfo[LIGHT_COUNT];

varying vec2 uv;
varying vec3 normal;
varying float id;
varying vec3 loc;
varying vec3 cloc;

void main() {
	vec3 C = vec3(0.5, 0.5, 0.5);
	if (id > 0.9 && id < 1.1) C = vec3(0.5, 0.52, 0.55);
	if (id > 1.9 && id < 2.1) C = vec3(0.3, 0.7, 0.4);
	if (id > 2.9 && id < 3.1) C = vec3(0.48, 0.42, 0.2);
	vec3 L = vec3(1.0 - uv.y);
	if (normal.y > 0.9) L = vec3(1.0);
	if (normal.y < -0.5) L = vec3(0.0);
	// L = pow(L, vec3(0.25)) * 0.9 + 0.1;
	gl_FragColor = vec4(C * L, 0.3);
}