/// <binding ProjectOpened='init-project' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    cleanTargetDir: true,
                    targetDir: 'www/libs',
                    layout: 'byComponent'
                }
            }
        },
        typescript: {
            all: {
                src: [
                    'assets/scripts/core/**/*.ts',
                    'assets/scripts/App.ts'],
                dest: 'www/scripts/app.js',
                options: {
                    sourceMap: true,
                    declaration: false,
                    removeComments: true
                }
            }
        },
        watch: {
            bower: {
                files: 'bower.json',
                tasks: ['bower:install']
            },
            typescript: {
                files: ['assets/scripts/**/*.ts'],
                tasks: ['typescript']
            },
            tsd: {
                files: 'tsd.json',
                tasks: ['tsd:refresh']
            }
        },
        tsd: {
            refresh: {
                options: {
                    // execute a command
                    command: 'reinstall',

                    //optional: always get from HEAD
                    latest: true,

                    // specify config file
                    config: 'tsd.json',

                    // experimental: options to pass to tsd.API
                    opts: {
                        // props from tsd.Options
                    }
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-tsd');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask('init-project', ['bower:install', 'tsd:refresh', 'watch']);
    grunt.registerTask('build', ['typescript'])
};