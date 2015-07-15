SQLike = {
	q: function (obj) {

		// Copyright: Thomas Frank 2010, v 1.021 (MIT style license, see EULA)

		// variables
		var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, obj2, d2, toSort, sortParas, ohaving, ot, coMax, co, labels,
			xLen, whereIndexes, distinct, distinctHash, ags, fieldCo, lastProp, distinctKey, pname, pname2, theVal, ag_type,
			agsCo, uu, orgD, o2, o3, intoAr, owhere, ewhere, setop, t1, t2, t1name, t2name, func, fh, tc, f2, lex, setopFuncHolder, joinFuncHolder;

		// The strange "funcHolder" vars fixes eluding AS2-bug where a function defined in a if clause is not readily available...
		// (could have been rewritten with var x = function, but this wouldn't have worked in AS3)

		// handle multiple commands/inparameters
		if (arguments.length > 1) {
			a = arguments, r = uu;
			for (i = 0; i < a.length; i++) {
				r = arguments.callee(a[i])
			};
			return r
		};

		// o - new object with all the props in uppercase, without underscore
		o = {};
		for (i in obj) { o[i.toUpperCase().split("_").join("")] = obj[i] };

		// check that we have ONE basic query type
		if (o.DELETE && o.FROM) { o.DELETEFROM = o.FROM };
		setop = !!o.UNIONDISTINCT + !!o.UNION + !!o.UNIONALL + !!o.INTERSECTDISTINCT + !!o.INTERSECT +
			   !!o.INTERSECTALL + !!o.MINUS + !!o.EXCEPTDISTINCT + !!o.EXCEPT + !!o.EXCEPTALL;
		if (setop + !!o.SELECT + !!o.SELECTDISTINCT + !!o.INSERTINTO + !!o.UPDATE + !!o.DELETEFROM + !!o.UNPACK + !!o.PACK != 1) { return [] }
		else if (o.TESTSUB) { return "issub" };

		// d - our data provider (an array of objects)
		d = (o.SELECT || o.SELECTDISTINCT) ? o.FROM : o.INSERTINTO || o.UPDATE || o.DELETEFROM || o.PACK || o.UNPACK, orgD = d;

		// test if d is a subquery and if so perform it
		if (d && typeof d == "object" && !d.push) {
			o2 = { TESTSUB: true };
			for (i in d) { o2[i] = d[i] };
			if (arguments.callee(o2) == "issub") { d = arguments.callee(d) }
		};

		// LIMIT
		if (o.LIMIT) {
			x = o.LIMIT;
			o.LIMIT = uu;
			return arguments.callee(o).slice(0, x)
		};

		// INTO
		if (o.INTO && o.INTO.push) {
			intoAr = o.INTO;
			o.INTO = uu;
			intoAr.splice.apply(intoAr, [intoAr.length, 0].concat(arguments.callee(o)));
			return intoAr
		};

		// INSERT INTO
		if (o.INSERTINTO) {
			d.push(o.VALUES);
			return d
		};

		// UNION, INTERSECT, EXCEPT, MINUS (set operations)
		if (setop) {
			setopFuncHolder = {
				f: function (o, a) {
					var x = [], All, Type, dr = [], f = {}, f2 = {}, h = {}, k, o, hkey, hash = {}, testHash, testHashCo, mfd = [],
					d = o.UNIONDISTINCT || o.UNION || o.UNIONALL || o.INTERSECTDISTINCT || o.INTERSECT ||
					o.INTERSECTALL || o.MINUS || o.EXCEPTDISTINCT || o.EXCEPT || o.EXCEPTALL, lex = d.length;
					// determine query type 
					for (var z in o) {
						if (o[z] === d) {
							var j = z.toUpperCase();
							All = j.split("ALL").length > 1;
							Type = j.split("UNION").length > 1 ? 1 : j.split("INTERSECT").length > 1 ? 2 : 3;
							if (j == "MINUS") { Type = 3; All = false }
						}
					};
					// perform subqueries
					for (var i = 0; i < d.length; i++) { dr.push(a(d[i])) };
					// determine shared fieldnames
					for (i = 0; i < lex; i++) { for (j in dr[i][0]) { if (!f[j]) { f[j] = 0 }; f[j]++ } };
					for (i in f) { if (f[i] == lex) { f2[i] = true } };
					// concatenate tables and build hash info
					for (i = 0; i < lex; i++) {
						for (j = 0; j < dr[i].length; j++) {
							o = {}, hkey = [];
							for (k in f2) { o[k] = dr[i][j][k]; hkey.push(dr[i][j][k]) };
							hkey = hkey.join("|||");
							x.push(o);
							if (!hash[hkey]) { hash[hkey] = [] };
							hash[hkey].push({ indexNo: x.length - 1, tableNo: 't' + i })
						}
					};
					// just return if UNIONALL
					if (Type == 1 && All) { return x };
					// mark tuples for deletion depending on query type
					for (i in hash) {
						testHash = {}, testHashCo = 0;
						for (j = 0; j < hash[i].length; j++) { testHash[hash[i][j].tableNo] = true };
						for (j in testHash) { testHashCo++ };
						for (j = 0; j < hash[i].length; j++) {
							if (
							   (Type == 2 && testHashCo != lex) ||
							   (Type == 3 && (testHashCo != 1 || testHash.t1)) ||
							   (!All && j > 0)
							) {
								mfd[hash[i][j].indexNo] = true
							}
						}
					};
					// delete tuples
					for (i = x.length - 1; i >= 0; i--) {
						if (mfd[i]) { x.splice(i, 1) }
					};
					return x
				}
			};
			return setopFuncHolder.f(o, arguments.callee)
		};

		// UNPACK - from array of arrays to array of objects
		if (o.UNPACK) {
			c = o.COLUMNS
			if (!c) { return false };
			for (i = 0; i < d.length; i++) {
				o = {};
				for (j = 0; j < c.length; j++) {
					o[c[j]] = d[i][j];
				};
				d[i] = o;
			};
			return d
		};

		// PACK - from array of objects to array of arrays
		if (o.PACK) {
			if (!o.COLUMNS) {
				o.COLUMNS = [];
				for (i in d[0]) { o.COLUMNS.push(i) }
			};
			c = o.COLUMNS;
			for (i = 0; i < d.length; i++) {
				a = [];
				for (j = 0; j < c.length; j++) {
					a[j] = d[i][c[j]];
				};
				d[i] = a;
			};
			return d
		};

		// ORDER BY
		if (o.ORDERBY && !o.ORDERBY.prep) {
			o.ORDERBY.prep = true;
			x = arguments.callee(o), toSort = [];
			if (o.GROUPBY) { x = [x, x] };
			// build toSort from selected x[0] and unselected x[1] fields
			for (i = 0; i < x[0].length; i++) {
				a = {}, co = 0;
				for (j in x[0][i]) { co++; a[j] = x[0][i][j] };
				for (j in x[1][i]) {
					co++
					if (a[j] === uu) { a[j] = x[1][i][j] }
				};
				a.__sqLikeSelectedData = x[0][i];
				toSort.push(a)
			};
			// check asc/desc
			sortParas = { a: [], d: [] }, a = o.ORDERBY || [], f;
			x = sortParas;
			for (i = 0; i < a.length; i++) {
				if (a[i] == "|desc|" || a[i] == "|asc|") { continue };
				x.d.push(a[i + 1] == "|desc|" ? -1 : 1)
				x.a.push(a[i])
			};
			// sort
			toSort.sort(function (x, y) {
				a = sortParas.a;
				d = sortParas.d;
				r = 0;
				for (i = 0; i < a.length; i++) {
					if (typeof x + typeof y != "objectobject") { return typeof x == "object" ? -1 : 1 };
					m, n;
					if (typeof a[i] == "function") {
						m = a[i].apply(x);
						n = a[i].apply(y)
					}
					else {
						m = x[a[i]]; n = y[a[i]]
					};
					if ((m === true || m === false) && (n === true || n === false)) { m *= -1; n *= -1 };
					r = m - n;
					if (isNaN(r)) { r = m > n ? 1 : m < n ? -1 : 0 };
					if (r != 0) { return r * d[i] }
				};
				return r
			});
			// retrieve selected fields
			r = [];
			for (i = 0; i < toSort.length; i++) {
				r.push(toSort[i].__sqLikeSelectedData)
			};
			return r
		};

		// HAVING
		if (o.HAVING) {
			ohaving = o.HAVING;
			o.HAVING = uu;
			x = arguments.callee(o);
			r = arguments.callee(
				{
					SELECT: ['*'],
					FROM: x,
					WHERE: ohaving
				}
			);
			return r
		};

		// GROUP BY
		if (o.GROUPBY) {
			t = [], q = {
				SELECTDISTINCT: o.GROUPBY,
				FROM: o.FROM,
				WHERE: o.WHERE
			};
			g = arguments.callee(q);
			for (i = 0; i < g.length; i++) {
				q = {};
				for (j in o) { q[j] = o[j] };
				q.GROUPBY = q.ORDERBY = uu;
				owhere = o.WHERE || function () { return true };
				ewhere = g[i];
				q.WHERE = function () {
					var x = owhere.apply(this);
					for (var i in ewhere) {
						x = x && this[i] == ewhere[i]
					};
					return x
				};
				t.push(arguments.callee(q)[0])
			};
			return t
		};

		// JOIN - convert all types of joins to where clauses + outer flags
		o.JOIN = o.JOIN || o.INNERJOIN || o.NATURALJOIN || o.CROSSJOIN || o.LEFTOUTERJOIN || o.RIGHTOUTERJOIN ||
		o.LEFTJOIN || o.RIGHTJOIN || o.FULLOUTERJOIN || o.OUTERJOIN || o.FULLJOIN;
		if (o.NATURALJOIN || o.USING) {

			// optimize by building a hash for equijoin thereby omitting loops in the on clause for 2-3 table joins
			// ugly code block but saves som milliseconds, before this "naturaljoin" and "join using"
			// were really slow, now they're almost on par with other types of joins

			for (j in o.JOIN) { if (!d[j]) { d[j] = o.JOIN[j] } };
			f = {}, f2 = [], lex = 0;
			for (i in d) { lex++; for (j in d[i][0]) { if (!f[j]) { f[j] = 0 }; f[j]++ } };
			for (i in f) { if (f[i] == lex) { f2.push(i) } };
			o.USING = o.USING || f2, b = {};
			for (i = 0; i < o.USING.length; i++) { b[o.USING[i]] = true };
			for (i in d) {
				x = d[i];
				d[i] = [];
				for (k = 0; k < x.length; k++) {
					o2 = {}, h = [];
					for (j in x[k]) { o2[j] = x[k][j] };
					for (j = 0; j < o.USING.length; j++) { h.push(x[k][o.USING[j]]) };
					o2.__SQLikeHash__ = h.join('|');
					d[i][k] = o2
				}
			};
			o.ON = function () {
				var a = arguments.callee;
				if (a.LEN == 2) {
					return this[a.TABLELABEL[0]].__SQLikeHash__ ==
							this[a.TABLELABEL[1]].__SQLikeHash__ ? a.USINGOBJ : false
				};
				if (a.LEN == 3) {
					return this[a.TABLELABEL[0]].__SQLikeHash__ ==
							this[a.TABLELABEL[1]].__SQLikeHash__ &&
							this[a.TABLELABEL[0]].__SQLikeHash__ ==
							this[a.TABLELABEL[2]].__SQLikeHash__ ? a.USINGOBJ : false
				};
				var x = this[a.TABLELABEL[0]].__SQLikeHash__
				for (var i in this) { if (this[i].__SQLikeHash__ != x) { return false } };
				return a.USINGOBJ
			};
			o.ON.TABLELABEL = [];
			for (i in d) { o.ON.TABLELABEL.push(i) };
			o.ON.USINGOBJ = b;
			o.ON.LEN = lex;
			o.NATURALJOIN = o.USING = uu
		};
		if (o.CROSSJOIN) {
			o.ON = function () { return true };
			o.CROSSJOIN = false
		};
		if (o.JOIN && o.ON && !d.join && !o.JOIN.join) {
			for (j in o.JOIN) { if (!d[j]) { d[j] = o.JOIN[j] } };
			ot = {}, k;
			for (j in d) {
				if (o.FULLOUTERJOIN || o.FULLJOIN || o.OUTERJOIN) { k = true; ot[j] = true };
				if ((o.LEFTOUTERJOIN || o.LEFTJOIN) && !o.JOIN[j]) { k = true; ot[j] = true };
				if ((o.RIGHTOUTERJOIN || o.RIGHTJOIN) && o.JOIN[j]) { k = true; ot[j] = true };
			};
			o.OUTERTABLES = k ? ot : false;
			f = o.WHERE || function () { return true };
			o.WHERE = o.ON;
			o.WHERE.org = f;
			o.JOIN = o.INNERJOIN = o.NATURALJOIN = o.CROSSJOIN = o.LEFTOUTERJOIN = o.RIGHTOUTERJOIN = o.LEFTJOIN =
			o.RIGHTJOIN = o.FULLOUTERJOIN = o.OUTERJOIN = o.FULLJOIN = o.ON = uu;
			return arguments.callee(o)
		};

		// JOIN (from WHERE clause)
		if (!d.join) {
			joinFuncHolder = {
				f: function (x, where, outer) {
					var d = [], e = [], coMax = [], co = [], labels = [], xLen = 0, m = [];
					for (i in x) {
						coMax.push(x[i].length);
						labels.push(i);
						m.push([]);
						co.push(0);
						xLen++
					};
					while (co[xLen - 1] < coMax[xLen - 1]) {
						var o = {};
						for (i = 0; i < xLen; i++) {
							o[labels[i]] = x[labels[i]][co[i]];
						};
						q = where.apply(o);
						if (q) {
							if (outer) {
								for (i = 0; i < xLen; i++) {
									m[i][co[i]] = true
								}
							};
							obj = {};
							for (i = 0; i < xLen; i++) {
								for (j in o[labels[i]]) {
									if (j == "__SQLikeHash__") { continue };
									obj[(typeof q == "object" && q[j] ? '' : labels[i] + '_') + j] = o[labels[i]][j]
								}
							};
							d.push(obj);
							e.push(o);
						};
						for (i = 0; i < xLen; i++) {
							co[i]++;
							if (co[i] < coMax[i]) { break };
							if (i < xLen - 1) { co[i] = 0 }
						};
					};
					if (outer) {
						for (i = 0; i < xLen; i++) {
							if (!outer[labels[i]]) { continue };
							for (j = 0; j < coMax[i]; j++) {
								if (!m[i][j]) {
									o = x[labels[i]][j], o2 = {}, o3 = {};
									for (k = 0; k < xLen; k++) { o3[labels[k]] = {} };
									for (k in o) { o3[labels[i]][k] = o[k]; o2[labels[i] + "_" + k] = o[k] };
									d.push(o2);
									e.push(o3)
								}
							}
						}
					};
					if (where.org) {
						for (i = d.length - 1; i >= 0; i--) {
							if (!where.org.apply(e[i])) { d.splice(i, 1) }
						}
					};
					return d
				}
			};
			d = joinFuncHolder.f(d, o.WHERE, o.OUTERTABLES)
		}

			// WHERE
		else {
			d2 = [], whereIndexes = [];
			for (i = 0; i < d.length; i++) {
				if (!o.WHERE || o.WHERE.apply(d[i])) {
					d2.push(d[i]);
					whereIndexes.push(i)
				}
			};
			d = d2;
		};

		// DELETE
		if (o.DELETEFROM) {
			for (i = whereIndexes.length - 1; i >= 0; i--) {
				orgD.splice(whereIndexes[i], 1)
			}
			return orgD
		};

		// UPDATE
		if (o.UPDATE && o.SET) {
			for (i = 0; i <= whereIndexes.length; i++) {
				o.SET.apply(orgD[whereIndexes[i]])
			}
			return orgD
		};

		// SELECT
		distinct = !!o.SELECTDISTINCT;
		o.SELECT = o.SELECT || o.SELECTDISTINCT;
		if (o.SELECT && o.SELECT.length > 0) {
			d2 = [], distinctHash = {}, ags = {}, fieldCo = 0, s = o.SELECT;
			if (s[0] == "|count|" && s[1] == "*") {
				return [{ count: d.length }]
			};
			for (i = 0; i < s.length; i++) {
				if (s[i] == "*") {
					h = {}, t = [];
					for (k = 0; k < d.length; k++) { for (j in d[k]) { if (!h[j]) { t.push(j); h[j] = true } } };
					s.splice(i, 1);
					for (j = t.length - 1; j >= 0; j--) { s.splice(i, 0, t[j]) }
					break
				}
			};
			for (i = 0; i < d.length; i++) {
				lastProp, obj = {}, distinctKey;
				for (j = 0; j < s.length; j++) {
					pname = s[j], pname2 = pname, theVal = d[i][pname2];
					if (typeof s[j] == "string" && s[j].toLowerCase() == "|as|") { j += 1; continue };
					if (typeof s[j] == "string" && s[j].charAt(0) == "|" && s[j].charAt(s[j].length - 1) == "|") { continue };
					if (typeof pname == "function") {
						theVal = pname.apply(d[i]);
						co = 1;
						pname = "udf_1";
						while (obj[pname]) { co++; pname = "udf_" + co }
					};
					if (typeof s[j + 1] == "string" && typeof s[j + 2] == "string" && s[j + 1].toLowerCase() == "|as|") {
						pname = s[j + 2]
					};
					if (typeof s[j - 1] == "string" && s[j - 1].charAt(0) == "|" && s[j - 1].charAt(s[j - 1].length - 1) == "|") {
						ag_type = s[j - 1].split('|')[1];
						pname = ag_type + '_' + pname;
						ags[pname] = { type: ag_type, count: 0, sum: 0, avg: 0 }
					};
					if (o.JHELP && !o.JHELP[pname]) { pname = o.JTNAME + pname };
					lastProp = pname;
					obj[pname] = theVal
					if (i == 0) { fieldCo++ };
				};

				if (distinct) { x = []; for (k in obj) { x.push(obj[k]) }; distinctKey = x.join('|||') };
				if (!distinct || !distinctHash[distinctKey]) {
					d2.push(obj)
				};
				if (distinct) { distinctHash[distinctKey] = true };
			};
			// aggregate functions
			agsCo = 0;
			for (i in ags) {
				agsCo++;
				y = ags[i];
				for (j = 0; j < d2.length; j++) {
					x = d2[j][i];
					if (x !== uu) {
						y.count++;
						if (y.min === uu) { y.min = x };
						if (y.max === uu) { y.max = x };
						if (y.min > x) { y.min = x };
						if (y.max < x) { y.max = x };
						if (x / 1 == x) { y.sum += x }
					}
				};
				y.avg = y.sum / y.count;
				d2[0][i] = ags[i][ags[i].type]
			};
			if (agsCo > 0) { d2 = [d2[0]]; d = [d2[0]] };
			if (o.ORDERBY && o.ORDERBY.prep) { return [d2, d] };
			return d2
		};

		return []
	}
};