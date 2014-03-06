/// noise.js
/// random.js

var World = {
	size: 256,
	height: 32,
	hres: 1024,
	ready: false
};

World.loadLevel = function(o) {
	"use strict";

	if (o === undefined) o = {};

	// World.size = (o.size !== undefined ? o.size : 128);

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

			tHeight: World.heightMap,
			vHeight: World.heightMap2,
			fHeight: new GLOW.Float(World.height),

			tHA: new GLOW.Texture({url: './img/world/' + matFileA + '_height.jpg', onLoadComplete: purge}),
			tHB: new GLOW.Texture({url: './img/world/' + matFileB + '_height.jpg', onLoadComplete: purge}),
			tHC: new GLOW.Texture({url: './img/world/' + matFileC + '_height.jpg', onLoadComplete: purge}),

			tDA: new GLOW.Texture({url: './img/world/' + matFileA + '_diffuse.jpg', onLoadComplete: purge}),
			tDB: new GLOW.Texture({url: './img/world/' + matFileB + '_diffuse.jpg', onLoadComplete: purge}),
			tDC: new GLOW.Texture({url: './img/world/' + matFileC + '_diffuse.jpg', onLoadComplete: purge}),

			tNA: new GLOW.Texture({url: './img/world/' + matFileA + '_normal.jpg', onLoadComplete: purge}),
			tNB: new GLOW.Texture({url: './img/world/' + matFileB + '_normal.jpg', onLoadComplete: purge}),
			tNC: new GLOW.Texture({url: './img/world/' + matFileC + '_normal.jpg', onLoadComplete: purge}),

			tSA: new GLOW.Texture({url: './img/world/' + matFileA + '_spec.jpg', onLoadComplete: purge}),
			tSB: new GLOW.Texture({url: './img/world/' + matFileB + '_spec.jpg', onLoadComplete: purge}),
			tSC: new GLOW.Texture({url: './img/world/' + matFileC + '_spec.jpg', onLoadComplete: purge}),

			mapres: new GLOW.Vector2(World.hres, World.hres),
			vertres: new GLOW.Vector2(World.size, World.size),

			dataPass: new GLOW.Bool(false),
			id: new GLOW.Float(0),

			vertices: vertices,
			uvs: uvs
		},
		indices: indices,
		primitives: GL.TRIANGLES
	});

};

// World.mapData = {};
// World.mapData.canvas = {
// 	height: document.createElement('canvas'),
// 	humidity: document.createElement('canvas'),
// 	artifice: document.createElement('canvas'),
// 	combined: document.createElement('canvas')
// };
// World.mapData.

World.heightCvs = document.createElement('canvas');
World.heightCvs2 = document.createElement('canvas');
World.heightCtx = World.heightCvs.getContext('2d');
World.heightCtx2 = World.heightCvs2.getContext('2d');
World.heightImage = new Image();
World.heightImage.addEventListener('load', function(e) {
	World.heightCvs.width = this.width;
	World.heightCvs.height = this.height;
	World.heightCvs2.width = World.size;
	World.heightCvs2.height = World.size;

	World.heightCtx.fillStyle = '#000';
	World.heightCtx.fillRect(0, 0, World.hres, World.hres);
	World.heightCtx.drawImage(this, 0, 0);

	// World.heightCtx.fillRect(512, 512, 512, 512);

	World.heightCtx2.fillStyle = '#000';
	World.heightCtx2.fillRect(0, 0, World.size, World.size);
	World.heightCtx2.drawImage(World.heightCvs, 0, 0, World.size, World.size);

	World.heightMap = new GLOW.Texture({});
	World.heightMap2 = new GLOW.Texture({});
	World.heightMap.data = World.heightCvs;
	World.heightMap2.data = World.heightCvs2;
	World.heightMap.updateTexture();
	World.heightMap2.updateTexture();

	World.ready = true;
});
World.heightImage.src = './img/map.png';
World.heightMap = undefined;
World.heightMap2 = undefined;

// document.body.appendChild(World.heightCvs2);

World.update = function(dt) {
	"use strict";

};

World.draw = function(dt, data) {
	if (World.ready === false) return;
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
	World.plane.draw();
};
