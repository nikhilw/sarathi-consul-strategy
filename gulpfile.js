var gulp = require("gulp");
var mocha = require("gulp-mocha");
var istanbul = require("gulp-istanbul");

gulp.task("pre-test", function () {
	return gulp.src(["lib/**/*.js"])
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function () {
	return gulp.src("test/**/*.js", {read: false})
		.pipe(mocha({reporter: "spec"}))
		.pipe(istanbul.writeReports())
		.pipe(istanbul.enforceThresholds({thresholds: {global: 80}}))
		.once("error", function () {
			process.exit(1);
		})
		.once("end", function () {
			process.exit();
		});
});

gulp.task("default", ["test"]);
