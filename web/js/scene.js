/// projectile.js

var Scene = {};

var GX = Scene.GX = new GLOW.Context({
	clear: { red: 0, green: 0, blue: 0 },
	antialias: false
});

GX.setupCulling({frontFace: GL.CW});

GX.enableExtension('OES_standard_derivatives');
GX.enableExtension('OES_texture_float');

Scene.particles = [];

Scene.add = function(obj) {

	if (obj instanceof Scene.Model) {



	}

};


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

Scene.textureList = {};
Scene.getTexture = function(img) {
	if (Scene.textureList[img] === undefined) {
		Scene.textureList[img] = new GLOW.Texture({url: img, onload: function(){
			Scene.GX.cache.clear();
		}});
	}
	if (Scene.textureList[img].texture === undefined && typeof Scene.textureList[img].data === 'string') {
		setTimeout(function(){Scene.textureList[img].init();}, 1000);
	}
	return Scene.textureList[img];
};

Scene.drawBillboard = function(img, x, y, w, h, r, g, b, a, rot) {

	Scene.Billboard.overdest.set(false);
	Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.overdest);

	Scene.drawBillboardAt(img, x, y, w, h, r, g, b, a, rot);

};

Scene.drawBillboardOver = function(img, dst, x, y, w, h, r, g, b, a, rot) {

	Scene.Billboard.uniforms.dst.data = dst;
	Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.dst);

	Scene.Billboard.overdest.set(true);
	Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.overdest);

	Scene.drawBillboardAt(img, x, y, w, h, r, g, b, a, rot);

};

Scene.drawBillboardAt = function(img, x, y, w, h, r, g, b, a, rot) {

	if (Scene.Billboard.res.x !== GL.currentWidth || Scene.Billboard.res.y !== GL.currentHeight) {
		Scene.Billboard.res.set(GL.currentWidth, GL.currentHeight);
		Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.res);
	}

	if (Scene.Billboard.pos.x !== x || Scene.Billboard.pos.y !== y || Scene.Billboard.pos.z !== w || Scene.Billboard.pos.w !== h) {
		Scene.Billboard.pos.set(x, y, w, h);
		Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.pos);
	}

	Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.img);
	Scene.Billboard.uniforms.img.data = img;

	if (r !== undefined && g !== undefined && b !== undefined) {
		if (Scene.Billboard.mult.x !== r || Scene.Billboard.mult.y !== g || Scene.Billboard.mult.z !== b || Scene.Billboard.mult.w !== a) {
			Scene.Billboard.mult.set(r, g, b, a);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.mult);
		}
	} else {
		if (Scene.Billboard.mult.x !== 1 || Scene.Billboard.mult.y !== 1 || Scene.Billboard.mult.z !== 1 || Scene.Billboard.mult.w !== 1) {
			Scene.Billboard.mult.set(1, 1, 1, 1);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.mult);
		}
	}

	if (rot === undefined) rot = 0;
	if (Scene.Billboard.rot.value !== rot) {
		Scene.Billboard.rot.set(rot);
		Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.rot);
	}

	Scene.Billboard.draw();

};

Scene.Billboard = new GLOW.Shader({
	vertexShader: loadFile('./gpu/screen.vs'),
	fragmentShader: loadFile('./gpu/screen.fs'),
	data: {
		res: new GLOW.Vector2(1, 1),
		pos: new GLOW.Vector4(0, 0, 1, 1),
		rot: new GLOW.Float(0),
		img: undefined,
		dst: new GLOW.FBO(),
		overdest: new GLOW.Bool(false),
		mult: new GLOW.Vector4(1, 1, 1, 1),
		vertices: new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
		uvs: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
	},
	indices: new Float32Array([0, 2, 1, 1, 2, 3]),
	primitives: GL.TRIANGLES
});
Scene.Billboard.last = { img: null };
