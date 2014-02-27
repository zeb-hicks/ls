uniform mat4 localMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

attribute vec3 vertices;
attribute vec3 normals;
attribute vec2 uvs;

varying vec3 normal;
varying vec2 uv;

void main() {
	normal = normalize(normals * mat3(localMatrix[0].xyz, localMatrix[1].xyz, localMatrix[2].xyz));
	uv = uvs;
	gl_Position = localMatrix * projectionMatrix * viewMatrix * vec4(vertices, 1.0);
}