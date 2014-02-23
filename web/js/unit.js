var Unit = function(o) {

	o = o || {};

	this._position = new GLOW.Vector3();
	if (o.position) this._position.copy(o.position);
	this._location = new GLOW.Vector2();
	if (o.location) this._position.copy(o.location);
	this._direction = new GLOW.Float(o._direction || 0);

	this.turnSpeed = o.turnSpeed || 0; // Zero turn speed is no turn delay.

	this.orders = [];

	this.internal = {};

	this.internal.localMatrix = new GLOW.Matrix4();
	this.internal.worldMatrix = new GLOW.Matrix4();

	this.internal.shaderOptions = {
		vertexShader: loadFile('gpu/unit.vs'),
		fragmentShader: loadFile('gpu/unit.fs'),
		data: {
			location: this._location,
			direction: this._direction,
			localMatrix: this.internal.worldMatrix
		}
	};

	this.internal.shaderOptions.data.vertices = GLOW.Geometry.Cube.vertices(10);
	this.internal.shaderOptions.data.uvs = GLOW.Geometry.Cube.uvs();
	this.internal.shaderOptions.data.normals = GLOW.Geometry.Cube.normals(this.internal.shaderOptions.data.vertices, this.internal.shaderOptions.data.uvs);

	this.internal.shaderOptions.indices = GLOW.Geometry.Cube.indices();
	this.internal.shaderOptions.primitives = GLOW.Geometry.Cube.primitives();

	this.internal.shader = new GLOW.Shader(this.internal.shaderOptions);


};

Unit.prototype = {
	set position(value) { this.position.copy(value); },
	get position() { return this.position; },
	set location(value) { this.location.copy(value); },
	get location() { return this.location; },
	set direction(value) { this.direction.value = value; },
	get direction() { return this.direction.value; },

	order: function(type, on) {
		if (on instanceof GLOW.Vector2) {
			// Location
			this.orders.push(new UnitOrder({
				type: type,
				location: new GLOW.Vector2().copy(on)
			}));
		} else if (typeof on === 'number') {
			// Target
			this.orders.push(new UnitOrder({
				type: type,
				location: new GLOW.Vector2().copy(Game.units[on].location),
				target: on
			}));
		} else {
			// No target
			this.orders.push(new UnitOrder({
				type: type,
				target: this.id
			}));
		}
	},
	update: function(dt) {

	},
	draw: function(dt,pmat) {
		this.internal.worldMatrix.copy(pmat);
		this.internal.worldMatrix.multiplySelf(this.internal.localMatrix);
	}
};

var UnitOrder = function(o) {

	o = o || {};

	this.type = o.type || UnitOrder.Type.None;
	this.location = o.location;
	this.target = o.target;

};

UnitOrder.prototype = {

};

UnitOrder.Type = {
	None: 0,
	Stop: 1,
	Move: 2,
	Attack: 3,
	Follow: 4,
	Cast: 5,
	PointCast: 6,
	SelfCast: 7
};