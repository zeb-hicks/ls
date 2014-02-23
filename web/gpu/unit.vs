uniform mat4 localMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

attribute vec3 vertices;
attribute vec3 normals;
attribute vec2 uvs;

varying vec3 normal;
varying vec2 uv;

void main() {
	normal = normals;
	uv = uvs;
	gl_Position = vec4(vertices, 1.0) * localMatrix * projectionMatrix * viewMatrix;
}