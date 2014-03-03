precision highp float;

uniform sampler2D tDRock;
uniform sampler2D tNRock;
uniform sampler2D tSRock;
uniform sampler2D tDGrass;
uniform sampler2D tNGrass;
uniform sampler2D tSGrass;
uniform sampler2D tDTiles;
uniform sampler2D tNTiles;
uniform sampler2D tSTiles;

uniform bool dataPass;
uniform float id;

uniform vec2 location;
uniform vec3 cameraPosition;

varying vec3 normal;
varying vec2 uv;
varying vec3 pos;

void main() {
	vec3 color = vec3(0.0, 0.0, 0.0);
	color.xyz = normal * 0.5 + 0.5;
	// vec3 up = vec3(0.0, 1.0, 0.0);
	// color.xyz = vec3(pow(dot(normal, up), 2.0));

	// Grid
	float grid = min(1.0, pow(mod(uv.x * 128.0, 1.0) * 2.0 - 1.0, 16.0) + pow(mod(uv.y * 128.0, 1.0) * 2.0 - 1.0, 16.0));

	color = color * 0.9 + 0.1 * grid;

	// color.xyz = vec3(pow(mod(uv.x * 128.0, 1.0), 16.0) + pow(mod(uv.y * 128.0, 1.0), 16.0));
	// color.xyz = vec3(pow(mod(uv.x * 128.0, 1.0) * 2.0 - 1.0, 16.0) + pow(mod(uv.y * 128.0, 1.0) * 2.0 - 1.0, 16.0));
	gl_FragColor = vec4(color, 1.0);
	if (dataPass == true) {
		// vec3 ps = abs(pos);
		gl_FragColor.x = pos.x / 128.0 + 0.5;
		gl_FragColor.y = pos.z / 128.0 + 0.5;
		gl_FragColor.z = id;
	}
}
