precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform sampler2D tDRock;
uniform sampler2D tHRock;
uniform sampler2D tNRock;
uniform sampler2D tSRock;
uniform sampler2D tDGrass;
uniform sampler2D tHGrass;
uniform sampler2D tNGrass;
uniform sampler2D tSGrass;
uniform sampler2D tDTiles;
uniform sampler2D tHTiles;
uniform sampler2D tNTiles;
uniform sampler2D tSTiles;

uniform sampler2D tHeight;
uniform vec2 mapres;

uniform bool dataPass;
uniform float id;

uniform vec2 location;
uniform vec3 cameraPosition;

varying vec3 vnormal;
varying vec2 uv;
varying vec3 pos;

mat3 TSN( vec3 eye_pos, vec3 surf_norm ) {

	vec3 q0 = dFdx( eye_pos.xyz );
	vec3 q1 = dFdy( eye_pos.xyz );
	vec2 st0 = dFdx( uv.st );
	vec2 st1 = dFdy( uv.st );

	vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
	vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
	vec3 N = normalize( surf_norm );

	return mat3( S, T, N );
}

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 tex_norm ) {
	return normalize( TSN(eye_pos, surf_norm) * tex_norm );
}

vec4 hmapnormal(vec2 UV) {
	vec2 pxl = vec2(0.5) / mapres;
	vec3 unit = vec3(-1.0, 0.0, 1.0);
	float sv = texture2D(tHeight, UV).x;
	float sa = texture2D(tHeight, UV + pxl * unit.zz).x;
	float sb = texture2D(tHeight, UV + pxl * unit.xz).x;
	float sc = texture2D(tHeight, UV + pxl * unit.zx).x;
	vec3 va = normalize(vec3(1.0, (sb-sa) * 16.0, 0.0));
	vec3 vb = normalize(vec3(0.0, (sc-sa) * 16.0, 1.0));
	vec4 N = vec4(vec3(1.0, -1.0, 1.0) * cross(va, vb), sv);
	return N;
}

void main() {
	vec4 mp = hmapnormal(uv);
	vec3 mpd = texture2D(tHeight, uv).xyz;
	// vec3 normal = mp.xyz;
	vec3 color = vec3(0.0, 0.0, 0.0);
	// vec3 normal = normalize(vnormal + mp.xyz);
	// color.xyz = normal * 0.5 + 0.5;
	// vec3 up = vec3(0.0, 1.0, 0.0);
	// color.xyz = vec3(dot(normal, up));

	// Grid
	float grid = min(1.0, pow(mod(uv.x * 128.0, 1.0) * 2.0 - 1.0, 16.0) + pow(mod(uv.y * 128.0, 1.0) * 2.0 - 1.0, 16.0));

	// color *= max(0.0, mp.w * 1.2 - 0.2);

	vec2 suv = uv * vec2(16.0);
	float hr = texture2D(tHRock, suv).x * 0.1;
	float hg = texture2D(tHGrass, suv).x * mpd.y;
	float ht = texture2D(tHTiles, suv).x * mpd.z;
	vec3 dr = texture2D(tDRock, suv).xyz;
	vec3 dg = texture2D(tDGrass, suv).xyz;
	vec3 dt = texture2D(tDTiles, suv).xyz;
	vec3 nr = normalize(texture2D(tNRock, suv).xyz * 2.0 - 1.0);
	vec3 ng = normalize(texture2D(tNGrass, suv).xyz * 2.0 - 1.0);
	vec3 nt = normalize(texture2D(tNTiles, suv).xyz * 2.0 - 1.0);
	vec3 sr = texture2D(tSRock, suv).xyz;
	vec3 sg = texture2D(tSGrass, suv).xyz;
	vec3 st = texture2D(tSTiles, suv).xyz;
	vec3 tn;
	vec3 ts;

	if (hr > hg + 0.01) {
		if (hr > ht + 0.01) {
			color = dr;
			tn = nr;
			ts = sr;
			// color.xyz = vec3(1.0, 0.0, 0.0);
		} else {
			color = dt;
			tn = nt;
			ts = st;
			// color.xyz = vec3(0.0, 0.0, 1.0);
		}
	} else {
		if (hg > ht + 0.01) {
			color = dg;
			tn = ng;
			ts = sg;
			// color.xyz = vec3(0.0, 1.0, 0.0);
		} else {
			color = dt;
			tn = nt;
			ts = st;
			// color.xyz = vec3(0.0, 0.0, 1.0);
		}
	}

	// vec3 normal = normalize(vnormal.xyz + mp.xyz + tn.xyz);
	vec3 normal = perturbNormal2Arb(cameraPosition - pos, vnormal.xyz, tn.xyz);
	normal = perturbNormal2Arb(cameraPosition - pos, normal, tn.xyz);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 hv = normalize((pos - cameraPosition) - up * 32.0);

	color.xyz *= vec3(dot(normal, up));
	color.xyz += ts * pow(dot(normal, hv), 32.0);
	// color.xyz = vnormal.xyz;
	// color.xyz = abs(vnormal.xyz);
	// color.xyz = normal;

	// Fake lighting
	color *= max(0.0, mp.w * 1.2 - 0.2);

	gl_FragColor = vec4(color, 1.0);
	if (dataPass == true) {
		// vec3 ps = abs(pos);
		gl_FragColor.x = pos.x / 128.0 + 0.5;
		gl_FragColor.y = pos.z / 128.0 + 0.5;
		gl_FragColor.z = id;
	}
}
