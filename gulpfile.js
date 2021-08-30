const { src, dest, watch, series, parallel } = require("gulp");
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const browserSync = require("browser-sync");

const ejs = require("gulp-ejs");


const srcPath = {
    css: 'src/sass/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/images/**/*',
    html: 'src/ejs/*.ejs',
    // html: ["./src/ejs/**/*.ejs", "!" + "./src/ejs/**/_*.ejs"],
    php: './**/*.php',
}
const destPath = {
    css: 'assets/css/',
    js: 'assets/js/',
    img: 'assets/images/',
    html: './'
}
const browsers = [
    'last 2 versions',
    '> 5%',
    'ie = 11',
    'not ie <= 10',
    'ios >= 8',
    'and_chr >= 5',
    'Android >= 5',
]
const browserSyncOption = {
  server: "./"
}
const cssSass = () => {
    return src(srcPath.css)
        .pipe(sourcemaps.init())
        .pipe(
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>')
            }))
        .pipe(sassGlob())
        .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
        .pipe(postcss([cssnext(browsers)]))
        .pipe(dest(destPath.css))
        .pipe(notify({
            message: 'Sassをコンパイルしました！',
            onLast: true
        }))
}

//EJS(テンプレートエンジン)
const htmlEjs = () => {
    return src(srcPath.html)
    // return src(srcPath.html,'!src/ejs/_**/_*.ejs')
        .pipe(
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>')
            }))
        .pipe(ejs())
        .pipe(rename({extname: ".html"})) //拡張子をhtmlに
        .pipe(dest(destPath.html)) //出力先
        .pipe(notify({
            message: 'ejsをコンパイルしました！',
            onLast: true
        }))
}

const jsBabel = () => {
    return src(srcPath.js)
        .pipe(
            plumber(
                {
                    errorHandler: notify.onError('Error: <%= error.message %>')
                }
            )
        )
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest(destPath.js))
        .pipe(uglify())
        .pipe(
            rename(
                { extname: '.min.js' }
            )
        )
        .pipe(dest(destPath.js))
}
const imgImagemin = () => {
    return src(srcPath.img)
        .pipe(
            imagemin(
                [
                    imageminMozjpeg({
                        quality: 80
                    }),
                    imageminPngquant(),
                    imageminSvgo({
                        plugins: [
                            {
                                removeViewbox: false
                            }
                        ]
                    })
                ],
                {
                    verbose: true
                }
            )
        )
        .pipe(dest(destPath.img))
}
const browserSyncFunc = () => {
    browserSync.init(browserSyncOption);
}
const browserSyncReload = (done) => {
    browserSync.reload();
    done();
}
const watchFiles = () => {
    watch(srcPath.css, series(cssSass, browserSyncReload))
    watch(srcPath.js, series(jsBabel, browserSyncReload))
    watch(srcPath.img, series(imgImagemin, browserSyncReload))
    watch(srcPath.html, series(htmlEjs, browserSyncReload))
    watch(srcPath.php, series(browserSyncReload))
}
exports.default = series(series(cssSass, jsBabel, imgImagemin, htmlEjs), parallel(watchFiles, browserSyncFunc));
exports.build = series(cssSass, jsBabel, imgImagemin, htmlEjs);




