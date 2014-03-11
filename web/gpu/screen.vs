uniform vec2 res;
uniform vec4 pos;
uniform float rot;

attribute vec3 vertices;
attribute vec2 uvs;
varying vec2 uv;

void main() {
	uv = uvs;
	// vec2 vertex = vertices.xy;
	// vec2 vpos = pos.xy / res;
	// // vec2 vuv = vtx * pos.zw;
	mat2 rm = mat2(0.0);
	rm[0].x = cos(rot);
	rm[0].y = -sin(rot);
	rm[1].x = sin(rot);
	rm[1].y = cos(rot);
	// rm[0].x = 1.0 + rot * 0.0001;
	// rm[0].y = 0.0;
	// rm[1].x = 0.0;
	// rm[1].y = 1.0;
	// vertex = vertex * rm + pos.zw;
	// gl_Position = vec4(vertex / res + pos.xy / res, 1.0, 1.0);
	gl_Position = vec4((vertices.xy * rm * pos.zw + pos.xy) / res, 1.0, 1.0);
}
