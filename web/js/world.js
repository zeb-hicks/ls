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
	// var normals = new Float32Array(res * res * 3);

	var av = new GLOW.Vector3(),
		bv = new GLOW.Vector3(),
		cv = new GLOW.Vector3(),
		nv = new GLOW.Vector3();

	for (y = 0; y < res; y++) {
		for (x = 0; x < res; x++) {
			i = (x + y * res) * 3;
			j = (x + y * res) * 2;

			var dist = Math.sqrt(Math.pow(x - hr, 2.0) + Math.pow(y - hr, 2.0));

			vertices[i+0] = x - hr + 0.5;
			vertices[i+1] = Math.cos(Math.PI * dist / 80) * 16;
			vertices[i+2] = y - hr + 0.5;

			uvs[j+0] = x / res;
			uvs[j+1] = y / res;
		}
	}

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

	// for (i = 0; i < indices.length / 3; i++) {
	// 	j = i * 3;
	// 	x = indices[j+0];
	// 	y = indices[j+1];
	// 	z = indices[j+2];

	// 	av.set(vertices[x*3+0], vertices[x*3+1], vertices[x*3+2]);
	// 	bv.set(vertices[y*3+0], vertices[y*3+1], vertices[y*3+2]);
	// 	cv.set(vertices[z*3+0], vertices[z*3+1], vertices[z*3+2]);

	// 	bv.subSelf(av);
	// 	cv.subSelf(av);

	// 	nv.cross(bv, cv).normalize();

	// 	normals[x*3+0] = nv.x;
	// 	normals[x*3+1] = -nv.y;
	// 	normals[x*3+2] = nv.z;
	// 	normals[y*3+0] = nv.x;
	// 	normals[y*3+1] = -nv.y;
	// 	normals[y*3+2] = nv.z;
	// 	normals[z*3+0] = nv.x;
	// 	normals[z*3+1] = -nv.y;
	// 	normals[z*3+2] = nv.z;
	// }

	World.plane = new GLOW.Shader({
		vertexShader: loadFile('./gpu/unit.vs'),
		fragmentShader: loadFile('./gpu/unit.fs'),
		data: {
			localMatrix: new GLOW.Matrix4(),
			projectionMatrix: GLOW.defaultCamera.projection,
			viewMatrix: GLOW.defaultCamera.inverse,
			cameraPosition: GLOW.defaultCamera.position,

			tHeight: new GLOW.Texture({url: './img/height.png'}),
			mapres: new GLOW.Vector2(1024, 1024),

			dataPass: new GLOW.Bool(false),
			id: new GLOW.Float(0),

			vertices: vertices,
			uvs: uvs
			// normals: normals
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
