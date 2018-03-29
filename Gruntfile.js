module.exports = function(grunt) {
    // load plugins
    [
        'grunt-cafe-mocha',
        'grunt-eslint'
    ].forEach(function(task) {
        grunt.loadNpmTasks(task);
    });

    // configure plugins
    grunt.initConfig({
        cafemocha: {
            all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }}
        },
        eslint: {
            target: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js']
        }
    });

    // register task
    grunt.registerTask('default', ['cafemocha', 'eslint']);
};