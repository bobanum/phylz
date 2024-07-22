/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
import db from 'mime-db';

export default class Mime {

	/**
	 * Module dependencies.
	 * @private
	 */

	// var extname = require('path').extname

	/**
	 * Module variables.
	 * @private
	 */

	static EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
	static TEXT_TYPE_REGEXP = /^text\//i;

	/**
	 * Module exports.
	 * @public
	 */

	static charsets = { lookup: this.charset };

	/**
	 * Get the default charset for a MIME type.
	 *
	 * @param {string} type
	 * @return {boolean|string}
	 */

	static charset(type) {
		if (!type || typeof type !== 'string') {
			return false;
		}

		// TODO: use media-typer
		var match = this.EXTRACT_TYPE_REGEXP.exec(type);
		var mime = match && db[match[1].toLowerCase()];

		if (mime && mime.charset) {
			return mime.charset;
		}

		// default text/* to utf-8
		if (match && this.TEXT_TYPE_REGEXP.test(match[1])) {
			return 'UTF-8';
		}

		return false;
	}

	/**
	 * Create a full Content-Type header given a MIME type or extension.
	 *
	 * @param {string} str
	 * @return {boolean|string}
	 */

	static contentType(str) {
		// TODO: should this even be in this module?
		if (!str || typeof str !== 'string') {
			return false;
		}

		var mime = str.indexOf('/') === -1
			? exports.lookup(str)
			: str;

		if (!mime) {
			return false;
		}

		// TODO: use content-type or other module
		if (mime.indexOf('charset') === -1) {
			var charset = exports.charset(mime);
			if (charset) mime += '; charset=' + charset.toLowerCase();
		}

		return mime;
	}

	/**
	 * Get the default extension for a MIME type.
	 *
	 * @param {string} type
	 * @return {boolean|string}
	 */

	static extension(type) {
		if (!type || typeof type !== 'string') {
			return false;
		}

		// TODO: use media-typer
		var match = this.EXTRACT_TYPE_REGEXP.exec(type);

		// get extensions
		var exts = match && this.extensions[match[1].toLowerCase()];

		if (!exts || !exts.length) {
			return false;
		}

		return exts[0];
	}

	static getExtention(file) {
		if (!file || typeof file !== 'string') {
			return false;
		}
		return extension;
	}
	/**
	 * Lookup the MIME type for a file path/extension.
	*
	 * @param {string} path
	 * @return {boolean|string}
	*/
	
	static lookup(path) {
		if (!path || typeof path !== 'string') {
			return false;
		}
		// get the extension ("ext" or ".ext" or full path)
		var extension = path
			.split('.')
			.slice(-1)[0]
			.toLowerCase();
		
		if (!extension) {	// File ends with a dot
			return false;
		}

		return this.types[extension] || 'folder';
	}

	/**
	 * Populate the extensions and types maps.
	 * @private
	 */

	static populateMaps(db) {
		this.extensions = Object.create(null);
		this.types = Object.create(null);
		// source preference (least -> most)
		var preference = ['nginx', 'apache', undefined, 'iana'];

		Object.keys(db).forEach((type) => {
			var mime = db[type];
			var exts = mime.extensions;

			if (!exts || !exts.length) {
				return;
			}

			// mime -> extensions
			this.extensions[type] = exts;

			// extension -> mime
			for (var i = 0; i < exts.length; i++) {
				var extension = exts[i];

				if (this.types[extension]) {
					var from = preference.indexOf(db[this.types[extension]].source);
					var to = preference.indexOf(mime.source);

					if (this.types[extension] !== 'application/octet-stream' &&
						(from > to || (from === to && this.types[extension].substr(0, 12) === 'application/'))) {
						// skip the remapping
						continue;
					}
				}

				// set the extension -> mime
				this.types[extension] = type;
			}
		});
	}
}
Mime.populateMaps(db);
export const lookup = Mime.lookup;
export const extension = Mime.extension;
export const charset = Mime.charset;
export const contentType = Mime.contentType;
