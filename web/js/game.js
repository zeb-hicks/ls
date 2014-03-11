/// constants.js
/// scene.js
/// camera.js
/// world.js
/// unit.js
/// net.js

var Game = {};

Game.init = function() {

	document.body.appendChild(Scene.GX.domElement);

	GLOW.defaultCamera.localMatrix.setPosition(0, 0, 10);
	GLOW.defaultCamera.position.set(0, 0, 10);
	GLOW.defaultCamera.update();

	GX.setupBlend({
		equation: GL.ADD,
		src: GL.ONE,
		dst: GL.ONE_MINUS_SRC_ALPHA
	});

	World.loadLevel(function() {
		Game.loop();
		Game.draw();
	});

};

Game.clock = {
	loopTime: performance.now(),
	drawTime: performance.now()
};

Game.camera = {
	position: new GLOW.Vector3(0, 20, 0),
	targetPosition: new GLOW.Vector3(20, 20, 20),
	target: new GLOW.Vector3(0, 0, 0),
	panDelta: new GLOW.Vector3(0, 0, 0),
	angle: 0,
	zoom: 2,
	tilt: 1.1,
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

	Camera.update(dt);

	// Reset input.
	Game.input.mouse.dx = 0;
	Game.input.mouse.dy = 0;

	if (Game.input.mouse.wheel !== 0) {
		Game.input.mouse.wheel = 0;
	}

	setTimeout(Game.loop, 16);
};

Game.draw = function() {
    "use strict";
	var dt = performance.now() - Game.clock.drawTime;
	Game.clock.drawTime += dt;
	dt /= 1000;
	dt = dt > 0.2 ? 0.2 : dt;
	requestAnimationFrame(Game.draw);

	Scene.GX.clear();

	GX.enableBlend(false);

	World.draw(dt, true);

	var pb = new Uint8Array(4);
	World.mapData.hfbo.bind();
	var diff = World.mapData.hfbo.width / World.size;
	Scene.GX.GL.readPixels(512 + Game.camera.target.x * diff, 512 + Game.camera.target.z * diff, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pb);
	World.mapData.hfbo.unbind();

	Game.camera.target.y = pb[0] / 255 * World.height;

	Scene.GX.GL.readPixels(Game.input.mouse.x, window.innerHeight - Game.input.mouse.y, 1, 1, GL.RGBA, GL.UNSIGNED_BYTE, pb);

	if (World.mapData.needLoad === true && World.mapData.heightMap.data.complete === true) {
		World.mapData.hfbo.bind();
		Scene.drawBillboard(World.mapData.heightMap, 0, 0, 1024, 1024);
		World.mapData.hfbo.unbind();
		World.mapData.halfbo.bind();
		Scene.drawBillboard(World.mapData.heightMap, 0, 0, 128, 128);
		World.mapData.halfbo.unbind();
		// World.mapData.needLoad = false;
	}

	Scene.GX.clear();

	if (pb[0] !== 0 && pb[1] !== 0) {
		ml.px = ml.x;
		ml.py = ml.y;
		ml.x += (pb[0] - ml.x) / 8;
		ml.y += (pb[1] - ml.y) / 8;
		ml.r = Math.atan2(ml.py - ml.y, ml.px - ml.x);

		if (Game.input.mouse.buttons[0] == true) {

			var w = World.mapData.hfbo.width / World.size;
			var h = World.mapData.hfbo.width;

			GX.enableBlend(true);

			World.mapData.hfbo.bind();
			Scene.drawBillboardOver(Scene.getTexture('./img/fx/puff.png'), World.mapData.hfbo, ml.x * w - h, ml.y * w - h, 128, 128, -1, -1, -1, 0.5, ml.r + Math.PI);
			World.mapData.hfbo.unbind();

			w = World.mapData.halfbo.width / World.size;
			h = World.mapData.halfbo.width;

			World.mapData.halfbo.bind();
			Scene.drawBillboardOver(Scene.getTexture('./img/fx/puff.png'), World.mapData.halfbo, ml.x * w - h, ml.y * w - h, 16, 16, -1, -1, -1, 0.5, ml.r + Math.PI);
			World.mapData.halfbo.unbind();

		}
	}

	World.mapData.lfbo.bind();

	Scene.GX.clear();
	Scene.drawBillboard(Scene.getTexture('./img/fx/bulb.png'), ml.x * 2 - 256, ml.y * 2 - 256, 16, 16, 1, 1, 1, 1, ml.r + Math.PI);

	World.mapData.lfbo.unbind();

	GX.enableBlend(false);

	World.draw(dt, false);

	// Next we'll sort the particles to be drawn.

	Scene.particles.sort(function(a, b) {
		var da, db;

		da = Math.pow(a.position.x - GLOW.defaultCamera.position.x, 2.0) + Math.pow(a.position.y - GLOW.defaultCamera.position.y, 2.0) + Math.pow(a.position.z - GLOW.defaultCamera.position.z, 2.0);
		db = Math.pow(b.position.x - GLOW.defaultCamera.position.x, 2.0) + Math.pow(b.position.y - GLOW.defaultCamera.position.y, 2.0) + Math.pow(b.position.z - GLOW.defaultCamera.position.z, 2.0);

		return da - db;
	});

	for (var i = 0; i < Scene.particles.length; i++) {
		Scene.particles[i].draw();
	}

};

window.ml = {
	x: 0,
	y: 0,
	px: 0,
	py: 0,
	r: 0
}

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
if (window.onwheel !== undefined) {
	document.body.addEventListener('wheel', function(e) { Game.input.mouse.wheel += e.deltaY / 100; });
} else {
	document.body.addEventListener('mousewheel', function(e) { Game.input.mouse.wheel -= e.wheelDeltaY / 120; });
}
document.body.addEventListener('keydown', function(e) { Game.input.keyboard.keys[e.which] = true; if (e.keyCode !== KEY_F5 && !(e.keyCode === KEY_J && e.ctrlKey && e.shiftKey)) e.preventDefault(); });
document.body.addEventListener('keyup', function(e) { Game.input.keyboard.keys[e.which] = false; e.preventDefault(); });
window.addEventListener('focus', function(e) {
});
window.addEventListener('blur', function(e) {
	for (var i = 0; i < Game.input.keyboard.keys.length; i++) Game.input.keyboard.keys[i] = false;
	for (var i = 0; i < Game.input.mouse.buttons.length; i++) Game.input.mouse.buttons[i] = false;
	Game.input.mouse.wheel = 0;
});

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
