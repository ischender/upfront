/*global module, require */
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-wp-i18n');

	grunt.initConfig({
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed',
				sourceComments: false
			},
			dist: {
				files: {
					'styles/editor-interface.css': 'styles/editor-interface.scss'
				}
			}
		},
		cssmin: {
			minify: {
				expand: true,
                sourceMap: true,
				cwd: 'styles',
				src: ['global.css', 'editor-interface.css'],
				dest: 'styles',
				ext: '.min.css'
			}
		},
		watch: {
			sass: {
				files: ['**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false
				}
			}
		},
		makepot: {
			target: {
				options: {
					domainPath: 'languages/',
					type: 'wp-theme'
				}
			}
		}
	});

	grunt.registerTask('default', ['sass', 'cssmin']);
};
