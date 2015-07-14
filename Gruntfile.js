/* jshint node: true */

module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
    , jshint: {
        all: [
            "Gruntfile.js"
          , "spec/**/*.js"
		  , "js/**/data.js"
        ]
      , options: {
          jshintrc: '.jshintrc'
        },
      }
    , jasmine: {
        src: "js/**/data.js"
      , options: {
          specs: "spec/*Spec.js"
		//, helpers: "spec/*Helper.js"
		, version: "2.3.4"
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-jasmine')

  grunt.registerTask('syncversion', "Sync the versions between files.", function () {
    var json = require('./package.json')
    var fs = require('fs')
    var file = './lib/jasmine-jquery.js'

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) return console.log(err)

      var res = data.replace(/^Version .*$/m, 'Version ' + json.version)

      fs.writeFile(file, res, 'utf8', function (err) {
        if (err) return console.log(err)
      })
    })
  })

  grunt.registerTask('test', ['jshint', 'jasmine'])
  grunt.registerTask('default', ['syncversion', 'test'])
};