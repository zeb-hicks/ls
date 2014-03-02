/// noise.js
/// random.js

var World = {};

World.loadLevel = function(o) {
	"use strict";

	var i, j, k, l, x, y, z;
	var res = 128;
	var hr = res / 2;

	var vertices = new Float32Array(res * res * 3);
	var indices = new Float32Array((res - 1) * (res - 1) * 6);
	var uvs = new Float32Array((res - 1) * (res - 1) * 6 * 2);
	var normals = new Float32Array(res * res * 3);

	for (y = 0; y < res; y++) {
		for (x = 0; x < res; x++) {
			i = (x + y * res) * 3;
			j = (x + y * res) * 2;
			vertices[i+0] = x - hr + 0.5;
			vertices[i+1] = 0; //x / (y + 1) / 32 + y / (x + 1) / 32;
			vertices[i+2] = y - hr + 0.5;

			normals[i+0] = 0;
			normals[i+1] = 1;
			normals[i+2] = 0;

			// l = normals[i+0] * normals[i+0] + normals[i+1] * normals[i+1] + normals[i+2] * normals[i+2];
			// l /= 3;

			// normals[i+0] *= l;
			// normals[i+1] *= l;
			// normals[i+2] *= l;

			// uvs[j+0] = x % 2;
			// uvs[j+1] = y % 2;
			uvs[j+0] = x / res;
			uvs[j+1] = y / res;
		}
	}

	// var normals = new Float32Array(GLOW.Geometry.faceNormals(vertices, indices));

	for (y = 0; y < res - 1; y++) {
		for (x = 0; x < res - 1; x++) {
			i = (x + y * (res - 1)) * 6;
			j = (x + y * res);
			indices[i+0] = j + 0;
			indices[i+1] = j + 1;
			indices[i+2] = j + res;

			indices[i+3] = j + 1;
			indices[i+4] = j + res + 1;
			indices[i+5] = j + res;
		}
	}

	// for (i = 0; i < vertices.length; i++) if (isNaN(vertices[i])) console.log('Vert' + i + ' is NaN');
	// for (i = 0; i < uvs.length; i++) if (isNaN(uvs[i])) console.log('UV' + i + ' is NaN');
	// for (i = 0; i < normals.length; i++) if (!isNaN(normals[i])) console.log('Normal' + i + ' is not NaN');

	World.plane = new GLOW.Shader({
		vertexShader: loadFile('./gpu/unit.vs'),
		fragmentShader: loadFile('./gpu/unit.fs'),
		data: {
			localMatrix: new GLOW.Matrix4(),
			projectionMatrix: GLOW.defaultCamera.projection,
			viewMatrix: GLOW.defaultCamera.inverse,
			cameraPosition: GLOW.defaultCamera.position,

			dataPass: new GLOW.Bool(false),
			id: new GLOW.Float(0),

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

World.draw = function(dt, data) {
	"use strict";
	if (World.plane.uniforms.viewMatrix !== undefined) GX.cache.invalidateUniform(World.plane.uniforms.viewMatrix);
	if (World.plane.uniforms.cameraPosition !== undefined) GX.cache.invalidateUniform(World.plane.uniforms.cameraPosition);
	if (World.plane.uniforms.dataPass !== undefined) GX.cache.invalidateUniform(World.plane.uniforms.dataPass);
	if (data === true) {
		World.plane.dataPass.set(true);
	} else {
		World.plane.dataPass.set(false);
	}
	World.plane.draw();
};
