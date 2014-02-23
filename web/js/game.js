/// scene.js
/// world.js
/// unit.js
/// net.js

var Game = {};

Game.init = function() {

	document.body.appendChild(Scene.GX.domElement);

	GLOW.defaultCamera.localMatrix.setPosition(0, 0, 10);
	GLOW.defaultCamera.position.set(0, 0, 10);
	GLOW.defaultCamera.update();

	Game.loop();
	Game.draw();

};

Game.clock = {
	loopTime: performance.now(),
	drawTime: performance.now()
};

Game.camera = {
	position: new GLOW.Vector3(0, 20, 0),
	targetPosition: new GLOW.Vector3(20, 20, 20),
	target: new GLOW.Vector3(0, 0, 0),
	angle: 0,
	zoom: 2,
	viewDist: 2
};

Game.input = {
	keyboard: {
		keys: []
	},
	mouse: {
		x: -1,
		y: -1,
		dx: 0,
		dy: 0,
		buttons: [],
		locked: false,
		wheel: 0
	},
	gamepad: {
		prev: undefined,
		state: undefined,
		deltas: {
			x: 0,
			y: 0,
			a: 0,
			b: 0,
			c: 0,
			d: 0,
			l: 0,
			r: 0
		}
	},
	control: {
		x: 0,
		y: 0,
		jump: 0,
		primary: 0,
		secondary: 0,
		block: 0,
		dodge: 0,
		mode: 0
	}
};

Game.player = {

	position: new GLOW.Vector3(0, 0, 0),
	velocity: new GLOW.Vector3(0, 0, 0),
	state: {
		animation: {
			time: 0,
			from: {
				id: 0,
				frame: 0
			},
			to: {
				id: 0,
				frame: 0
			}
		}
	}

};

Game.loop = function() {
    "use strict";

	var dt = performance.now() - Game.clock.loopTime;
	Game.clock.loopTime += dt;
	dt /= 1000;
	dt = dt > 0.2 ? 0.2 : dt;

	// Update world

	// var x, y, r = 3;
	// for (z=-r;z<r;z++) for (x=-r;x<r;x++) {
	// 	World.chunk(x, 0, z).update();
	// }
	World.update(dt);

	// Update input
	if (navigator.webkitGetGamepads !== undefined) {
		Game.input.gamepad.prev = Game.input.gamepad.state;
		Game.input.gamepad.state = navigator.webkitGetGamepads()[0];

		if (Game.input.gamepad.prev !== undefined) {
			Game.input.gamepad.deltas.x = Game.input.gamepad.state.axes[0] - Game.input.gamepad.prev.axes[0];
			Game.input.gamepad.deltas.y = Game.input.gamepad.state.axes[1] - Game.input.gamepad.prev.axes[1];
			Game.input.gamepad.deltas.a = Game.input.gamepad.state.buttons[0] - Game.input.gamepad.prev.buttons[0];
			Game.input.gamepad.deltas.b = Game.input.gamepad.state.buttons[1] - Game.input.gamepad.prev.buttons[1];
			Game.input.gamepad.deltas.c = Game.input.gamepad.state.buttons[2] - Game.input.gamepad.prev.buttons[2];
			Game.input.gamepad.deltas.d = Game.input.gamepad.state.buttons[3] - Game.input.gamepad.prev.buttons[3];
		}
	}

	// Update player(s)

	// Update camera

	if (Game.input.mouse.wheel !== 0) {
		Game.camera.zoom -= Game.input.mouse.wheel * 0.1;
		Game.camera.zoom = Math.max(1, Math.min(6, Game.camera.zoom));
		Game.input.mouse.wheel = 0;
	}

	if (Game.input.mouse.locked) {
		Game.camera.angle += Game.input.mouse.dx * 0.001;

		Game.input.mouse.dx = 0;
		Game.input.mouse.dy = 0;
	}

	var radius = 32 / (Game.camera.zoom * Game.camera.zoom);

	Game.camera.targetPosition.x = Game.player.position.x + 16 * radius * Math.cos(Game.camera.angle);
	Game.camera.targetPosition.y = Game.player.position.y + 8 * radius;
	Game.camera.targetPosition.z = Game.player.position.z + 16 * radius * Math.sin(Game.camera.angle);

	Game.camera.position.x += (Game.camera.targetPosition.x - Game.camera.position.x) * dt * 16;
	Game.camera.position.y += (Game.camera.targetPosition.y - Game.camera.position.y) * dt * 16;
	Game.camera.position.z += (Game.camera.targetPosition.z - Game.camera.position.z) * dt * 16;

	GLOW.defaultCamera.localMatrix.setPosition(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.position.set(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
	GLOW.defaultCamera.target.set(0, 0, 0);
	GLOW.defaultCamera.update();

	setTimeout(Game.loop, 16);
};

Game.draw = function() {
	var dt = performance.now() - Game.clock.drawTime;
	Game.clock.drawTime += dt;
	dt /= 1000;
	dt = dt > 0.2 ? 0.2 : dt;
	requestAnimationFrame(Game.draw);

	Scene.GX.clear();

	// var x, y, r = 3;
	// for (z=-r;z<r;z++) for (x=-r;x<r;x++) {
	// 	World.chunk(x, 0, z).draw();
	// }

	// Scene.GX.enableDepthTest();
	// Scene.GX.enableBlend(true, { equation: GL.FUNC_ADD, src: GL.SRC_ALPHA, dst: GL.ONE_MINUS_SRC_ALPHA });

	World.draw();

};



// Event Handlers

document.body.addEventListener('mousemove', function(e) {
	if (Game.input.mouse.locked) {
		Game.input.mouse.dx += e.webkitMovementX;
		Game.input.mouse.dy += e.webkitMovementY;
	} else {
		if (Game.input.mouse.x == -1 && Game.input.mouse.y == -1) {
			Game.input.mouse.x = e.clientX;
			Game.input.mouse.y = e.clientY;
		}
		Game.input.mouse.dx += e.clientX - Game.input.mouse.x;
		Game.input.mouse.dy += e.clientY - Game.input.mouse.y;
		Game.input.mouse.x = e.clientX;
		Game.input.mouse.y = e.clientY;
	}
});

document.body.addEventListener('mousedown', function(e) { Game.input.mouse.buttons[e.button] = true; });
document.body.addEventListener('mouseup', function(e) { Game.input.mouse.buttons[e.button] = false; });
document.body.addEventListener('contextmenu', function(e) { e.preventDefault(); });
document.body.addEventListener('wheel', function(e) { Game.input.mouse.wheel += e.deltaY / 100; });

// Pointer Lock Stuff

function plocked(e) {
	// console.log('POINTER LOCK CHANGED');
	// console.log(e);
	if (document.pointerLockElement === document.body || document.webkitPointerLockElement === document.body) {
		Game.input.mouse.locked = true;
	} else {
		Game.input.mouse.locked = false;
	}
}
document.addEventListener('pointerlockchange', plocked);
document.addEventListener('webkitpointerlockchange', plocked);
document.addEventListener('mozpointerlockchange', plocked);
document.body.requestPointerLock = document.body.requestPointerLock || document.body.webkitRequestPointerLock || document.body.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock;