var Camera = {}

Camera.update = function(dt) {
	"use strict";

	if (Game.input.mouse.wheel !== 0) {
		Game.camera.zoom -= Game.input.mouse.wheel * 0.1;
		Game.camera.zoom = Math.max(1, Math.min(12, Game.camera.zoom));
	}

	if (Game.input.keyboard.keys[KEY_ALT] === true) {
		Game.camera.angle += Game.input.mouse.dx * 0.001;
		Game.camera.tilt = Math.max(0, Math.min(Math.HPI - 0.01, Game.camera.tilt + Game.input.mouse.dy * 0.001));
	}

	if (Game.input.mouse.buttons[1] === true) {
		var dr = Math.atan2(-Game.input.mouse.dy, Game.input.mouse.dx);
		var dl = Math.sqrt(Game.input.mouse.dx * Game.input.mouse.dx + Game.input.mouse.dy * Game.input.mouse.dy);
		dr -= Game.camera.angle;
		var dx = Math.sin(dr) * dl * 0.23 / Game.camera.zoom;
		var dz = Math.cos(dr) * dl * 0.23 / Game.camera.zoom;
		Game.camera.panDelta.x += dx;
		Game.camera.panDelta.z += dz;
		// Game.camera.target.x += dx;
		// Game.camera.target.z += dz;
		// Game.camera.position.x += dx;
		// Game.camera.position.z += dz;
	}

	Game.camera.panDelta.multiplyScalar(0.5);
	Game.camera.target.addSelf(Game.camera.panDelta);
	Game.camera.position.addSelf(Game.camera.panDelta);

	var radius = 32 / (Game.camera.zoom * Game.camera.zoom);

	var dh = 24 * Math.cos(Game.camera.tilt);
	var dv = 24 * Math.sin(Game.camera.tilt);

	if (World.heightCtx !== undefined) {
		var id = World.heightCtx.getImageData(Math.round(Game.camera.target.x / World.size * World.hres) + World.hres / 2, Math.round(Game.camera.target.z / World.size * World.hres) + World.hres / 2, 1, 1);
		Game.camera.target.y = id.data[0] / 255 * World.height;
	}

	Game.camera.targetPosition.x = Game.camera.target.x + dh * radius * Math.cos(Game.camera.angle);
	Game.camera.targetPosition.y = Game.camera.target.y + dv * radius;
	Game.camera.targetPosition.z = Game.camera.target.z + dh * radius * Math.sin(Game.camera.angle);

	Game.camera.position.x += (Game.camera.targetPosition.x - Game.camera.position.x) * Math.min(1, dt * 16);
	Game.camera.position.y += (Game.camera.targetPosition.y - Game.camera.position.y) * Math.min(1, dt * 16);
	Game.camera.position.z += (Game.camera.targetPosition.z - Game.camera.position.z) * Math.min(1, dt * 16);

	GLOW.defaultCamera.localMatrix.setPosition(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.position.set(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.target.copy(Game.camera.target);
	GLOW.defaultCamera.update();

};
