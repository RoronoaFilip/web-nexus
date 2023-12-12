const gulp = require('gulp');
const del = require('del');

// Define a task to clean the dist folder
gulp.task('clean-dist', () => {
  return del(['dist/**', '!dist']); // Exclude the 'dist' folder itself
});

// Default task
gulp.task('default', gulp.series('clean-dist'));
