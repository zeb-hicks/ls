/// noise.js
/// random.js

var World = {
	size: 128,
	height: 16,
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

	// var matFileA = 'dirt/dirt';
	// var matFileB = 'grass/clover_small';
	// var matFileC = 'struct/square_tiles';
	var matFileA = 'rock/bedrock';
	var matFileB = 'dirt/dirt';
	var matFileC = 'grass/clover_small';

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
World.mapData.cfbo = new GLOW.FBO({size: 512, data: new Uint8Array(512 * 512 * 4)}); // Cache FBO for temporary storage.
World.mapData.fcfbo = new GLOW.FBO({size: 512, type: GL.FLOAT}); // Cache FBO for temporary storage.
// World.mapData.scfbo = new GLOW.FBO({type: GL.FLOAT}); // Screen Float FBO for temporary storage.

World.mapData.hfbo = new GLOW.FBO({size: 512, type: GL.FLOAT}); // Height FBO.
World.mapData.halfbo = new GLOW.FBO({size: 128, type: GL.FLOAT}); // Half-size height (for vert displacement)
// World.mapData.hfbo = new GLOW.FBO({size: 512}); // Height FBO.
// World.mapData.halfbo = new GLOW.FBO({size: 128}); // Half-size height (for vert displacement)

World.mapData.lfbo = new GLOW.FBO({size: 512, data: new Uint8Array(512 * 512 * 4)}); // Light
World.mapData.pfbo = new GLOW.FBO({size: World.size, data: new Uint8Array(World.size * World.size * 4)}); // Pressure/flow

World.mapData.ofbo = new GLOW.FBO({size: 1024, data: new Uint8Array(1024 * 1024 * 4)}); // Overlay (debug/orders/pings/etc)

World.mapData.needLoad = false;
World.mapData.heightMap = new GLOW.Texture({url: './img/map2.png', onLoadComplete: function() {
	// console.log(World.mapData.heightMap);
	// World.mapData.heightMap.updateTexture();
	World.mapData.needLoad = true;
}}).init();

World.heightAt = function(x, y) {

};

World.update = function(dt) {
	"use strict";

};

World.alterMap = function(dt) {

	var pb = new Uint8Array(4);
	// World.mapData.hfbo.bind();
	// var diff = World.mapData.hfbo.width / World.size;
	// Scene.GX.GL.readPixels(512 + Game.camera.target.x * diff, 512 + Game.camera.target.z * diff, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pb);
	// World.mapData.hfbo.unbind();

	// Game.camera.target.y = pb[0] / 255 * World.height;
	Game.camera.target.y = World.height;

	Scene.GX.GL.readPixels(Game.input.mouse.x, window.innerHeight - Game.input.mouse.y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pb);

	if (World.mapData.needLoad === true && World.mapData.heightMap.data.complete === true) {
		World.mapData.hfbo.bind();
		Scene.drawBillboard(World.mapData.heightMap, 0, 0, 512, 512);
		World.mapData.hfbo.unbind();
		World.mapData.halfbo.bind();
		Scene.drawBillboard(World.mapData.heightMap, 0, 0, World.size, World.size);
		World.mapData.halfbo.unbind();
		World.mapData.needLoad = false;
	}

	Scene.GX.clear();

	if (pb[0] !== 0 && pb[1] !== 0) {
		ml.tx = pb[0];
		ml.ty = pb[1];
		ml.tc = pb[2] / 255;
	}
	ml.px = ml.x;
	ml.py = ml.y;
	ml.x += (ml.tx - ml.x);// / 8;
	ml.y += (ml.ty - ml.y);// / 8;
	ml.c += (ml.tc - ml.c);// / 8;
	ml.r = Math.atan2(ml.py - ml.y, ml.px - ml.x);


	if (Game.input.mouse.buttons[0] == true) {
		var w = World.mapData.hfbo.width / World.size;
		var h = World.mapData.hfbo.width;
		World.scorchMap(ml.x * w - h, ml.y * w - h, 64, Scene.getTexture('./img/fx/scorch_0.png'), -0.02, -0.3, -0.5, 1);
	}

	World.mapData.hfbo.bind();
	Scene.GX.enableBlend(true, {
		equation: GL.FUNC_ADD,
		src: GL.SRC_ALPHA,
		dst: GL.ONE_MINUS_SRC_ALPHA
	});
	Scene.drawBillboard(World.mapData.heightMap, 0, 0, 512, 512, 1, 1, 1, dt * 0.01, 0);
	World.mapData.hfbo.unbind();

	Scene.GX.enableBlend(false);

};

setInterval(function() {
}, 100);

// Burn and deform the map at the specified location.
World.scorchMap = function(x, y, r, t, ir, ig, ib, ia, a) {

	if (a === undefined) a = Math.random() * Math.TAU;
	if (t === undefined) t = Scene.getTexture('./img/fx/scorch_0.png');
	if (ir === undefined) ir = 1;
	if (ig === undefined) ig = 1;
	if (ib === undefined) ib = 1;
	if (ia === undefined) ia = 1;

	var flip = false;
	if (ir < 0 && ig < 0 && ib < 0) {
		ir = Math.abs(ir);
		ig = Math.abs(ig);
		ib = Math.abs(ib);
		flip = true;
	}

	// Cache the heightmap into the temp fbo.
	World.mapData.fcfbo.bind();
	Scene.GX.clear();
	GX.enableBlend(false);
	Scene.drawBillboard(World.mapData.hfbo, 0, 0, 512, 512);
	World.mapData.fcfbo.unbind();

	// Throw the cached heightmap onto the height fbo, and then scorch the map.
	World.mapData.hfbo.bind();
	Scene.GX.clear();
	Scene.drawBillboard(World.mapData.fcfbo, 0, 0, 512, 512);
	GX.enableBlend(true, {
		equation: flip ? GL.FUNC_REVERSE_SUBTRACT : GL.FUNC_ADD,
		src: GL.SRC_ALPHA,
		dst: GL.ONE
	});
	Scene.drawBillboard(t, x, y, r, r, ir, ig, ib, ia, a);
	World.mapData.hfbo.unbind();

	// Copy the new height values onto the vert heightmap.
	World.mapData.halfbo.bind();
	Scene.GX.clear();
	GX.enableBlend(false);
	Scene.drawBillboard(World.mapData.hfbo, 0, 0, World.size, World.size);
	World.mapData.halfbo.unbind();

	// TODO: Optimize this shit so it only happens once each frame at most, and just blend
	//       loads of scorches from a list, rather than copying back/forth for each scorch.
	//       To easily do this later, just use this function to queue up scorches and then
	//       process them each frame if the scorch list is greater than zero.

};

// Alter the atmospheric pressure at the specified location.
// Pressude deforms grass billboards and pushes particles.
World.alterPressure = function(x, y, r, v) {

}

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
	Scene.GX.enableDepthTest(true);
	GX.enableBlend(false);
	World.plane.draw();
};
