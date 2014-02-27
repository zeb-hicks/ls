precision highp float;

uniform vec2 location;

varying vec3 normal;
varying vec2 uv;

void main() {
	vec3 color = vec3(1.0, 0.0, 0.0);
	color = normal;
	color = vec3(uv, 0.0);
	gl_FragColor = vec4(color, 1.0);
}