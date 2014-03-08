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

	// var hsz = World.size / 2;
	// var xp = (Game.camera.target.x + hsz);
	// var zp = (Game.camera.target.z + hsz);
	// if (xp > 0 && xp < World.size && zp > 0 && zp < World.size) {
	// 	var xd = xp % 1;
	// 	var zd = zp % 1;
	// 	var xo = 1.0 - xd;
	// 	var zo = 1.0 - zd;
	// 	var s = 1024;
	// 	var i = 1024 * 3 * Math.floor(xp);
	// 	var i = 1024 * 3 * Math.floor(zp);
	// 	var h0 = World.mapData.hfbo.data[i];
	// 	var h1 = World.mapData.hfbo.data[i+1];
	// 	var h2 = World.mapData.hfbo.data[i+s];
	// 	var h3 = World.mapData.hfbo.data[i+s+1];
	// 	// console.log(i, h0, h1, h2, h3);
	// 	var hv = h0 * xo * zo + h1 * xd * zo + h2 * xo * zd + h3 * xd * zd;
	// 	Game.camera.target.y = hv / 255 * World.height;
	// } else {
	// 	Game.camera.target.y = 0;
	// }

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
