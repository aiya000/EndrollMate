module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-babel');
	grunt.initConfig({
		typescript : {
			main : {
				src : [
					"ts/index.ts",
					"ts/MainController.ts",
					"ts/MainScope.ts",
					"ts/Maybe.ts",
					"ts/InvalidOperationError.ts",
					"ts/Util.ts",
					"ts/ascroller.ts"
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
