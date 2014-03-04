uniform mat4 localMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform sampler2D vHeight;
uniform sampler2D tHeight;
uniform vec2 vertres;

attribute vec3 vertices;
// attribute vec3 normals;
attribute vec2 uvs;

varying vec2 uv;
varying vec3 pos;
varying vec3 vnormal;

vec4 hmapnormal(vec2 UV) {
	vec2 pxl = vec2(0.5) / vertres;
	vec3 unit = vec3(-1.0, 0.0, 1.0);
	float sv = texture2D(vHeight, UV).x;
	float sa = texture2D(vHeight, UV + pxl * unit.zz).x;
	float sb = texture2D(vHeight, UV + pxl * unit.xz).x;
	float sc = texture2D(vHeight, UV + pxl * unit.zx).x;
	vec3 va = normalize(vec3(1.0, (sb-sa) * 16.0, 0.0));
	vec3 vb = normalize(vec3(0.0, (sc-sa) * 16.0, 1.0));
	vec4 N = vec4(vec3(1.0, -1.0, 1.0) * cross(va, vb), sv);
	return N;
}

void main() {
	vec4 mapd = normalize(hmapnormal(uvs));
	vnormal = mapd.xyz;
	uv = uvs;
	pos = (vec4(vertices, 1.0) * localMatrix).xyz;
	vec4 worldpos = vec4(vertices, 1.0);
	worldpos.y = texture2D(tHeight, uv).x * 32.0;
	gl_Position = localMatrix * projectionMatrix * viewMatrix * worldpos;
}
