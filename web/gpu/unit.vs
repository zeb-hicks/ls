uniform mat4 localMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform sampler2D tHeight;
uniform vec2 mapres;

attribute vec3 vertices;
// attribute vec3 normals;
attribute vec2 uvs;

varying vec3 normal;
varying vec2 uv;
varying vec3 pos;

void main() {
	// vec2 pxl = vec2(1.0) / mapres;
	// vec2 unit = vec2(1.0, 0.0);
	// float ha = texture2D(tHeight, uv + pxl *-unit.xy).x;
	// float hb = texture2D(tHeight, uv + pxl * unit.xy).x;
	// float hc = texture2D(tHeight, uv + pxl *-unit.yx).x;
	// float hd = texture2D(tHeight, uv + pxl * unit.yx).x;
	// normal = normalize(normal * mat3(localMatrix[0].xyz, localMatrix[1].xyz, localMatrix[2].xyz));
	normal = vec3(0.0, 1.0, 0.0);
	uv = uvs;
	pos = (vec4(vertices, 1.0) * localMatrix).xyz;
	gl_Position = localMatrix * projectionMatrix * viewMatrix * vec4(vertices, 1.0);
}
