function gen() {
    let key = document.getElementById("key").value;
    let pass = document.getElementById("pass").value;
    let out64 = document.getElementById("output64");
    let result = null;

    // ignore short, shitty passwords
    if (pass.length < 8 || key.length == 0) {
        out64.value = "master pass too short";
        document.getElementById("pass").focus();
    } else {
		// copy paste > loops
		document.getElementById("output64").value = b64_sha256(key + pass).substr(0, 64);
        document.getElementById("output32").value = b64_sha256(key + pass).substr(0, 32);
		document.getElementById("output24").value = b64_sha256(key + pass).substr(0, 24);
		document.getElementById("output16").value = b64_sha256(key + pass).substr(0, 16);
		
        out64.focus();
    }
}

window.onbeforeunload = function () { };

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet, It's Never Lurgi
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
 */

/*
 * Configurable variables.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * sha functions
 * They take string arguments and return either hex or base-64 encoded strings
 */
function b64_sha256(s) { return rstr2b64(rstr_sha256(str2rstr_utf8(s))); }

/*
 * Calculate the sha256 of a raw string
 */
function rstr_sha256(s) {
    return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
}

/*
 * Convert a raw string to a modified base-64 string (Chars 62+63 are non-standard)
 */
function rstr2b64(input) {
    try { b64pad; } catch (e) { b64pad = ''; }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789Ea";
    var output = "";
    var len = input.length;
    for (var i = 0; i < len; i += 3) {
        var triplet = (input.charCodeAt(i) << 16)
            | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
            | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
        }
    }
    return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;

    while (++i < input.length) {
        /* Decode utf-16 surrogate pairs */
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }

        /* Encode output as utf-8 */
        if (x <= 0x7F)
            output += String.fromCharCode(x);
        else if (x <= 0x7FF)
            output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                0x80 | ((x >>> 6) & 0x3F),
                0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                0x80 | ((x >>> 12) & 0x3F),
                0x80 | ((x >>> 6) & 0x3F),
                0x80 | (x & 0x3F));
    }
    return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++)
        output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    return output;
}

/*
 * Main sha256 function, with its support functions
 */
function sha256_S(X, n) { return (X >>> n) | (X << (32 - n)); }
function sha256_R(X, n) { return (X >>> n); }
function sha256_Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
function sha256_Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
function sha256_Sigma0256(x) { return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22)); }
function sha256_Sigma1256(x) { return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25)); }
function sha256_Gamma0256(x) { return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3)); }
function sha256_Gamma1256(x) { return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10)); }
function sha256_Sigma0512(x) { return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39)); }
function sha256_Sigma1512(x) { return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41)); }
function sha256_Gamma0512(x) { return (sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7)); }
function sha256_Gamma1512(x) { return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6)); }

var sha256_K = new Array
    (
        1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
        -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
        1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
        264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
        -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
        113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
        1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
        -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
        1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
        -1866530822, -1538233109, -1090935817, -965641998
    );

function binb_sha256(m, l) {
    var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
        1359893119, -1694144372, 528734635, 1541459225);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var i, j, T1, T2;

    /* append padding */
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];

        for (j = 0; j < 64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                sha256_Gamma0256(W[j - 15])), W[j - 16]);

            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                sha256_K[j]), W[j]);
            T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }

        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
}

function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}