'use strict';

var PLUGIN_NAME = 'gulp-css-grader';

var gutil           = require('gulp-util'),
    pluginError     = gutil.PluginError,
    through         = require('through2'),
    stringifyCss    = require('css-stringify'),
    parseCss        = require('css-parse');


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
            var parsed = parseCss(new String(file.contents));

            parsed.stylesheet.rules.forEach(function (node) {
                /**
                 * Media Query
                 */
                if (node.type === 'media') {
                    node.rules.forEach(function (rule) {
                        rule.declarations = _transformDeclarations(rule.declarations, action, options);
                    })
                }
                /***
                 * Simple Css rules
                 */
                if (node.type === 'rule') {
                    node.declarations = _transformDeclarations(node.declarations, action, options);
                }
            });

            file.contents = Buffer.from(stringifyCss(parsed));
            return callback(null, file);
        }

        callback(null, file);
    });
};


/**
 * TODO move actions to lib
 * transform css property collections
 * @param ruleDeclarations
 * @param action
 * @param options
 * @returns {Array}
 * @private
 */
function _transformDeclarations(ruleDeclarations, action, options) {
    var declarations = [];

    ruleDeclarations.forEach(function (declaration) {
        switch (action) {
            case 'get' : {
                if (options.properties.indexOf(declaration.property) !== -1) {
                    declarations.push(declaration);
                }
                break;
            }
            case 'remove' : {
                if (options.properties.indexOf(declaration.property) === -1) {
                    declarations.push(declaration);
                }
                break;
            }
        }
    });

    return declarations;
}

module.exports = gulpcssgrader;