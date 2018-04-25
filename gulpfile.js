const gulp = require('gulp'),
  zip = require('gulp-zip'),
  pjson = require('./package.json'),
  colors = require('colors');


gulp.task('zip', () => {
  var fname = pjson.name + pjson.version.replace(/\./gi, '_') + '.zip';
  console.log("Writing ".yellow + 'dist/'.magenta + fname.magenta + '...'.yellow);
  return gulp.src(['**/*', '!node_modules/**', '!dist/**'])
    .pipe(zip(fname))
    .pipe(gulp.dest('./dist/'))
});