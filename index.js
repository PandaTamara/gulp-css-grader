'use strict';

var gutil           = require('gulp-util'),
    Transform       = require('stream').Transform,
    PluginError     = gutil.PluginError,
    through         = require('through2');

var PLUGIN_NAME = 'gulp-css-grader';


/*module.exports = function() {
    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        console.log(file);

        if (file.isStream()) {
            // file.contents is a Stream - https://nodejs.org/api/stream.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

            // or, if you can handle Streams:
            //file.contents = file.contents.pipe(...
            //return callback(null, file);
        } else if (file.isBuffer()) {
            // file.contents is a Buffer - https://nodejs.org/api/buffer.html
            this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));

            // or, if you can handle Buffers:
            //file.contents = ...
            //return callback(null, file);
        }
    });
};*/

function gulpcssgrader(options) {
    var stream = new Transform({ objectMode: true });

    if (typeof options === 'string') {
        options = { basefile: options };
    }

    if (typeof options.basefile === 'undefined') {
        stream.emit('error', new gutil.PluginError(PLUGIN_NAME, 'A base file path is required as the only argument or as an option { basefile: \'...\' }'));
    }

    stream._transform = function(file, unused, done) {
        /*var callback = function(rhs) { return doDiff(rhs, options); };
        // Pass through if null
        if (file.isNull()) {
            stream.push(file);
            done();
            return;
        }
        if (file.isStream()) {
            Loader.stream(file, callback, stream, done);
        } else {
            Loader.string(file, callback, stream, done);
        }*/
    };
    return stream;
}


module.exports = gulpcssgrader;