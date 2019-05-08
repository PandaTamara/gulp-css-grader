'use strict';

var PLUGIN_NAME = 'gulp-css-grader';

var gutil           = require('gulp-util'),
    pluginError     = gutil.PluginError,
    through         = require('through2'),
    stringifyCss    = require('css-stringify'),
    parseCss        = require('css-parse');

/**
 * Init magic
 * @param action - get or remove
 * @param options - array of css properties
 * @returns {*}
 */
var gulpcssgrader = function (action, options) {
    options = options || {};

    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new pluginError(PLUGIN_NAME, 'This plugin not supported Streams!'));
        }

        if (file.isBuffer()) {
            var parsed = parseCss(String(file.contents)),
                gradedRules = [];

            parsed.stylesheet.rules.forEach(function (node) {
                /**
                 * Media Query block
                 */
                if (node.type === 'media') {
                    if (!(node.rules = _transformRules(node.rules, action, options)).length) {
                        return;
                    }
                }
                /***
                 * Simple Css rules
                 */
                if (node.type === 'rule') {
                    if (!(node.declarations = _transformDeclarations(node.declarations, action, options)).length) {
                        return;
                    }
                }

                gradedRules.push(node);
            });

            /**
             * Set new rules
             * @type {Array}
             */
            parsed.stylesheet.rules = gradedRules;

            file.contents = Buffer.from(stringifyCss(parsed));
            return cb(null, file);
        }

        cb(null, file);
    });
};

/**
 *
 * @param nodeRules
 * @param action
 * @param options
 * @returns {Array}
 * @private
 */
function _transformRules(nodeRules, action, options) {
    var rules = [];

    nodeRules.forEach(function (rule) {
        rule.declarations = _transformDeclarations(rule.declarations, action, options);

        if (rule.declarations.length) {
            rules.push(rule);
        }
    });
    return rules;
}

/**
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