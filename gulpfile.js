const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const webpack = require('webpack-stream');
const fs = require('fs');

// 1. Bundle JS using Webpack
function bundleJS() {
    return gulp.src('src/main.js')
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'bundle.js',
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest('dist/temp'));
}

// Note: We didn't install babel-loader/core/preset-env, so let's simplify webpack config to just bundling without transpilation for now, 
// as modern browsers support classes/const/let.
// Revised bundleJS without babel:
function bundleJSSimple() {
    return gulp.src('src/main.js')
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'bundle.js',
            },
        }))
        .pipe(gulp.dest('dist/temp'));
}


// 2. Minify CSS
function processCSS() {
    return gulp.src('style.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/temp'));
}

// 3. Inline everything into HTML
function inlineAssets() {
    return gulp.src('index.html')
        // Replace CSS link with style tag containing content
        .pipe(replace('<link rel="stylesheet" href="style.css">', function(s) {
            const style = fs.readFileSync('dist/temp/style.css', 'utf8');
            return '<style>' + style + '</style>';
        }))
        // Replace JS script module with script tag containing content
        .pipe(replace('<script type="module" src="src/main.js"></script>', function(s) {
            const script = fs.readFileSync('dist/temp/bundle.js', 'utf8');
            return '<script>' + script + '</script>';
        }))
        .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
        .pipe(gulp.dest('dist'));
}

// 4. Clean temp files (optional, but good for hygiene)
// Skipping explicit clean task to keep it simple, files in dist/temp are harmless.

exports.default = gulp.series(
    gulp.parallel(bundleJSSimple, processCSS),
    inlineAssets
);
