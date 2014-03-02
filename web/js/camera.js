var Camera = {}

Camera.update = function(dt) {
	// Update camera

	if (Game.input.mouse.wheel !== 0) {
		Game.camera.zoom -= Game.input.mouse.wheel * 0.1;
		Game.camera.zoom = Math.max(1, Math.min(6, Game.camera.zoom));
	}

	if (Game.input.keyboard.keys[KEY_ALT] == true) {
		Game.camera.angle += Game.input.mouse.dx * 0.001;
		Game.camera.tilt += Game.input.mouse.dy * 0.001;
	}

	var radius = 32 / (Game.camera.zoom * Game.camera.zoom);

	var dh = 24 * Math.cos(Game.camera.tilt);
	var dv = 24 * Math.sin(Game.camera.tilt);

	Game.camera.targetPosition.x = Game.player.position.x + dh * radius * Math.cos(Game.camera.angle);
	Game.camera.targetPosition.y = Game.player.position.y + dv * radius;
	Game.camera.targetPosition.z = Game.player.position.z + dh * radius * Math.sin(Game.camera.angle);

	Game.camera.position.x += (Game.camera.targetPosition.x - Game.camera.position.x) * Math.min(1, dt * 16);
	Game.camera.position.y += (Game.camera.targetPosition.y - Game.camera.position.y) * Math.min(1, dt * 16);
	Game.camera.position.z += (Game.camera.targetPosition.z - Game.camera.position.z) * Math.min(1, dt * 16);

	GLOW.defaultCamera.localMatrix.setPosition(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.position.set(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.target.set(0, 0, 0);
	GLOW.defaultCamera.update();

};
