window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

function importAll() {
	var list = [];
	for (var i = 0; i < arguments.length; i++) list.push(arguments[i]);
	var callback = list.pop();
	loadNext(list, function() {
		callback();
	});
}

function loadNext(list, cb, loaded) {
	if (loaded === undefined) loaded = [];
	var list = list;
	var cb = cb;
	var file;
	do {
		file = list.shift();
	} while (loaded.indexOf(file) > -1);
	if (!file) return cb();
	loaded.push(file);
	file = './js/' + file;
	loadFile(file, function(data) {
		var rx = /\/\/\/[^\n]+/gi, req, reqarr = [];
		while (req = rx.exec(data)) {
			if (loaded.indexOf(req[0].substr(4)) == -1) {
				reqarr.push(req[0].substr(4));
			}
		}
		var lf = function(list, cb, file) {
			var scr = document.createElement('script');
			scr.loadList = list;
			scr.callback = cb;
			scr.src = file;
			scr.addEventListener('load', function() {
				if (this.loadList.length > 0) {
					loadNext(this.loadList, this.callback, loaded);
				} else {
					this.callback();
				}
			});
			document.head.appendChild(scr);
		}
		if (reqarr.length > 0) {
			loadNext(reqarr, function() {
				lf(list, cb, file);
			}, loaded);
		} else {
			lf(list, cb, file);
		}
	});
}

var fileCache = {};

function loadFile(f,cb) {
	if (fileCache[f] !== undefined) {
		if (cb !== undefined) cb(fileCache[f]);
		else return fileCache[f];
	} else {
		var xhr = new XMLHttpRequest();
		if (cb === undefined) {
			xhr.open('GET', f, false);
			xhr.setRequestHeader('Cache-Control','no-cache,max-age=0');
			xhr.setRequestHeader('Pragma','no-cache');
			xhr.send(null);
			fileCache[f] = xhr.responseText;
			return xhr.responseText;
		} else {
			xhr.open('GET', f, true);
			xhr.addEventListener('load', function(e) {
				fileCache[f] = xhr.responseText;
				cb(xhr.responseText);
			});
			xhr.setRequestHeader('Cache-Control','no-cache,max-age=0');
			xhr.setRequestHeader('Pragma','no-cache');
			xhr.send(null);
		}
	}
}

function init() {
	Game.init();
}

importAll(
	'lib/glowcore.js',
	'lib/glowexts.js',
	'utils.js',
	'game.js',
init);