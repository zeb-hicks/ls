var Scene = {};

var GX = Scene.GX = new GLOW.Context({
	clear: { red: 0.1, green: 0.1, blue: 0.1 }
});

Scene.add = function(obj) {

	if (obj instanceof Scene.Model) {



	}

};


Scene.Node = function(o) {

	if (o === undefined) o = {};



};

// Inherit from GLOW.Node
Scene.Node.prototype = Object.create(GLOW.Node.prototype);
Scene.Node.constructor = Scene.Node;

Scene.Model = function(o) {

	if (o === undefined) o = {};

};

Scene.Geometry = function(o) {

	this.vertices = new Float32Array();
	this.normals = new Float32Array();
	this.uvs = new Float32Array();
	this.indices = new Float32Array();

	this.iter = 0;

};

Scene.Geometry.makeShader = function() {

};

Scene.Node = function(o) {

};

Scene.Node.update = function(dt) {

};

Scene.Node.draw = function() {

};

// // Inherit from Scene.Node
// Scene.Chunk.prototype = Object.create(Scene.Node.prototype);
// Scene.Chunk.constructor = Scene.Chunk;

// Scene.Chunk.prototype.update = function(dt) {

// 	if (!this.needsUpdate) return; // Don't rebuild if we don't need to.

// 	this.rebuild();

// 	this.needsUpdate = false;

// }

// Scene.Chunk.prototype.draw = function() {

// 	// console.log(this.x + ',' + this.y + ',' + this.z + ' = Built: ' + this.built);

// 	if (this.deferring || this.builtStat !== 2) return;

// 	GX.cache.invalidateUniform(this.shader.uniforms.cameraInverse);

// 	this.shader.draw();

// }

// function setChar(str, id, ch) {
// 	return str.substr(0, id) + ch + str.substr(id + 1);
// }

// Scene.Chunk.prototype.rebuild = function() {

// 	if (this.deferring) return false;
// 	this.deferring = true;

// 	var chunkScope = this;
// 	var wkr = new Worker('./js/workers/chunk.js');
// 	wkr.addEventListener('message', function(e) {
// 		chunkScope.makeShader(
// 			new Float32Array(e.data.vertices),
// 			new Float32Array(e.data.indices),
// 			new Float32Array(e.data.uvs),
// 			new Float32Array(e.data.normals),
// 			new Float32Array(e.data.ids),
// 			new Float32Array(e.data.locs),
// 			new Float32Array(e.data.clocs)
// 		);
// 		chunkScope.deferring = false;
// 		chunkScope.builtStat = 2;
// 		for (var i=0;i<World.chunksToLoad.length;i++) {
// 			if (World.chunksToLoad[i].x == chunkScope.x &&
// 				World.chunksToLoad[i].y == chunkScope.y &&
// 				World.chunksToLoad[i].z == chunkScope.z) {
// 				World.chunksToLoad.splice(i, 1);
// 				World.chunksLoading--;
// 				console.log('Finished chunk ' + setChar('________________________________________________________________', (chunkScope.x + chunkScope.y * 4 + chunkScope.z * 16 + 42), 'X'));
// 			}
// 		}
// 		wkr.terminate();
// 	});
// 	console.log('Queueing chunk ' + setChar('________________________________________________________________', (this.x + this.y * 4 + this.z * 16 + 42), 'X'));
// 	wkr.postMessage({
// 		act: 'remesh',
// 		ids: this.blocks.id,
// 		x: this.x,
// 		y: this.y,
// 		z: this.z
// 	});

// 	return true;

// };

// Scene.Chunk.prototype.makeShader = function(vertices, indices, uvs, normals, ids, locs, clocs) {

// 	delete this.shader;

// 	this.geom.vertices = vertices;
// 	this.geom.indices = indices;
// 	this.geom.uvs = uvs;
// 	this.geom.normals = normals;

// 	this.shader = new GLOW.Shader({
// 		vertexShader: loadFile('./gpu/block.vs'),
// 		fragmentShader: loadFile('./gpu/block.fs'),
// 		data: {
// 			transform: new GLOW.Matrix4(),
// 			cameraInverse: GLOW.defaultCamera.inverse,
// 			cameraProjection: GLOW.defaultCamera.projection,

// 			vertices: this.geom.vertices,
// 			normals: this.geom.normals,
// 			uvs: this.geom.uvs,
// 			ids: ids,
// 			locs: locs,
// 			clocs: clocs
// 		},
// 		indices: this.geom.indices,
// 		primitives: GL.TRIANGLES
// 	});

// 	this.shader.transform.setPosition(32 * this.x, 32 * this.y, 32 * this.z);
// 	this.shader.uniforms.transform.data.setPosition(32 * this.x, 32 * this.y, 32 * this.z);
// 	Scene.GX.cache.invalidateUniform(this.shader.uniforms.transform);

// };