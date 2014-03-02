/// projectile.js

var Scene = {};

var GX = Scene.GX = new GLOW.Context({
	clear: { red: 0.1, green: 0.1, blue: 0.1 }
});

GX.setupCulling({frontFace: GL.CW});

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
