module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-babel');
	grunt.initConfig({
		typescript : {
			main : {
				src : [
					"ts/Control/CSS/Keyframes.ts",
					"ts/Data/CSS/FontColorCSS.ts",
					"ts/Data/Error/InvalidOperationError.ts",
					"ts/Data/Maybe/Maybe.ts",
					"ts/index.ts",
					"ts/MainController.ts",
					"ts/MainScope.ts",
					"ts/Util.ts"
				],
				dest : "ts/es6/index.js",
				options : {
					target : "es6"
				}
			}
		},
		babel : {
			dist : {
				files : {
					"js/index.js" : "ts/es6/index.js"
				}
			}
		}
	});
	grunt.registerTask("default", ["typescript", "babel"]);
};
