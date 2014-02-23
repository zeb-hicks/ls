// const int LIGHT_COUNT = 8;

// Lighting values.
// uniform vec3 lightPos[LIGHT_COUNT];
// uniform vec4 lightData[LIGHT_COUNT];
// uniform vec2 lightInfo[LIGHT_COUNT];

// World location
uniform mat4 transform;
uniform mat4 cameraInverse;
uniform mat4 cameraProjection;

attribute vec3 vertices;
attribute vec2 uvs;
attribute vec3 normals;
attribute float ids;
attribute vec3 locs;

varying vec2 uv;
varying vec3 normal;
varying float id;
varying vec3 loc;

void main() {
	uv = uvs;
	id = ids;
	loc = locs;
	normal = normalize(normals * mat3(transform[0].xyz, transform[1].xyz, transform[2].xyz));
	gl_Position = cameraProjection * cameraInverse * transform * vec4(vertices, 1.0);
}