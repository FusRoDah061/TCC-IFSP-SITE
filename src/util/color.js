export default class ColorUtils {
    /**
    Source: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
    Usage:
    Shade (Lighten or Darken)
    pSBC ( 0.42, color1 ); // rgb(20,60,200) + [42% Lighter] => rgb(166,171,225)
    pSBC ( -0.4, color5 ); // #F3A + [40% Darker] => #c62884
    pSBC ( 0.42, color8 ); // rgba(200,60,20,0.98631) + [42% Lighter] => rgba(225,171,166,0.98631)
    */
    static lightenDarkenColor(p, c0, c1, l) {
        let pSBCr = function (d) {
            let n = d.length,
                x = {};
            if (n > 9) {
                [r, g, b, a] = d = d.split(","), n = d.length;
                if (n < 3 || n > 4) return null;
                x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = parseInt(g), x.b = parseInt(b), x.a = a ? parseFloat(a) : -1
            } else {
                if (n == 8 || n == 6 || n < 4) return null;
                if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
                d = parseInt(d.slice(1), 16);
                if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = Math.round((d & 255) / 0.255) / 1000;
                else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
            }
            return x
        };

        let r, g, b, P, f, t, h, a = typeof (c1) == "string";
        if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;

        h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? {
            r: 0,
            g: 0,
            b: 0,
            a: -1
        } : {
                r: 255,
                g: 255,
                b: 255,
                a: -1
            }, p = P ? p * -1 : p, P = 1 - p;
        if (!f || !t) return null;
        if (l) r = Math.round(P * f.r + p * t.r), g = Math.round(P * f.g + p * t.g), b = Math.round(P * f.b + p * t.b);
        else r = Math.round((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = Math.round((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = Math.round((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
        a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
        if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + Math.round(a * 1000) / 1000 : "") + ")";
        else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? Math.round(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
    }

    /**
     * Source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {*} hex
     */
    static hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }

    static higherContrast(hexColor) {
        let rgb = this.hexToRgb(hexColor);
        let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

        if(brightness < 100)
            return '#f1f1f1';
        else
            return '#333';
    }
}
