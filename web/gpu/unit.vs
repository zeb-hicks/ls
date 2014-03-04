uniform mat4 localMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform sampler2D tHeight;
uniform vec2 mapres;

attribute vec3 vertices;
// attribute vec3 normals;
attribute vec2 uvs;

varying vec2 uv;
varying vec3 pos;

void main() {
	// normal = normalize(hmapnormal(uvs));
	uv = uvs;
	pos = (vec4(vertices, 1.0) * localMatrix).xyz;
	vec4 worldpos = vec4(vertices, 1.0);
	worldpos.y = texture2D(tHeight, uv).x * 32.0;
	gl_Position = localMatrix * projectionMatrix * viewMatrix * worldpos;
}
