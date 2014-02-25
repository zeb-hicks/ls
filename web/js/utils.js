var SceneNode = function(o) {

    "use strict";

	if (o === undefined) o = {};

	GLOW.Node.call(this);

};

// Inherit from GLOW.Node
SceneNode.prototype = Object.create(GLOW.Node.prototype);
SceneNode.constructor = SceneNode;

SceneNode.prototype.update = function(dt, pgm, cim) {

    "use strict";

	GLOW.Node.prototype.update.call(this, dt, pgm, cim);

};