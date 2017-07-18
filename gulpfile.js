/**
 *
 * gulp
 *
 * webpack
 *
 */

const gulp           = require("gulp");
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer   = require("autoprefixer");
const cssnano        = require("cssnano");
const del            = require("del");
const runSequence    = require("run-sequence");
const webpackBuilder = require("./builder/webpack/build.js");
const pxtorem      = require("postcss-pxtorem");

const browserSync = require('browser-sync');
const proxyMiddleware = require('http-proxy-middleware');

const $ = gulpLoadPlugins();

const config = {
  src : "./src/",
  dest: "./dest/"
};

const lessFile = [
  config.src + "app/styles/global.less",
  config.src + "app/styles/index.less",
];

// HTML
gulp.task("html", function() {

  // empty - do not remove empty attributes
  // cdata - do not strip CDATA from scripts
  // comments - do not remove comments
  // conditionals - do not remove conditional internet explorer comments
  // spare - do not remove redundant attributes
  // quotes - do not remove arbitrary quotes
  // loose - preserve one whitespace
  var options = {
    empty : true,
    cdata : true,
    spare : true,
    quotes: true
  };

  return gulp.src(config.src + "**/*.html")
    .pipe($.minifyHtml(options))
    .pipe(gulp.dest(config.dest));
});

// Styles
gulp.task("styles", function() {
  var processors = [
    pxtorem({
      rootValue: 37.5,
      propWhiteList: [],
      selectorBlackList: [],
      minPixelValue: 2
    }),
    autoprefixer(),
    cssnano()
  ];
  return gulp.src(lessFile)
    .pipe($.less())
    .pipe($.postcss(processors))
    .pipe(gulp.dest(config.dest + "app/styles/"));
});

// Images
gulp.task("images", function() {
  return gulp.src(config.src + "**/*.+(jpg|jpeg|png|gif)")
    .pipe(gulp.dest(config.dest));
});

// font
gulp.task("font", function () {
  return gulp.src(config.src + "**/*.{eot,otf,svg,ttf,woff,woff2}")
    .pipe(gulp.dest(config.dest));
})

gulp.task("js:watch", function(cb) {
  return webpackBuilder(require("./webpack.config"), {
    watch: true
  }, cb);
});

gulp.task("js:bundle", function(cb) {
  return webpackBuilder(require("./webpack.config"), {
    build: true
  }, cb);
});

gulp.task("rev", function (cb) {
  return gulp.src([config.dest + "**/*.bundle.js", config.dest + "**/*.css"])
    .pipe($.rev())
    .pipe(gulp.dest(config.dest))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(config.dest));
});

gulp.task("rev:replace", ["rev"], function () {
  var manifest = gulp.src(config.dest + "rev-manifest.json");
  return gulp.src(config.dest + "**/*.html")
    .pipe($.revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest(config.dest));
});

// Clean
gulp.task("clean", function(cb) {
  del([config.dest])
    .then(function() {
      cb();
    });
});

// Compress
gulp.task("compress", function() {
  return gulp.src("")
    .pipe($.shell([
      "tar -czf ~/Downloads/dest-" +
        Date.now() + "-" +
        "`git branch | sed -n -e 's/^\\* \\(.*\\)/\\1/p' | sed 's%/%-%g'`" +
         ".tgz" +
         " " + config.dest,
      "open ~/Downloads/"
    ]));
});

gulp.task("static", function(callback) {
  runSequence(["html", "styles", "images", "font"], callback);
});

gulp.task("build", ["clean"], function(callback) {
  runSequence("static", "js:bundle", "rev:replace", "compress", "html", callback);
});

// Watch Static
gulp.task("ws", ["static"], function() {

  // HTML
  gulp.watch(config.src + "**/*.html", ["html", browserSync.reload]);

  // CSS
  // gulp.watch(config.src + "**/*.css", ["styles"]);
  gulp.watch(config.src + "**/*.css", function (event) {
    if(event.type === "changed") {
      runSequence("styles", function () {
        browserSync.reload(event.path);
      })
    }
  })

  // Images
  gulp.watch(config.src + "**/*.+(jpg|jpeg|png|gif)", ["images", browserSync.reload]);
});

// Watch
gulp.task("watch", ["clean"], function (callback) {
  runSequence("ws", "js:watch", callback);
});

// 开发环境
gulp.task("serve",["clean"], function (callback) {
  runSequence("ws", "js:watch", function () {
    browserSyncInit();
    callback();
  });
  
});

function browserSyncInit(browser) {
  browser = browser === undefined ? 'default' : browser;
  var routes = {
    '/': 'dest'
  };
  var server = {
    baseDir: config.dest,
    routes: routes
  }
  server.middleware = proxyMiddleware('/bmall/rest', {
    target: 'http://47.93.60.19:8080',
    // changeOrigin: true
    // router: {
    //     // override target 'localhost:3001' to 'http://localhost'
    //     'localhost:8888' : 'http://localhost'
    // }
    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        /**
         * product,beta 生产环境
         * test 测试环境
         * @type {[type]}
         */
        'test.mall.rsscc.cn:8888' : 'http://47.93.60.19:8080',
        'test.hbmall.rsscc.cn:8888' : 'http://47.93.60.19:8080',
        'testmall.rsscc.cn:8888': 'http://47.93.60.19:8080',
        'testhbmall.rsscc.cn:8888': 'http://47.93.60.19:8080',
        'betamall.rsscc.cn:8888': 'http://123.56.6.254:8080',
        'betahbmall.rsscc.cn:8888': 'http://123.56.6.254:8080',
        'product.mall.rsscc.cn:8888' : 'http://123.56.6.254:8080',
        'product.hbmall.rsscc.cn:8888' : 'http://123.56.6.254:8080'
    }
  });

  browserSync.instance = browserSync.init({
    port: 8888,
    ui: {
      port: 9999
    },
    startPath: '/app/index.html',
    server: server,
    browser: browser
  });
}
