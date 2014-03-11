precision mediump float;

uniform sampler2D img;
uniform sampler2D dst;
uniform vec4 mult;
uniform bool overdest;

varying vec2 uv;

void main() {
	vec4 t = texture2D(img, uv);
	if (overdest == true) {
		// gl_FragColor.rgb = vec3(0.5) + (texture2D(dst, uv).rgb + mult.rgb * t.rgb) * 0.5;
		gl_FragColor.rgb = texture2D(dst, uv).rgb * 2.0;
		// gl_FragColor.a = t.a * mult.a;
		gl_FragColor.a = mult.a;
	} else {
		gl_FragColor = t * mult;
	}
}