/// noise.js
/// random.js

var World = {
	size: 128,
	height: 32,
	hres: 1024,
	ready: false
};

World.loadLevel = function(cb) {
	"use strict";

	var i, j, k, l, x, y, z;
	var res = World.size;
	var hr = res / 2;

	var vertices = new Float32Array(res * res * 3);
	var indices = new Float32Array((res - 1) * (res - 1) * 6);
	var uvs = new Float32Array((res - 1) * (res - 1) * 6 * 2);

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

	function purge() {
		Scene.GX.cache.clear();
	}

	var matFileA = 'dirt/dirt';
	var matFileB = 'grass/clover_small';
	var matFileC = 'struct/square_tiles';

	World.plane = new GLOW.Shader({
		vertexShader: loadFile('./gpu/unit.vs'),
		fragmentShader: loadFile('./gpu/unit.fs'),
		data: {
			localMatrix: new GLOW.Matrix4(),
			projectionMatrix: GLOW.defaultCamera.projection,
			viewMatrix: GLOW.defaultCamera.inverse,
			cameraPosition: GLOW.defaultCamera.position,

			tHeight: World.mapData.hfbo,
			vHeight: World.mapData.halfbo,
			fHeight: new GLOW.Float(World.height),

			tLight: World.mapData.lfbo,

			tHA: Scene.getTexture('./img/world/' + matFileA + '_height.jpg'),
			tHB: Scene.getTexture('./img/world/' + matFileB + '_height.jpg'),
			tHC: Scene.getTexture('./img/world/' + matFileC + '_height.jpg'),

			tDA: Scene.getTexture('./img/world/' + matFileA + '_diffuse.jpg'),
			tDB: Scene.getTexture('./img/world/' + matFileB + '_diffuse.jpg'),
			tDC: Scene.getTexture('./img/world/' + matFileC + '_diffuse.jpg'),

			tNA: Scene.getTexture('./img/world/' + matFileA + '_normal.jpg'),
			tNB: Scene.getTexture('./img/world/' + matFileB + '_normal.jpg'),
			tNC: Scene.getTexture('./img/world/' + matFileC + '_normal.jpg'),

			tSA: Scene.getTexture('./img/world/' + matFileA + '_spec.jpg'),
			tSB: Scene.getTexture('./img/world/' + matFileB + '_spec.jpg'),
			tSC: Scene.getTexture('./img/world/' + matFileC + '_spec.jpg'),

			mapres: new GLOW.Vector2(World.hres, World.hres),
			vertres: new GLOW.Vector2(World.size, World.size),

			dataPass: new GLOW.Bool(false),
			id: new GLOW.Float(0),

			time: new GLOW.Float(0),

			vertices: vertices,
			uvs: uvs
		},
		indices: indices,
		primitives: GL.TRIANGLES
	});

	if (cb !== undefined) cb();

};

World.mapData = {};
World.mapData.hfbo = new GLOW.FBO({size: 1024, data: new Uint8Array(1024 * 1024 * 4)});
World.mapData.halfbo = new GLOW.FBO({size: 128, data: new Uint8Array(128 * 128 * 4)});
World.mapData.lfbo = new GLOW.FBO({size: 256, data: new Uint8Array(256 * 256 * 4)});
World.mapData.needLoad = false;

World.mapData.heightMap = new GLOW.Texture({url: './img/map.png', onLoadComplete: function() {
	// console.log(World.mapData.heightMap);
	// World.mapData.heightMap.updateTexture();
	World.mapData.needLoad = true;
}}).init();

World.update = function(dt) {
	"use strict";

};

World.draw = function(dt, data) {
	"use strict";
	if (World.plane.uniforms.viewMatrix !== undefined) GX.cache.invalidateUniform(World.plane.uniforms.viewMatrix);
	if (World.plane.uniforms.cameraPosition !== undefined) GX.cache.invalidateUniform(World.plane.uniforms.cameraPosition);
	if (World.plane.uniforms.dataPass !== undefined) {
		GX.cache.invalidateUniform(World.plane.uniforms.dataPass);
		if (data === true) {
			World.plane.dataPass.set(true);
		} else {
			World.plane.dataPass.set(false);
		}
	}
	// GX.cache.invalidateUniform(World.plane.uniforms.time);
	// World.plane.time.set((Date.now() % 10000) / 10000);
	World.plane.draw();
};
