var SceneNode = function(o) {

	if (o === undefined) o = {};



};

// Inherit from GLOW.Node
SceneNode.prototype = Object.create(GLOW.Node.prototype);
SceneNode.constructor = SceneNode;

SceneNode.prototype.update = function(dt, pgm, cim) {

	GLOW.Node.prototype.update.call(this, dt, pgm, cim);

	console.log('Update on SceneNode');

};