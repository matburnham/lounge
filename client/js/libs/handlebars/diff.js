"use strict";

var diff;

Handlebars.registerHelper(
	"diff", function(a, opt) {
		if (a !== diff) {
			diff = a;
			return opt.fn(this);
		}

		return opt.inverse(this);
	}
);
