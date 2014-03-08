/// projectile.js

var Scene = {};

var GX = Scene.GX = new GLOW.Context({
	clear: { red: 0, green: 0, blue: 0 },
	antialias: false
});

GX.setupCulling({frontFace: GL.CW});

GX.enableExtension('OES_standard_derivatives');

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
	if (Scene.textureList[img].texture === undefined) {
		Scene.textureList[img].init();
	}
	return Scene.textureList[img];
};

Scene.drawBillboard = function(fbo, img, x, y, w, h, r, g, b, rot) {

	if (fbo !== undefined && fbo !== null) {
		if (Scene.Billboard.res.x !== fbo.width || Scene.Billboard.res.y !== fbo.height) {
			Scene.Billboard.res.set(fbo.width, fbo.height);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.res);
		}
	} else {
		if (Scene.Billboard.res.x !== window.innerWidth || Scene.Billboard.res.y !== window.innerHeight) {
			Scene.Billboard.res.set(window.innerWidth, window.innerHeight);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.res);
		}
	}
	if (Scene.Billboard.pos.x !== x || Scene.Billboard.pos.y !== y || Scene.Billboard.pos.z !== w || Scene.Billboard.pos.w !== h) {
		Scene.Billboard.pos.set(x, y, w, h);
		Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.pos);
	}
	Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.img);
	Scene.Billboard.uniforms.img.data = img;

	if (r !== undefined && g !== undefined && b !== undefined) {
		if (Scene.Billboard.mult.x !== r || Scene.Billboard.mult.y !== g || Scene.Billboard.mult.z !== b) {
			Scene.Billboard.mult.set(r, g, b);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.mult);
		}
	} else {
		if (Scene.Billboard.mult.x !== 1 || Scene.Billboard.mult.y !== 1 || Scene.Billboard.mult.z !== 1) {
			Scene.Billboard.mult.set(1, 1, 1);
			Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.mult);
		}
	}

	if (rot === undefined) rot = 0;
	if (Scene.Billboard.rot.value !== rot) {
		Scene.Billboard.rot.set(rot);
		Scene.GX.cache.invalidateUniform(Scene.Billboard.uniforms.rot);
	}

	if (Scene.Billboard.uniforms.img.data === undefined) {
		console.log('What the fuck.');
	} else {
		Scene.Billboard.draw();
	}

};

Scene.Billboard = new GLOW.Shader({
	vertexShader: loadFile('./gpu/screen.vs'),
	fragmentShader: loadFile('./gpu/screen.fs'),
	data: {
		res: new GLOW.Vector2(1, 1),
		pos: new GLOW.Vector4(0, 0, 1, 1),
		rot: new GLOW.Float(0),
		img: undefined,
		mult: new GLOW.Vector3(1.0, 1.0, 1.0),
		vertices: new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]),
		uvs: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])
	},
	indices: new Float32Array([0, 2, 1, 1, 2, 3]),
	primitives: GL.TRIANGLES
});
Scene.Billboard.last = { img: null };
