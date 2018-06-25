precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform sampler2D tDA;
uniform sampler2D tHA;
uniform sampler2D tNA;
uniform sampler2D tSA;
uniform sampler2D tDB;
uniform sampler2D tHB;
uniform sampler2D tNB;
uniform sampler2D tSB;
uniform sampler2D tDC;
uniform sampler2D tHC;
uniform sampler2D tNC;
uniform sampler2D tSC;

uniform sampler2D tLight;

uniform sampler2D tHeight;
uniform vec2 mapres;

uniform bool dataPass;
uniform float id;

uniform float time;

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

vec3 light(vec2 uv, vec3 nv, vec3 ts, vec3 ev) {
	vec3 lout = vec3(0.0);
	vec3 spec = vec3(0.0);
	vec2 sdir = vec2(0.0);
	float aod = 0.0;
	float hc = texture2D(tHeight, uv).x;
	float r;
	for (float i = 0.0; i < 64.0; i += 1.0) {
		r = i / 8192.0;
		sdir = vec2(cos(i*2.3),sin(i*2.3));
		lout += texture2D(tLight, uv + sdir * r).xyz / (1.0 + i * 0.2);
		aod += hc - texture2D(tHeight, uv + sdir * r).x;
	}
	vec2 quot = ev.xz / (dot(nv, ev));
	spec += ts * ts * texture2D(tLight, uv - 0.015 * quot).xyz;
	spec += ts * ts * texture2D(tLight, uv - 0.02 * quot).xyz;
	spec += ts * ts * texture2D(tLight, uv - 0.025 * quot).xyz;
	spec += ts * ts * texture2D(tLight, uv - 0.03 * quot).xyz;
	return lout + spec + 0.33 + aod * 0.06;
}

void main() {
	if (dataPass == true) {
		// vec3 ps = abs(pos);
		gl_FragColor.x = pos.x / 128.0 + 0.5;
		gl_FragColor.y = pos.z / 128.0 + 0.5;
		gl_FragColor.z = id;
		gl_FragColor.w = 1.0;

		float hC = texture2D(tHeight, uv).x;
		float hD = 0.0;
		float r = 0.0;
		for (float i = 0.0; i < 24.0; i += 1.0) {
			r = i / 256.0;
			hD -= min(0.0, (hC - texture2D(tHeight, uv + vec2(cos(i*2.3), sin(i*2.3)) * r).x) * 2.0);
		}
		gl_FragColor.z = hD;
		return;
	}

	vec4 mp = hmapnormal(uv);
	vec3 mpd = texture2D(tHeight, uv).xyz;
	vec3 color = vec3(0.0, 0.0, 0.0);

	// Grid
	float grid = min(1.0, pow(mod(uv.x * 128.0, 1.0) * 2.0 - 1.0, 16.0) + pow(mod(uv.y * 128.0, 1.0) * 2.0 - 1.0, 16.0));

	vec2 suv = uv * vec2(16.0);
	float ha = texture2D(tHA, suv).x * 0.1;
	float hb = texture2D(tHB, suv).x * mpd.y;
	float hc = texture2D(tHC, suv).x * mpd.z;

	vec3 tn;
	vec3 ts;
	float low = hc;
	float diff;

	if (ha > hb) {
		if (hb > hc) { low = hb; }
		if (ha > hc) {
			color = texture2D(tDA, suv).xyz;
			tn = normalize(texture2D(tNA, suv).xyz * 2.0 - 1.0);
			ts = texture2D(tSA, suv).xyz;
			diff = ha - low;
		} else {
			color = texture2D(tDC, suv).xyz;
			tn = normalize(texture2D(tNC, suv).xyz * 2.0 - 1.0);
			ts = texture2D(tSC, suv).xyz;
			diff = low - ha;
		}
	} else {
		if (ha > hc) { low = ha; }
		if (hb > hc) {
			color = texture2D(tDB, suv).xyz;
			tn = normalize(texture2D(tNB, suv).xyz * 2.0 - 1.0);
			ts = texture2D(tSB, suv).xyz;
			diff = hb - low;
		} else {
			color = texture2D(tDC, suv).xyz;
			tn = normalize(texture2D(tNC, suv).xyz * 2.0 - 1.0);
			ts = texture2D(tSC, suv).xyz;
			diff = low - hb;
		}
	}

	vec3 normal = perturbNormal2Arb(cameraPosition - pos, vnormal.xyz, tn.xyz);
	normal = perturbNormal2Arb(cameraPosition - pos, normal, tn.xyz);
	vec3 albedo = color;
	vec3 viewVector = normalize(cameraPosition - pos);

	color = albedo * light(uv, normal, ts, viewVector);

	color.xyz = color.xyz * (1.0 - max(0.0, min(1.0, 0.1 * (1.0 / diff / 12.0))) * 0.33);

	// Depth fog.
	color *= max(0.0, mp.w * 1.2 - 0.2);

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor.x = 1.0;
}
