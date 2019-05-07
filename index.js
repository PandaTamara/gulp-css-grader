'use strict';

var PLUGIN_NAME = 'gulp-css-grader';

var gutil           = require('gulp-util'),
    pluginError     = gutil.PluginError,
    through         = require('through2'),
    postcss         = require('postcss'),
    lodash          = require('lodash.merge');


var gulpcssgrader = function (action, options) {
    options = options || {};

    return through.obj(function(file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new pluginError(PLUGIN_NAME, 'This plugin not supported Streams!'));
        }

        if (file.isBuffer()) {
            var parsed = _parseCss(new String(file.contents)),
                processed = {};

            Object.keys(parsed).forEach(function (selector) {
                Object.keys(parsed[selector]).forEach(function (prop) {
                    switch (action) {
                        case 'get' : {
                            if (options.properties.indexOf(prop) !== -1) {
                                processed = _collectProp(processed, selector, prop, parsed[selector][prop]);
                            }
                            break;
                        }
                        case 'remove' : {
                            if (options.properties.indexOf(prop) === -1) {
                                processed = _collectProp(processed, selector, prop, parsed[selector][prop]);
                            }
                            break;
                        }
                    }
                });
            });

            file.contents = Buffer.from(_toString(processed));
            return callback(null, file);
        }

        callback(null, file);
    });
};

function _collectProp(obj, selector, prop, value) {
    if (obj[selector]) {
        obj[selector][prop] = value;
    } else {
        obj[selector] = _defineProperty({}, prop, value);
    }

    return obj;
}

function _parseCss(css) {
    var ast = (0, postcss.parse)(css);
    var result = {};

    ast.nodes.forEach(function (node) {
        if (node.type === 'rule') {
            (function () {
                var declarations = {};

                node.nodes.forEach(function (dcl) {
                    if (dcl.type !== 'decl') {
                        return;
                    }

                    declarations[dcl.prop] = dcl.value + (typeof dcl.important !== 'undefined' ? ' !important' : '');
                });

                result = (0, lodash)(result, _defineProperty({}, node.selector, declarations));
            })();
        }
    });

    return result;
}

function _toString(css) {
    var result = '';

    Object.keys(css).forEach(function (selector) {
        result = '' + result + selector + ' {\n';

        Object.keys(css[selector]).forEach(function (prop) {
            result = result + '  ' + prop + ': ' + css[selector][prop] + ';\n';
        });

        result = result + '}\n';
    });

    return result;
};


function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {value: value, enumerable: true, configurable: true, writable: true});
    } else {
        obj[key] = value;
    }
    return obj;
}

module.exports = gulpcssgrader;