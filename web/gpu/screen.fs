precision mediump float;

uniform sampler2D img;
uniform vec3 mult;

varying vec2 uv;

void main() {
	gl_FragColor = vec4(texture2D(img, uv).xyz * mult, 1.0);
}