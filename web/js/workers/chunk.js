importScripts('../lib/glowcore.js', '../lib/glowexts.js');

this.addEventListener('message', function(e) {

	var vertices = [];
	var indices = [];
	var uvs = [];
	var normals = [];
	var ids = [];
	var locs = [];
	var clocs = [];

	// console.log('Generating chunk at ' + e.data.x + ',' + e.data.y + ',' + e.data.z);

	var blocks = {
		id: e.data.ids
	};

	var cx = e.data.x, cy = e.data.y, cz = e.data.z;

	var x = 0, y = 0, z = 0, s = 32, ss = 1024, id;
	for (z=0;z<s;z++) for (y=0;y<s;y++) for (x=0;x<s;x++) {
		id = z * ss + y * s + x;
		if (blocks.id[id] !== 0) { // This block is not air.
			var a, b, c, d;
			if (blocks.id[id+1] === 0 || x === s-1) { // Block beside is air
				// Add X+ face
				a = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z - 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z - 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z + 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z + 0.5)) - 1;
				indices.push(a, c, b, b, c, d);
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(1, 0));
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(0, 0));
				normals.push(new GLOW.Vector3(1, 0, 0));
				normals.push(new GLOW.Vector3(1, 0, 0));
				normals.push(new GLOW.Vector3(1, 0, 0));
				normals.push(new GLOW.Vector3(1, 0, 0));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
			if (blocks.id[id-1] === 0 || x === 0) { // Block beside is air
				// Add X- face
				a = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z - 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z - 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z + 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z + 0.5)) - 1;
				indices.push(a, b, c, c, b, d);
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(0, 0));
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(1, 0));
				normals.push(new GLOW.Vector3(-1, 0, 0));
				normals.push(new GLOW.Vector3(-1, 0, 0));
				normals.push(new GLOW.Vector3(-1, 0, 0));
				normals.push(new GLOW.Vector3(-1, 0, 0));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
			if (blocks.id[id+s] === 0 || y === s-1) { // Block above is air
				// Add Y+ face
				a = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z - 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z - 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z + 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z + 0.5)) - 1;
				indices.push(a, b, c, c, b, d);
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(1, 0));
				uvs.push(new GLOW.Vector2(0, 0));
				normals.push(new GLOW.Vector3(0, 1, 0));
				normals.push(new GLOW.Vector3(0, 1, 0));
				normals.push(new GLOW.Vector3(0, 1, 0));
				normals.push(new GLOW.Vector3(0, 1, 0));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
			if (blocks.id[id-s] === 0 || y === 0) { // Block below is air
				// Add Y+ face
				a = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z - 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z - 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z + 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z + 0.5)) - 1;
				indices.push(a, c, b, b, c, d);
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(1, 0));
				uvs.push(new GLOW.Vector2(0, 0));
				normals.push(new GLOW.Vector3(0, -1, 0));
				normals.push(new GLOW.Vector3(0, -1, 0));
				normals.push(new GLOW.Vector3(0, -1, 0));
				normals.push(new GLOW.Vector3(0, -1, 0));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
			if (blocks.id[id+ss] === 0 || z === s-1) { // Block beside is air
				// Add Z+ face
				a = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z + 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z + 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z + 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z + 0.5)) - 1;
				indices.push(a, c, b, b, c, d);
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(0, 0));
				uvs.push(new GLOW.Vector2(1, 0));
				normals.push(new GLOW.Vector3(0, 0, 1));
				normals.push(new GLOW.Vector3(0, 0, 1));
				normals.push(new GLOW.Vector3(0, 0, 1));
				normals.push(new GLOW.Vector3(0, 0, 1));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
			if (blocks.id[id-ss] === 0 || z === 0) { // Block beside is air
				// Add Z- face
				a = vertices.push(new GLOW.Vector3(x - 0.5, y - 0.5, z - 0.5)) - 1;
				b = vertices.push(new GLOW.Vector3(x + 0.5, y - 0.5, z - 0.5)) - 1;
				c = vertices.push(new GLOW.Vector3(x - 0.5, y + 0.5, z - 0.5)) - 1;
				d = vertices.push(new GLOW.Vector3(x + 0.5, y + 0.5, z - 0.5)) - 1;
				indices.push(a, b, c, c, b, d);
				uvs.push(new GLOW.Vector2(1, 1));
				uvs.push(new GLOW.Vector2(0, 1));
				uvs.push(new GLOW.Vector2(1, 0));
				uvs.push(new GLOW.Vector2(0, 0));
				normals.push(new GLOW.Vector3(0, 0, -1));
				normals.push(new GLOW.Vector3(0, 0, -1));
				normals.push(new GLOW.Vector3(0, 0, -1));
				normals.push(new GLOW.Vector3(0, 0, -1));
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				ids.push(blocks.id[id]);
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				locs.push(new GLOW.Vector3(x, y, z));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
				clocs.push(new GLOW.Vector3(cx, cy, cz));
			}
		}
	}

	var va = new GLOW.Vector3Array(vertices).value;
	var ia = new Float32Array(indices);
	var ua = new GLOW.Vector2Array(uvs).value;
	var na = new GLOW.Vector3Array(normals).value;
	var da = new Float32Array(ids);
	var la = new GLOW.Vector3Array(locs).value;
	var ca = new GLOW.Vector3Array(clocs).value;

	postMessage({
		vertices: va.buffer,
		indices: ia.buffer,
		uvs: ua.buffer,
		normals: na.buffer,
		ids: da.buffer,
		locs: la.buffer,
		clocs: ca.buffer
	},
	[va.buffer, ia.buffer, ua.buffer, na.buffer, da.buffer, la.buffer, ca.buffer])

});