/// noise.js
/// random.js

var World = {};

World.loadLevel = function(o) {
	"use strict";

	var i, j, k, l, x, y, z;
	var res = 256, hr = 128;

	var vertices = new Float32Array(res * res * 3);
	var indices = new Float32Array((res - 1) * (res - 1) * 6);
	var uvs = new Float32Array((res - 1) * (res - 1) * 6 * 2);
	var normals = new Float32Array(res * res * 3);

	for (y = 0; y <= res; y++) {
		for (x = 0; x <= res; x++) {
			i = (x + y * res) * 3;
			j = (x + y * res) * 2;
			vertices[i+0] = x - hr;
			vertices[i+1] = 0;
			vertices[i+2] = y - hr;

			normals[i+0] = 0;
			normals[i+1] = 1;
			normals[i+2] = 0;

			// uvs[j+0] = x % 2;
			// uvs[j+1] = y % 2;
			uvs[j+0] = x / res;
			uvs[j+1] = y / res;
		}
	}

	for (y = 0; y < res; y++) {
		for (x = 0; x < res; x++) {
			i = (x + y * res - 1) * 6;
			j = (x + y * res);
			indices[i+0] = j + 0;
			indices[i+1] = j + res;
			indices[i+2] = j + 1;

			indices[i+3] = j + 1;
			indices[i+4] = j + res;
			indices[i+5] = j + res + 1;
		}
	}

	World.plane = new GLOW.Shader({
		vertexShader: loadFile('./gpu/unit.vs'),
		fragmentShader: loadFile('./gpu/unit.fs'),
		data: {
			localMatrix: new GLOW.Matrix4(),
			projectionMatrix: GLOW.defaultCamera.projection,
			viewMatrix: GLOW.defaultCamera.inverse,

			vertices: vertices,
			uvs: uvs,
			normals: normals
		},
		indices: indices,
		primitives: GL.TRIANGLES
	});

};

World.update = function(dt) {
	"use strict";

};

World.draw = function(dt) {
	"use strict";
	GX.cache.invalidateUniform(World.plane.uniforms.viewMatrix);
	World.plane.draw();
};