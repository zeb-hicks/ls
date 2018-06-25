precision mediump float;

uniform sampler2D img;
uniform vec4 mult;

varying vec2 uv;

void main() {
	vec4 t = texture2D(img, uv);
	gl_FragColor = t * mult;
}