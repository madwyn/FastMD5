;md5 = window.md5 || (function(window) {
	var $0 = 0, // a
		$1 = 0, // b
		$2 = 0, // c
		$3 = 0, // d
		$4 = [], // res
		$5 = [], // tail
		$6 = [], // md5blks
		$7 = [128, 32768, 8388608, -2147483648], // c4
		$8 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], // c16
		$9 = [0, 8, 16, 24]; // cS

	function encode(s, sLen) {
		var utf = "", start = 0, end = 0;
		s += "";

		for(var i = 0;i < sLen;i++) {
			var c1 = s.charCodeAt(i);
			var enc = null;

			if(c1 < 128) {
				end++;
			}else if(c1 > 127 && c1 < 2048) {
				enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
			}else{
				enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
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

	function md51(s, sLen) {
		var state = false,
			N = sLen,
			i;

		if(sLen > 63) {
			for(i = 64;i <= sLen;i += 64) {
				if(i == 64) {
					md5blk(s.substring(0, 64));
					state = md5cycle($6[0], $6[1], $6[2], $6[3], $6[4], $6[5], $6[6], $6[7], $6[8], $6[9], $6[10], $6[11], $6[12], $6[13], $6[14], $6[15]);
				}else{
					md5blk(s.substring(i - 64, i));
					state = md5cycleAdd(state, $6);
				}
			}

			s = s.substring(i - 64);
			N = s.length;
		}

		for(i = 0;i < N;++i) {
			$5[i >> 2] |= s.charCodeAt(i) << $9[i % 4];
		}
		$5[i >> 2] |= $7[i % 4];

		if(i > 55) {
			state = md5cycleAdd(state, $5);

			var j = 16;
			while(j--) $5[j] = 0;
		}

		$5[14] = sLen * 8;

		return typeof state == "boolean" ? md5cycle($5[0], $5[1], $5[2], $5[3], $5[4], $5[5], $5[6], $5[7], $5[8], $5[9], $5[10], $5[11], $5[12], $5[13], $5[14], $5[15]) : md5cycleAdd(state, $5);
	}

	function md5blk(s) {
		$6[0]  =  s.charCodeAt(0) +  (s.charCodeAt(1) << 8) +  (s.charCodeAt(2) << 16) +  (s.charCodeAt(3) << 24);
		$6[1]  =  s.charCodeAt(4) +  (s.charCodeAt(5) << 8) +  (s.charCodeAt(6) << 16) +  (s.charCodeAt(7) << 24);
		$6[2]  =  s.charCodeAt(8) +  (s.charCodeAt(9) << 8) + (s.charCodeAt(10) << 16) + (s.charCodeAt(11) << 24);
		$6[3]  = s.charCodeAt(12) + (s.charCodeAt(13) << 8) + (s.charCodeAt(14) << 16) + (s.charCodeAt(15) << 24);
		$6[4]  = s.charCodeAt(16) + (s.charCodeAt(17) << 8) + (s.charCodeAt(18) << 16) + (s.charCodeAt(19) << 24);
		$6[5]  = s.charCodeAt(20) + (s.charCodeAt(21) << 8) + (s.charCodeAt(22) << 16) + (s.charCodeAt(23) << 24);
		$6[6]  = s.charCodeAt(24) + (s.charCodeAt(25) << 8) + (s.charCodeAt(26) << 16) + (s.charCodeAt(27) << 24);
		$6[7]  = s.charCodeAt(28) + (s.charCodeAt(29) << 8) + (s.charCodeAt(30) << 16) + (s.charCodeAt(31) << 24);
		$6[8]  = s.charCodeAt(32) + (s.charCodeAt(33) << 8) + (s.charCodeAt(34) << 16) + (s.charCodeAt(35) << 24);
		$6[9]  = s.charCodeAt(36) + (s.charCodeAt(37) << 8) + (s.charCodeAt(38) << 16) + (s.charCodeAt(39) << 24);
		$6[10] = s.charCodeAt(40) + (s.charCodeAt(41) << 8) + (s.charCodeAt(42) << 16) + (s.charCodeAt(43) << 24);
		$6[11] = s.charCodeAt(44) + (s.charCodeAt(45) << 8) + (s.charCodeAt(46) << 16) + (s.charCodeAt(47) << 24);
		$6[12] = s.charCodeAt(48) + (s.charCodeAt(49) << 8) + (s.charCodeAt(50) << 16) + (s.charCodeAt(51) << 24);
		$6[13] = s.charCodeAt(52) + (s.charCodeAt(53) << 8) + (s.charCodeAt(54) << 16) + (s.charCodeAt(55) << 24);
		$6[14] = s.charCodeAt(56) + (s.charCodeAt(57) << 8) + (s.charCodeAt(58) << 16) + (s.charCodeAt(59) << 24);
		$6[15] = s.charCodeAt(60) + (s.charCodeAt(61) << 8) + (s.charCodeAt(62) << 16) + (s.charCodeAt(63) << 24);
	}

	function md5_main(s, enc, arr) {
		var i = 16;
		while(i--) $5[i] = 0; // fill tail with nulls

		var sLen = s.length;
		if(enc) {
			s = encode(s, sLen);
			sLen = s.length;
		}
		s = md51(s, sLen);

		var tmp = s[0];$4[1] = $8[tmp & 15];
		tmp >>= 4;$4[0] = $8[tmp & 15];
		tmp >>= 4;$4[3] = $8[tmp & 15];
		tmp >>= 4;$4[2] = $8[tmp & 15];
		tmp >>= 4;$4[5] = $8[tmp & 15];
		tmp >>= 4;$4[4] = $8[tmp & 15];
		tmp >>= 4;$4[7] = $8[tmp & 15];
		tmp >>= 4;$4[6] = $8[tmp & 15];

		tmp = s[1];$4[9] = $8[tmp & 15];
		tmp >>= 4;$4[8] = $8[tmp & 15];
		tmp >>= 4;$4[11] = $8[tmp & 15];
		tmp >>= 4;$4[10] = $8[tmp & 15];
		tmp >>= 4;$4[13] = $8[tmp & 15];
		tmp >>= 4;$4[12] = $8[tmp & 15];
		tmp >>= 4;$4[15] = $8[tmp & 15];
		tmp >>= 4;$4[14] = $8[tmp & 15];

		tmp = s[2];$4[17] = $8[tmp & 15];
		tmp >>= 4;$4[16] = $8[tmp & 15];
		tmp >>= 4;$4[19] = $8[tmp & 15];
		tmp >>= 4;$4[18] = $8[tmp & 15];
		tmp >>= 4;$4[21] = $8[tmp & 15];
		tmp >>= 4;$4[20] = $8[tmp & 15];
		tmp >>= 4;$4[23] = $8[tmp & 15];
		tmp >>= 4;$4[22] = $8[tmp & 15];

		tmp = s[3];$4[25] = $8[tmp & 15];
		tmp >>= 4;$4[24] = $8[tmp & 15];
		tmp >>= 4;$4[27] = $8[tmp & 15];
		tmp >>= 4;$4[26] = $8[tmp & 15];
		tmp >>= 4;$4[29] = $8[tmp & 15];
		tmp >>= 4;$4[28] = $8[tmp & 15];
		tmp >>= 4;$4[31] = $8[tmp & 15];
		tmp >>= 4;$4[30] = $8[tmp & 15];

		return arr ? $4 : $4[0] + $4[1] + $4[2] + $4[3] + $4[4] + $4[5] + $4[6] + $4[7] + $4[8] + $4[9] + $4[10] + $4[11] + $4[12] + $4[13] + $4[14] + $4[15] + $4[16] + $4[17] + $4[18] + $4[19] + $4[20] + $4[21] + $4[22] + $4[23] + $4[24] + $4[25] + $4[26] + $4[27] + $4[28] + $4[29] + $4[30] + $4[31];
	}

	var md5_asmjs = (function(stdlib, env, heap) {
		"use asm";

		var TA = new stdlib.Int32Array(heap);

		function R(q, a, b, x, s1, s2, t) {
			q = q|0;
			a = a|0;
			b = b|0;
			x = x|0;
			s1 = s1|0;
			s2 = s2|0;
			t = t|0;

			a = (a + q + x + t)|0;
			return (((a << s1 | a >>> s2) + b) << 0)|0;
		}

		function md5cycle(k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15) {
			k0 = k0|0;
			k1 = k1|0;
			k2 = k2|0;
			k3 = k3|0;
			k4 = k4|0;
			k5 = k5|0;
			k6 = k6|0;
			k7 = k7|0;
			k8 = k8|0;
			k9 = k9|0;
			k10 = k10|0;
			k11 = k11|0;
			k12 = k12|0;
			k13 = k13|0;
			k14 = k14|0;
			k15 = k15|0;

			md5_rounds(1732584193, -271733879, -1732584194, 271733878, k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, 1);

			TA[0] = ((TA[0] + 1732584193) << 0)|0;
			TA[1] = ((TA[1] - 271733879) << 0)|0;
			TA[2] = ((TA[2] - 1732584194) << 0)|0;
			TA[3] = ((TA[3] + 271733878) << 0)|0;

			return TA;
		}

		function md5cycleAdd(x0, x1, x2, x3, k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15) {
			x0 = x0|0;
			x1 = x1|0;
			x2 = x2|0;
			x3 = x3|0;
			k0 = k0|0;
			k1 = k1|0;
			k2 = k2|0;
			k3 = k3|0;
			k4 = k4|0;
			k5 = k5|0;
			k6 = k6|0;
			k7 = k7|0;
			k8 = k8|0;
			k9 = k9|0;
			k10 = k10|0;
			k11 = k11|0;
			k12 = k12|0;
			k13 = k13|0;
			k14 = k14|0;
			k15 = k15|0;

			md5_rounds(x0, x1, x2, x3, k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, 0);

			TA[0] = ((TA[0] + x0) << 0)|0;
			TA[1] = ((TA[1] + x1) << 0)|0;
			TA[2] = ((TA[2] + x2) << 0)|0;
			TA[3] = ((TA[3] + x3) << 0)|0;

			return TA;
		}

		function md5_rounds(a, b, c, d, k0, k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, simple) {
			a = a|0;
			b = b|0;
			c = c|0;
			d = d|0;
			k0 = k0|0;
			k1 = k1|0;
			k2 = k2|0;
			k3 = k3|0;
			k4 = k4|0;
			k5 = k5|0;
			k6 = k6|0;
			k7 = k7|0;
			k8 = k8|0;
			k9 = k9|0;
			k10 = k10|0;
			k11 = k11|0;
			k12 = k12|0;
			k13 = k13|0;
			k14 = k14|0;
			k15 = k15|0;
			simple = simple|0;

			if(simple|0 == 1) {
				a = (k0 - 680876937)|0;
				a = (((a << 7 | a >>> 25) - 271733879) << 0)|0;
				d = (k1 - 117830708 + ((2004318071 & a) ^ -1732584194))|0;
				d = (((d << 12 | d >>> 20) + a) << 0)|0;
				c = (k2 - 1126478375 + (((a ^ -271733879) & d) ^ -271733879))|0;
				c = (((c << 17 | c >>> 15) + d) << 0)|0;
				b = (k3 - 1316259209 + (((d ^ a) & c) ^ a))|0;
				b = (((b << 22 | b >>> 10) + c) << 0)|0;
			}else{
				a = R(((c ^ d) & b) ^ d, a, b, k0, 7, 25, -680876936)|0;
				d = R(((b ^ c) & a) ^ c, d, a, k1, 12, 20, -389564586)|0;
				c = R(((a ^ b) & d) ^ b, c, d, k2, 17, 15, 606105819)|0;
				b = R(((d ^ a) & c) ^ a, b, c, k3, 22, 10, -1044525330)|0;
			}

			a = R(((c ^ d) & b) ^ d, a, b, k4, 7, 25, -176418897)|0;
			d = R(((b ^ c) & a) ^ c, d, a, k5, 12, 20, 1200080426)|0;
			c = R(((a ^ b) & d) ^ b, c, d, k6, 17, 15, -1473231341)|0;
			b = R(((d ^ a) & c) ^ a, b, c, k7, 22, 10, -45705983)|0;
			a = R(((c ^ d) & b) ^ d, a, b, k8, 7, 25, 1770035416)|0;
			d = R(((b ^ c) & a) ^ c, d, a, k9, 12, 20, -1958414417)|0;
			c = R(((a ^ b) & d) ^ b, c, d, k10, 17, 15, -42063)|0;
			b = R(((d ^ a) & c) ^ a, b, c, k11, 22, 10, -1990404162)|0;
			a = R(((c ^ d) & b) ^ d, a, b, k12, 7, 25, 1804603682)|0;
			d = R(((b ^ c) & a) ^ c, d, a, k13, 12, 20, -40341101)|0;
			c = R(((a ^ b) & d) ^ b, c, d, k14, 17, 15, -1502002290)|0;
			b = R(((d ^ a) & c) ^ a, b, c, k15, 22, 10, 1236535329)|0;

			a = R(((b ^ c) & d) ^ c, a, b, k1, 5, 27, -165796510)|0;
			d = R(((a ^ b) & c) ^ b, d, a, k6, 9, 23, -1069501632)|0;
			c = R(((d ^ a) & b) ^ a, c, d, k11, 14, 18, 643717713)|0;
			b = R(((c ^ d) & a) ^ d, b, c, k0, 20, 12, -373897302)|0;
			a = R(((b ^ c) & d) ^ c, a, b, k5, 5, 27, -701558691)|0;
			d = R(((a ^ b) & c) ^ b, d, a, k10, 9, 23, 38016083)|0;
			c = R(((d ^ a) & b) ^ a, c, d, k15, 14, 18, -660478335)|0;
			b = R(((c ^ d) & a) ^ d, b, c, k4, 20, 12, -405537848)|0;
			a = R(((b ^ c) & d) ^ c, a, b, k9, 5, 27, 568446438)|0;
			d = R(((a ^ b) & c) ^ b, d, a, k14, 9, 23, -1019803690)|0;
			c = R(((d ^ a) & b) ^ a, c, d, k3, 14, 18, -187363961)|0;
			b = R(((c ^ d) & a) ^ d, b, c, k8, 20, 12, 1163531501)|0;
			a = R(((b ^ c) & d) ^ c, a, b, k13, 5, 27, -1444681467)|0;
			d = R(((a ^ b) & c) ^ b, d, a, k2, 9, 23, -51403784)|0;
			c = R(((d ^ a) & b) ^ a, c, d, k7, 14, 18, 1735328473)|0;
			b = R(((c ^ d) & a) ^ d, b, c, k12, 20, 12, -1926607734)|0;

			a = R(b ^ c ^ d, a, b, k5, 4, 28, -378558)|0;
			d = R(a ^ b ^ c, d, a, k8, 11, 21, -2022574463)|0;
			c = R(d ^ a ^ b, c, d, k11, 16, 16, 1839030562)|0;
			b = R(c ^ d ^ a, b, c, k14, 23, 9, -35309556)|0;
			a = R(b ^ c ^ d, a, b, k1, 4, 28, -1530992060)|0;
			d = R(a ^ b ^ c, d, a, k4, 11, 21, 1272893353)|0;
			c = R(d ^ a ^ b, c, d, k7, 16, 16, -155497632)|0;
			b = R(c ^ d ^ a, b, c, k10, 23, 9, -1094730640)|0;
			a = R(b ^ c ^ d, a, b, k13, 4, 28, 681279174)|0;
			d = R(a ^ b ^ c, d, a, k0, 11, 21, -358537222)|0;
			c = R(d ^ a ^ b, c, d, k3, 16, 16, -722521979)|0;
			b = R(c ^ d ^ a, b, c, k6, 23, 9, 76029189)|0;
			a = R(b ^ c ^ d, a, b, k9, 4, 28, -640364487)|0;
			d = R(a ^ b ^ c, d, a, k12, 11, 21, -421815835)|0;
			c = R(d ^ a ^ b, c, d, k15, 16, 16, 530742520)|0;
			b = R(c ^ d ^ a, b, c, k2, 23, 9, -995338651)|0;

			a = R(c ^ (b | ~d), a, b, k0, 6, 26, -198630844)|0;
			d = R(b ^ (a | ~c), d, a, k7, 10, 22, 1126891415)|0;
			c = R(a ^ (d | ~b), c, d, k14, 15, 17, -1416354905)|0;
			b = R(d ^ (c | ~a), b, c, k5, 21, 11, -57434055)|0;
			a = R(c ^ (b | ~d), a, b, k12, 6, 26, 1700485571)|0;
			d = R(b ^ (a | ~c), d, a, k3, 10, 22, -1894986606)|0;
			c = R(a ^ (d | ~b), c, d, k10, 15, 17, -1051523)|0;
			b = R(d ^ (c | ~a), b, c, k1, 21, 11, -2054922799)|0;
			a = R(c ^ (b | ~d), a, b, k8, 6, 26, 1873313359)|0;
			d = R(b ^ (a | ~c), d, a, k15, 10, 22, -30611744)|0;
			c = R(a ^ (d | ~b), c, d, k6, 15, 17, -1560198380)|0;
			b = R(d ^ (c | ~a), b, c, k13, 21, 11, 1309151649)|0;
			a = R(c ^ (b | ~d), a, b, k4, 6, 26, -145523070)|0;
			d = R(b ^ (a | ~c), d, a, k11, 10, 22, -1120210379)|0;
			c = R(a ^ (d | ~b), c, d, k2, 15, 17, 718787259)|0;
			b = R(d ^ (c | ~a), b, c, k9, 21, 11, -343485551)|0;

			TA[0] = a|0;
			TA[1] = b|0;
			TA[2] = c|0;
			TA[3] = d|0;

			return TA;
		}

		return {
			md5cycle: md5cycle,
			md5cycleAdd: md5cycleAdd
		};
	})(window, null, new ArrayBuffer(4096));

	var md5cycle = md5_asmjs.md5cycle;
	var md5cycleAdd = md5_asmjs.md5cycleAdd;

	return md5_main;
})(window);
