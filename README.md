gulp wrapper for stylegen...

### usage:

```js
var gulp = require('gulp');
var stylegen = require('gulp-stylegen');

gulp.task('default', function() {
  gulp.src('sub/styleguide.yaml')
  .pipe(stylegen({
    cwd: './example'
    , target: '../styleguide'
  }));
});
```
