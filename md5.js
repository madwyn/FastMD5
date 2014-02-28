md5 = window.md5 || (function() {
	var T = [ // threads
		{
			res: [],
			state: [],
			tail: [],
			md5blks: []
		}
	],
	
	// constants
	c4 = [128, 32768, 8388608, -2147483648];
	c16 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	cS = [0, 8, 16, 24];

	// rotate
	function R(q, a, b, x, s1, s2, t) {
		a += q + x + t;

		return ((a << s1 | a >>> s2) + b) << 0;
	}

	function md5_rounds(a, b, c, d, k, simple) {
		if(simple) {
			a = k[0] - 680876937;
			a = ((a << 7 | a >>> 25) - 271733879) << 0;
			d = k[1] - 117830708 + ((2004318071 & a) ^ -1732584194);
			d = ((d << 12 | d >>> 20) + a) << 0;
			c = k[2] - 1126478375 + (((a ^ -271733879) & d) ^ -271733879);
			c = ((c << 17 | c >>> 15) + d) << 0;
			b = k[3] - 1316259209 + (((d ^ a) & c) ^ a);
			b = ((b << 22 | b >>> 10) + c) << 0;
		}else{
			a = R(((c ^ d) & b) ^ d, a, b, k[0], 7, 25, -680876936);
			d = R(((b ^ c) & a) ^ c, d, a, k[1], 12, 20, -389564586);
			c = R(((a ^ b) & d) ^ b, c, d, k[2], 17, 15, 606105819);
			b = R(((d ^ a) & c) ^ a, b, c, k[3], 22, 10, -1044525330);
		}

		a = R(((c ^ d) & b) ^ d, a, b, k[4], 7, 25, -176418897);
		d = R(((b ^ c) & a) ^ c, d, a, k[5], 12, 20, 1200080426);
		c = R(((a ^ b) & d) ^ b, c, d, k[6], 17, 15, -1473231341);
		b = R(((d ^ a) & c) ^ a, b, c, k[7], 22, 10, -45705983);
		a = R(((c ^ d) & b) ^ d, a, b, k[8], 7, 25, 1770035416);
		d = R(((b ^ c) & a) ^ c, d, a, k[9], 12, 20, -1958414417);
		c = R(((a ^ b) & d) ^ b, c, d, k[10], 17, 15, -42063);
		b = R(((d ^ a) & c) ^ a, b, c, k[11], 22, 10, -1990404162);
		a = R(((c ^ d) & b) ^ d, a, b, k[12], 7, 25, 1804603682);
		d = R(((b ^ c) & a) ^ c, d, a, k[13], 12, 20, -40341101);
		c = R(((a ^ b) & d) ^ b, c, d, k[14], 17, 15, -1502002290);
		b = R(((d ^ a) & c) ^ a, b, c, k[15], 22, 10, 1236535329);

		a = R(((b ^ c) & d) ^ c, a, b, k[1], 5, 27, -165796510);
		d = R(((a ^ b) & c) ^ b, d, a, k[6], 9, 23, -1069501632);
		c = R(((d ^ a) & b) ^ a, c, d, k[11], 14, 18, 643717713);
		b = R(((c ^ d) & a) ^ d, b, c, k[0], 20, 12, -373897302);
		a = R(((b ^ c) & d) ^ c, a, b, k[5], 5, 27, -701558691);
		d = R(((a ^ b) & c) ^ b, d, a, k[10], 9, 23, 38016083);
		c = R(((d ^ a) & b) ^ a, c, d, k[15], 14, 18, -660478335);
		b = R(((c ^ d) & a) ^ d, b, c, k[4], 20, 12, -405537848);
		a = R(((b ^ c) & d) ^ c, a, b, k[9], 5, 27, 568446438);
		d = R(((a ^ b) & c) ^ b, d, a, k[14], 9, 23, -1019803690);
		c = R(((d ^ a) & b) ^ a, c, d, k[3], 14, 18, -187363961);
		b = R(((c ^ d) & a) ^ d, b, c, k[8], 20, 12, 1163531501);
		a = R(((b ^ c) & d) ^ c, a, b, k[13], 5, 27, -1444681467);
		d = R(((a ^ b) & c) ^ b, d, a, k[2], 9, 23, -51403784);
		c = R(((d ^ a) & b) ^ a, c, d, k[7], 14, 18, 1735328473);
		b = R(((c ^ d) & a) ^ d, b, c, k[12], 20, 12, -1926607734);

		a = R(b ^ c ^ d, a, b, k[5], 4, 28, -378558);
		d = R(a ^ b ^ c, d, a, k[8], 11, 21, -2022574463);
		c = R(d ^ a ^ b, c, d, k[11], 16, 16, 1839030562);
		b = R(c ^ d ^ a, b, c, k[14], 23, 9, -35309556);
		a = R(b ^ c ^ d, a, b, k[1], 4, 28, -1530992060);
		d = R(a ^ b ^ c, d, a, k[4], 11, 21, 1272893353);
		c = R(d ^ a ^ b, c, d, k[7], 16, 16, -155497632);
		b = R(c ^ d ^ a, b, c, k[10], 23, 9, -1094730640);
		a = R(b ^ c ^ d, a, b, k[13], 4, 28, 681279174);
		d = R(a ^ b ^ c, d, a, k[0], 11, 21, -358537222);
		c = R(d ^ a ^ b, c, d, k[3], 16, 16, -722521979);
		b = R(c ^ d ^ a, b, c, k[6], 23, 9, 76029189);
		a = R(b ^ c ^ d, a, b, k[9], 4, 28, -640364487);
		d = R(a ^ b ^ c, d, a, k[12], 11, 21, -421815835);
		c = R(d ^ a ^ b, c, d, k[15], 16, 16, 530742520);
		b = R(c ^ d ^ a, b, c, k[2], 23, 9, -995338651);

		a = R(c ^ (b | ~d), a, b, k[0], 6, 26, -198630844);
		d = R(b ^ (a | ~c), d, a, k[7], 10, 22, 1126891415);
		c = R(a ^ (d | ~b), c, d, k[14], 15, 17, -1416354905);
		b = R(d ^ (c | ~a), b, c, k[5], 21, 11, -57434055);
		a = R(c ^ (b | ~d), a, b, k[12], 6, 26, 1700485571);
		d = R(b ^ (a | ~c), d, a, k[3], 10, 22, -1894986606);
		c = R(a ^ (d | ~b), c, d, k[10], 15, 17, -1051523);
		b = R(d ^ (c | ~a), b, c, k[1], 21, 11, -2054922799);
		a = R(c ^ (b | ~d), a, b, k[8], 6, 26, 1873313359);
		d = R(b ^ (a | ~c), d, a, k[15], 10, 22, -30611744);
		c = R(a ^ (d | ~b), c, d, k[6], 15, 17, -1560198380);
		b = R(d ^ (c | ~a), b, c, k[13], 21, 11, 1309151649);
		a = R(c ^ (b | ~d), a, b, k[4], 6, 26, -145523070);
		d = R(b ^ (a | ~c), d, a, k[11], 10, 22, -1120210379);
		c = R(a ^ (d | ~b), c, d, k[2], 15, 17, 718787259);
		b = R(d ^ (c | ~a), b, c, k[9], 21, 11, -343485551);

		return [a, b, c, d];
	}

	function md5cycle(k, sw, t) {
		var r = md5_rounds(1732584193, -271733879, -1732584194, 271733878, k, true);

		if(!sw) {
			return [
				(r[0] + 1732584193) << 0,
				(r[1] - 271733879) << 0,
				(r[2] - 1732584194) << 0,
				(r[3] + 271733878) << 0
			];
		}
		
		T[t].state[0] = (r[0] + 1732584193) << 0;
		T[t].state[1] = (r[1] - 271733879) << 0;
		T[t].state[2] = (r[2] - 1732584194) << 0;
		T[t].state[3] = (r[3] + 271733878) << 0;
	}

	function md5cycleAdd(x, k, sw, t) {
		var r = md5_rounds(x[0], x[1], x[2], x[3], k, false);

		if(!sw) {
			return [
				(r[0] + x[0]) << 0,
				(r[1] + x[1]) << 0,
				(r[2] + x[2]) << 0,
				(r[3] + x[3]) << 0
			];
		}

		T[t].state[0] = (r[0] + x[0]) << 0;
		T[t].state[1] = (r[1] + x[1]) << 0;
		T[t].state[2] = (r[2] + x[2]) << 0;
		T[t].state[3] = (r[3] + x[3]) << 0;
	}

	function md5blk(s, t) {
		T[t].md5blks[0]  =  s.charCodeAt(0) +  (s.charCodeAt(1) << 8) +  (s.charCodeAt(2) << 16) +  (s.charCodeAt(3) << 24);
		T[t].md5blks[1]  =  s.charCodeAt(4) +  (s.charCodeAt(5) << 8) +  (s.charCodeAt(6) << 16) +  (s.charCodeAt(7) << 24);
		T[t].md5blks[2]  =  s.charCodeAt(8) +  (s.charCodeAt(9) << 8) + (s.charCodeAt(10) << 16) + (s.charCodeAt(11) << 24);
		T[t].md5blks[3]  = s.charCodeAt(12) + (s.charCodeAt(13) << 8) + (s.charCodeAt(14) << 16) + (s.charCodeAt(15) << 24);
		T[t].md5blks[4]  = s.charCodeAt(16) + (s.charCodeAt(17) << 8) + (s.charCodeAt(18) << 16) + (s.charCodeAt(19) << 24);
		T[t].md5blks[5]  = s.charCodeAt(20) + (s.charCodeAt(21) << 8) + (s.charCodeAt(22) << 16) + (s.charCodeAt(23) << 24);
		T[t].md5blks[6]  = s.charCodeAt(24) + (s.charCodeAt(25) << 8) + (s.charCodeAt(26) << 16) + (s.charCodeAt(27) << 24);
		T[t].md5blks[7]  = s.charCodeAt(28) + (s.charCodeAt(29) << 8) + (s.charCodeAt(30) << 16) + (s.charCodeAt(31) << 24);
		T[t].md5blks[8]  = s.charCodeAt(32) + (s.charCodeAt(33) << 8) + (s.charCodeAt(34) << 16) + (s.charCodeAt(35) << 24);
		T[t].md5blks[9]  = s.charCodeAt(36) + (s.charCodeAt(37) << 8) + (s.charCodeAt(38) << 16) + (s.charCodeAt(39) << 24);
		T[t].md5blks[10] = s.charCodeAt(40) + (s.charCodeAt(41) << 8) + (s.charCodeAt(42) << 16) + (s.charCodeAt(43) << 24);
		T[t].md5blks[11] = s.charCodeAt(44) + (s.charCodeAt(45) << 8) + (s.charCodeAt(46) << 16) + (s.charCodeAt(47) << 24);
		T[t].md5blks[12] = s.charCodeAt(48) + (s.charCodeAt(49) << 8) + (s.charCodeAt(50) << 16) + (s.charCodeAt(51) << 24);
		T[t].md5blks[13] = s.charCodeAt(52) + (s.charCodeAt(53) << 8) + (s.charCodeAt(54) << 16) + (s.charCodeAt(55) << 24);
		T[t].md5blks[14] = s.charCodeAt(56) + (s.charCodeAt(57) << 8) + (s.charCodeAt(58) << 16) + (s.charCodeAt(59) << 24);
		T[t].md5blks[15] = s.charCodeAt(60) + (s.charCodeAt(61) << 8) + (s.charCodeAt(62) << 16) + (s.charCodeAt(63) << 24);
	}

	function md51(s, t) {
		var i, n = s.length, sl = n;

		if(n > 63) {
			for(i = 64;i <= n;i += 64) {
				md5blk(s.substring(i - 64, i), t);

				if(i == 64) {
					md5cycle(T[t].md5blks, true, t);
				}else{
					md5cycleAdd(T[t].state, T[t].md5blks, true, t);
				}
			}

			s = s.substring(i - 64);
			sl = s.length;
		}

		for(i = 0;i < sl;i++) {
			T[t].tail[i >> 2] |= s.charCodeAt(i) << cS[i % 4];
		}
		T[t].tail[i >> 2] |= c4[i % 4];

		if(i > 55) {
			md5cycleAdd(T[t].state, T[t].tail, true, t);

			T[t].tail[0] = 0;
			T[t].tail[1] = 0;
			T[t].tail[2] = 0;
			T[t].tail[3] = 0;
			T[t].tail[4] = 0;
			T[t].tail[5] = 0;
			T[t].tail[6] = 0;
			T[t].tail[7] = 0;
			T[t].tail[8] = 0;
			T[t].tail[9] = 0;
			T[t].tail[10] = 0;
			T[t].tail[11] = 0;
			T[t].tail[12] = 0;
			T[t].tail[13] = 0;
			T[t].tail[15] = 0;
		}

		T[t].tail[14] = n * 8;

		return T[t].state[0] == 0 ? md5cycle(T[t].tail, false, t) : md5cycleAdd(T[t].state, T[t].tail, false, t);
	}

	function encode(s) {
		var c, enc, i = 0, utf = "", start = 0, end = 0, sLen = s.length;

		for(;i < sLen;i++) {
			c = s.charCodeAt(i);
			enc = null;

			if(c < 128) {
				end++;
			}else if(c > 127 && c < 2048) {
				enc = String.fromCharCode((c >> 6) | 192, (c & 63) | 128);
			}else{
				enc = String.fromCharCode((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128);
			}
			if(enc !== null) {
				if(end > start) {
					utf += s.slice(start, end);
				}
				utf += enc;
				start = end = i + 1;
			}
		}

		if(end > start) {
			utf += s.slice(start, sLen);
		}

		return utf;
	}

	return function(s, enc, arr, t) {
		var r, tmp;

		T[t].tail[0] = 0;
		T[t].tail[1] = 0;
		T[t].tail[2] = 0;
		T[t].tail[3] = 0;
		T[t].tail[4] = 0;
		T[t].tail[5] = 0;
		T[t].tail[6] = 0;
		T[t].tail[7] = 0;
		T[t].tail[8] = 0;
		T[t].tail[9] = 0;
		T[t].tail[10] = 0;
		T[t].tail[11] = 0;
		T[t].tail[12] = 0;
		T[t].tail[13] = 0;
		T[t].tail[14] = 0;
		T[t].tail[15] = 0;

		T[t].state[0] = 0;

		r = enc ? md51(encode(s), t) : md51(s, t);

		tmp = r[0];T[t].res[1] = c16[tmp & 15];
		tmp >>= 4;T[t].res[0] = c16[tmp & 15];
		tmp >>= 4;T[t].res[3] = c16[tmp & 15];
		tmp >>= 4;T[t].res[2] = c16[tmp & 15];
		tmp >>= 4;T[t].res[5] = c16[tmp & 15];
		tmp >>= 4;T[t].res[4] = c16[tmp & 15];
		tmp >>= 4;T[t].res[7] = c16[tmp & 15];
		tmp >>= 4;T[t].res[6] = c16[tmp & 15];

		tmp = r[1];T[t].res[9] = c16[tmp & 15];
		tmp >>= 4;T[t].res[8] = c16[tmp & 15];
		tmp >>= 4;T[t].res[11] = c16[tmp & 15];
		tmp >>= 4;T[t].res[10] = c16[tmp & 15];
		tmp >>= 4;T[t].res[13] = c16[tmp & 15];
		tmp >>= 4;T[t].res[12] = c16[tmp & 15];
		tmp >>= 4;T[t].res[15] = c16[tmp & 15];
		tmp >>= 4;T[t].res[14] = c16[tmp & 15];

		tmp = r[2];T[t].res[17] = c16[tmp & 15];
		tmp >>= 4;T[t].res[16] = c16[tmp & 15];
		tmp >>= 4;T[t].res[19] = c16[tmp & 15];
		tmp >>= 4;T[t].res[18] = c16[tmp & 15];
		tmp >>= 4;T[t].res[21] = c16[tmp & 15];
		tmp >>= 4;T[t].res[20] = c16[tmp & 15];
		tmp >>= 4;T[t].res[23] = c16[tmp & 15];
		tmp >>= 4;T[t].res[22] = c16[tmp & 15];

		tmp = r[3];T[t].res[25] = c16[tmp & 15];
		tmp >>= 4;T[t].res[24] = c16[tmp & 15];
		tmp >>= 4;T[t].res[27] = c16[tmp & 15];
		tmp >>= 4;T[t].res[26] = c16[tmp & 15];
		tmp >>= 4;T[t].res[29] = c16[tmp & 15];
		tmp >>= 4;T[t].res[28] = c16[tmp & 15];
		tmp >>= 4;T[t].res[31] = c16[tmp & 15];
		tmp >>= 4;T[t].res[30] = c16[tmp & 15];

		return arr ? T[t].res : T[t].res[0] + T[t].res[1] + T[t].res[2] + T[t].res[3] + T[t].res[4] + T[t].res[5] + T[t].res[6] + T[t].res[7] + T[t].res[8] + T[t].res[9] + T[t].res[10] + T[t].res[11] + T[t].res[12] + T[t].res[13] + T[t].res[14] + T[t].res[15] + T[t].res[16] + T[t].res[17] + T[t].res[18] + T[t].res[19] + T[t].res[20] + T[t].res[21] + T[t].res[22] + T[t].res[23] + T[t].res[24] + T[t].res[25] + T[t].res[26] + T[t].res[27] + T[t].res[28] + T[t].res[29] + T[t].res[30] + T[t].res[31];
	};
})();
