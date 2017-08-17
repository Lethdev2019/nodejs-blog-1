module.exports = function (grunt) {
    grunt.initConfig({

        // Compile the SVG Icons to web-font
        webfont: {
            icons: {
                src: 'assets/icons/*.svg',
                dest: 'public/fonts',
                destCss: 'assets/scss/fonts/',
                options: {
                    font: 'tb_icons',
                    fontFilename: 'tb_icon_font',
                    types: 'ttf,eot,woff,svg',
                    stylesheet: 'scss',
                    htmlDemo: false,
                    relativeFontPath: '/fonts/',
                    templateOptions: {
                        baseClass: 'tb_icon',
                        classPrefix: 'tb_icon--'
                    }
                }
            }
        },

        // Compile the CSS (Pre-process)
        sass: {
            build: {
                options: {
                    sourcemap: 'none',
                    noCache: true,
                    style: 'expanded'
                },
                files: {
                    'public/css/app.css': 'assets/scss/main.scss'
                }
            }
        },

        handlebars: {
            build: {
                options: {
                    partialRegex: /.*/,
                    partialsPathRegex: /\/partials\/client\//,
                    namespace: 'tmpl',
                    processName: function (filePath) {
                        return filePath.replace('views/partials/client', '').replace('.hbs', '');
                    }
                },
                files: {
                    'public/js/tmpl.js': 'views/partials/client/*.hbs'
                }
            }
        },

        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/css/vendors.css': [
                        'public/css/bootstrap.min.css',
                        'public/plugins/font-awesome.min.css',
                        'public/plugins/pikaday.min.css',
                        'public/plugins/select2.min.css',
                        'public/plugins/cropper.min.css',
                        'public/plugins/editor/medium-editor.min.css',
                        'public/plugins/editor/default.css',
                        'public/plugins/editor/medium-editor-insert-plugin.min.css',
                    ],
                    'public/css/app.css': ['public/css/app.css'],
                }
            }
        },

        uglify: {
            vendors: {
                options: {
                    mangle: false,
                    compress: {
                        drop_console: true //eslint-disable-line camelcase
                    }
                },
                files: {
                    'public/js/vendors.js': [
                        'public/plugins/jquery.min.js',
                        'public/plugins/bootstrap.min.js',
                        'public/plugins/select2.full.min.js',
                        'public/plugins/editor/medium-editor.min.js',
                        'node_modules/handlebars/dist/handlebars.runtime.min.js',
                        'public/plugins/editor/jquery.ui.widget.js',
                        'public/plugins/editor/jquery.iframe-transport.js',
                        'public/plugins/editor/jquery.fileupload.js',
                        'public/plugins/editor/jquery-sortable-min.js',
                        'public/plugins/editor/jquery.cycle2.min.js',
                        'public/plugins/editor/jquery.cycle2.center.min.js',
                        'public/plugins/editor/medium-editor-insert-plugin.min.js',
                        'public/plugins/textcounter.min.js',
                        'public/plugins/waves.js',
                        'public/plugins/isotope.pkgd.min.js',
                    ],
                    'public/js/app.js': [
                        'public/js/app.js'
                    ]
                }
            }
        },

        browserify: {
            dist: {
                files: {
                    'public/js/app.js': 'assets/js/app.js'
                }
            }
        },

        hashres: {
            options: {
                encoding: 'utf8',
                fileNameFormat: '${hash}.${name}.${ext}',
                renameFiles: true
            },
            css: {
                src: ['public/css/app.css'],
                dest: ['views/*.hbs']
            },
            js: {
                src: ['public/js/vendors.js', 'public/js/app.js'],
                dest: ['views/*.hbs']
            }
        },

        watch: {
            scripts: {
                files: [
                    'assets/js/**/*.js', 'assets/js/*.js'
                ],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: [
                    'assets/scss/**/*.scss', 'assets/scss/*.scss'
                ],
                tasks: ['sass'],
                options: {
                    spawn: false
                }
            },
            handlebars: {
                files: 'views/partials/client/*.hbs',
                tasks: ['handlebars'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Loads Tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-webfont');

    grunt.registerTask('default', ['sass', 'cssmin', 'handlebars', 'browserify', 'uglify', 'watch']);
    grunt.registerTask('build', ['sass', 'cssmin', 'handlebars', 'browserify', 'uglify', 'hashres']);
};
