/// scene.js

var Projectile = function(o) {

	o = o || {};

	this.position = new GLOW.Vector3();
	if (o.position !== undefined) this.position.copy(o.position);

	this.velocity = new GLOW.Vector3();
	if (o.velocity !== undefined) this.velocity.copy(o.velocity);

	this.acceleration = new GLOW.Vector3();
	if (o.acceleration !== undefined) this.acceleration.copy(o.acceleration);

	this.target = -1;
	if (o.target !== undefined) this.target = o.target;

	this.mode = Projectile.Modes.Basic;
	if (o.mode !== undefined) this.mode = o.mode;

	this.particle = null;
	if (o.particle !== undefined) this.particle = o.particle;

};

Projectile.prototype = Object.create(SceneNode.prototype);
Projectile.constructor = Projectile;

Projectile.prototype.update = function(dt, pgm, cim) {

	SceneNode.prototype.update.call(this, dt, pgm, cim);

	console.log('Update on Projectile.');

}

Projectile.Modes = {
	Basic: 0,
	Tracking: 1,
	Chaotic: 2
};