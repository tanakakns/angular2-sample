Angular2 Sample
===

https://angular.io/  
http://www.angular2.com/  
参考：angular2-gulp  
http://blog.scottlogic.com/2015/12/24/creating-an-angular-2-build.html  

## 初期構築メモ（2016/01/28）

mkdir angular2-sample  
`cd angular2-sample`  
`npm init`  
`npm install angular2@2.0.0-beta.1 es6-promise@^3.0.2 es6-shim@^0.33.3 reflect-metadata@0.1.2 rxjs@5.0.0-beta.0 zone.js@0.5.10 --save-dev` 
`npm install systemjs --save-dev`  
`npm install gulp --save-dev`  
`npm install gulp-typescript del --save-dev`  
`npm install typescript browserify --save-dev`  
`type nul > gulpfile.js`  

```javascript
const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tsConfig = require('./tsconfig.json');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dest/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(gulp.dest('dest/app'));
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);
```

`type nul > tsconfig.json`  

```javascript
{
  "compilerOptions": {
    "outDir": "dest/app",
    "target": "ES5",
    "module": "system",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "removeComments": false,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true
  },
    "filesGlob": [
        "./**/*.ts",
        "!./node_modules/**/*.ts"
    ],
    "files": [
        "./app/**/*.ts"
    ]
}
```

`npm install gulp-sourcemaps --save-dev`  

```javascript
const sourcemaps = require('gulp-sourcemaps');
...

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src(tsConfig.files)
    .pipe(sourcemaps.init())          // <--- sourcemaps
    .pipe(typescript(tsConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    .pipe(gulp.dest('dest/app'));
});
```

jsのロードを使いやすくする。  

```javascript
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js'
    ])
    .pipe(gulp.dest('dest/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dest'))
});
```

これで下記のようにHTMLからロードできる。  

```html
<script src="/lib/es6-shim.min.js"></script>
<script src="/lib/system-polyfills.js"></script>
<script src="/lib/angular2-polyfills.js"></script>
<script src="/lib/system.src.js"></script>
<script src="/lib/Rx.js"></script>
<script src="/lib/angular2.dev.js"></script>
```


`npm install tslint gulp-tslint --save-dev`  

```javascript
const tslint = require('gulp-tslint');
...

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});
...

gulp.task('build', ['tslint', 'compile', 'copy:libs', 'copy:assets']);
```

package.jsonへ下記追加  

```javascript
"scripts": {
  "tslint": "tslint -c tslint.json app/**/*.ts",
}
```
type nul > .gitignore  
.gitignoreを編集  
```
node_modules/
dest/
```

`npm install gulp-webserver --save-dev`  

```javascript
var webserver = require('gulp-webserver');

gulp.task('server', function() {
  gulp.src('./dest/')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});
```

以下の4ファイルを作成  
  
app/app.component.ts  
```typescript
import {Component} from 'angular2/core';
@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1>'
})
export class AppComponent { }
```

app/boot.ts
```typescript
import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
bootstrap(AppComponent);
```

index.html
```html
<html>
  <head>
    <title>Angular 2 QuickStart</title>
    <!-- 1. Load libraries -->
    <!-- IE required polyfills, in this exact order -->
    <script src="/lib/es6-shim.min.js"></script>
    <script src="/lib/system-polyfills.js"></script>
    <script src="/lib/angular2-polyfills.js"></script>
    <script src="/lib/system.src.js"></script>
    <script src="/lib/Rx.js"></script>
    <script src="/lib/angular2.dev.js"></script>
    <!-- 2. Configure SystemJS -->
    <script>
      System.config({
        packages: {        
          app: {
            format: 'register',
            defaultExtension: 'js'
          }
        }
      });
      System.import('app/boot')
            .then(null, console.error.bind(console));
    </script>
  </head>
  <!-- 3. Display the application -->
  <body>
    <my-app>Loading...</my-app>
  </body>
</html>
```

`gulp build`  
`gulp server`  