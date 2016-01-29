Angular2 Sample
===
## 参考
https://angular.io/  
http://www.angular2.com/  

## 環境構築
Node.jsをインストールしてnpmを導入する。  
https://nodejs.org/  

## 初期構築メモ（2016/01/28）
プロジェクトディレクトリを作成する。  
`mkdir angular2-sample`  
`cd angular2-sample`  

npmプロジェクトの初期化とプラグインを導入する。  
`npm init`  
`npm install angular2@2.0.0-beta.1 es6-promise@^3.0.2 es6-shim@^0.33.3 reflect-metadata@0.1.2 rxjs@5.0.0-beta.0 zone.js@0.5.10 --save-dev` 
`npm install systemjs --save-dev`  
`npm install gulp --save-dev`  
`npm install gulp-typescript del --save-dev`  
`npm install typescript browserify --save-dev`

gulpfileを作成する。  
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

tsconfig.jsonファイルを作成する。  
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

sourcemapプラグインを追加してgulpファイルを修正する。  
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

jsのロードを簡単にするためにgulpfile.jsを修正する。  
```javascript
gulp.task('copy:libs', ['clean'], function() {
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.dev.js',
      'node_modules/angular2/bundles/http.dev.js'
    ])
    .pipe(gulp.dest('dest/lib'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', './**/*.html', 'styles.css', '!app/**/*.ts', '!./node_modules/**/*'], { base : './' })
    .pipe(gulp.dest('dest'))
});
```

これで下記のようにHTMLからロードできるようになる。  
```html
<script src="/lib/es6-shim.min.js"></script>
<script src="/lib/system-polyfills.js"></script>
<script src="/lib/angular2-polyfills.js"></script>
<script src="/lib/system.src.js"></script>
<script src="/lib/Rx.js"></script>
<script src="/lib/angular2.dev.js"></script>
<script src="/lib/http.dev.js"></script>
```

tslintプラグインを導入してgulpfile.jsを修正する。  
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

package.jsonへ下記追加する。  
```javascript
"scripts": {
  "tslint": "tslint -c tslint.json app/**/*.ts",
}
```

.gitignoreファイルを作成する。  
`type nul > .gitignore`  
```
node_modules/
dest/
```

簡易サーバを導入してgulpfile.jsを修正する。  
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

実装して以下を実行。  
`gulp build`  
`gulp server`  