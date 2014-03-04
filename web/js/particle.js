

var Particle = function(o) {
	if (o === undefined) o = {};

	this.position = new GLOW.Vector3();
	if (o.position !== undefined) this.position.copy(o.position);

	this.velocity = new GLOW.Vector3();
	if (o.velocity !== undefined) this.velocity.copy(o.velocity);

	this.acceleration = new GLOW.Vector3();
	if (o.acceleration !== undefined) this.acceleration.copy(o.acceleration);

	this._shader = new GLOW.Shader({
		vertexShader: loadFile('./gpu/particle.vs'),
		fragmentShader: loadFile('./gpu/particle.fs'),
		data: {
			tDiffuse: new GLOW.Texture({url: './img/fx/whiff.png'});
			vertices: Particle.UnitBillboard.vertices,
			uvs: Particle.UnitBillboard.uvs
		},
		indices: Particle.UnitBillboard.indices,
		primitices: GL.TRIANGLES
	});

}

Particle.UnitBillboard = {

	vertices: new Float32Array([-0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5]),
	uvs: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
	indices: new Float32Array([0, 1, 2, 2, 1, 3])

};

Particle.prototype.draw = function(dt) {



}
