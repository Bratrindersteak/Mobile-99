'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var del = require('del');

gulp.task('compress:js', ['clean:js'], function() {
	return gulp.src(['./scripts/**/*.js', '!./scripts/plugins/*.js'])
		// .pipe(watch(['./scripts/**/*.js', '!./scripts/config/dist.js', '!./scripts/libs/*.js']))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('./dist/scripts'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev/scripts'));
});

gulp.task('sass', ['clean:css'], function() {
	return gulp.src('sass/neun.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		// .pipe(rename(function (path) {
		// 	path.basename += '.min';
		// 	path.extname = '.css';
		// }))
		.pipe(rev())
		.pipe(gulp.dest('dist/styles'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/styles'));
});

gulp.task('imagemin', ['clean:images'], function() {
	return gulp.src('./images/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			optimizationLevel: 5,
			progressive: true
		}))
		.pipe(rev())
		.pipe(gulp.dest('./dist/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./rev/images'));
});

gulp.task('revJs', ['compress:js'], function() {
	return gulp.src(['./rev/scripts/*.json', './views/*.html'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('./views'));
});

gulp.task('revCss', ['sass'], function() {
	return gulp.src(['rev/styles/*.json', 'views/*.html'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('views'));
});

gulp.task('revImgH', ['imagemin'], function() {
	return gulp.src(['./rev/images/*.json', './views/*.html'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('./views'));
		
});

gulp.task('revImgC', ['imagemin'], function() {
	return gulp.src(['./rev/images/*.json', './sass/*.scss'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('./sass'));
		
});

gulp.task('clean:js', function() {
	return gulp.src(['./scripts/**/*.js', '!./scripts/plugins/*.js'])
	del();
	// del(['./dist/scripts/*']);
});

gulp.task('clean:css', function() {
	del(['./dist/styles/*']);
});

gulp.task('clean:images', function() {
	del(['./dist/images/*']);
});

gulp.task('default', ['revJs', 'revImgH', 'revImgC', 'revCss'], function() {
	gulp.watch(['./scripts/**/*.js', '!./scripts/plugins/*.js'], ['revJs']);
	gulp.watch('./sass/*.scss', ['revCss']);
	gulp.watch('./images/*.{png,jpg,gif,ico}', ['revImgH', 'revImgC']);
});