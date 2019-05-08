'use strict';

/**
 * Plugins
 */
var gulpCssGrader = require('./'),
    should = require('should'),
    fs  = require('fs'),
    gutil = require('gulp-util');

/**
 * Test input
 */
var baseStylePath = 'test/input/base.css';


/**
 * Test task
 */
it('get action test', function (done) {
    const stream = gulpCssGrader('get', {
        properties: ['color', 'background-color']
    });

    stream.on('data', function (file) {
        should.exist(file);
        should.exist(file.contents);

        //String(newFile.contents).should.equal(expected1);
        //console.log(file.contents.toString());

        done();
    });

    stream.write(new gutil.File({
        path: baseStylePath,
        contents: fs.readFileSync('./' + baseStylePath)
    }));

    stream.end();
});

it('remove action test', function (done) {
    const stream = gulpCssGrader('remove', {
        properties: ['color', 'background-color']
    });

    stream.on('data', function (file) {
        should.exist(file);
        should.exist(file.contents);

        //String(newFile.contents).should.equal(expected1);
        //console.log(file.contents.toString());

        done();
    });

    stream.write(new gutil.File({
        path: baseStylePath,
        contents: fs.readFileSync('./' + baseStylePath)
    }));

    stream.end();
});
