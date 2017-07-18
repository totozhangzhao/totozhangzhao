webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _backbone = __webpack_require__(2);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = _backbone2.default.Model.extend({
  defaults: function defaults() {
    return {
      "url": [{
        "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1500257634359-5034920.JPG",
        "url": "http://www.baidu.com"
      }, {
        "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1499740574117-719-A1-banner.jpg",
        "url": "http://www.sohu.com"
      }, {
        "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1499913333899-0713xingnan_20170713103338.jpg",
        "url": "http://amap.com"
      }]
    };
  }
});

exports.default = Model;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0);
module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="banner-box" class="common-banner-wrapper">\n  <ul class="common-banner-area clearfix">\n    ';
 _.each(Url, function(item, index) {  ;
__p += '\n    <li class="common-banner-pic fl">\n      <a href="' +
((__t = ( item.url )) == null ? '' : __t) +
'">\n        <img src="' +
((__t = ( item.img )) == null ? '' : __t) +
'" class="goods-img" alt="">\n      </a>\n    </li>\n    ';
 }) ;
__p += '\n  </ul>\n</div>\n<div id="banner-index" class="common-banner-indexs">\n  ';
 _.each(Url, function(item, index) { ;
__p += '\n    <i class="' +
((__t = ( index === 0 ? "active" : "" )) == null ? '' : __t) +
' "></i>\n  ';
 }); ;
__p += '\n</div>\n';

}
return __p
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function Swipe(container, options) {

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) {
    setTimeout(fn || noop, 0);
  }; // offload a functions execution

  var rootFontSize = parseFloat(document.documentElement.style.fontSize);

  function toRem(px, reset) {
    if (reset) {
      rootFontSize = parseFloat(document.documentElement.style.fontSize);
    }
    return px / rootFontSize;
  }

  // quit if no root element
  if (!container) {
    return;
  }

  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;
  
  function translate(index, dist, speed) {
    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration =
      style.MozTransitionDuration =
      style.msTransitionDuration =
      style.OTransitionDuration =
      style.transitionDuration = speed + "ms";

    style.webkitTransform = "translate(" + dist + "rem,0)" + "translateZ(0)";
    style.transform       = "translate(" + dist + "rem,0)" + "translateZ(0)";
    style.msTransform    =
      style.MozTransform =
      style.OTransform   = "translateX(" + dist + "rem)";
  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function move(index, dist, speed) {
    translate(index, dist, speed);
    slidePos[index] = dist;
  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;

    var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

    // get the actual position of the slide
    if (options.continuous) {
      var natural_direction = direction;
      direction = -slidePos[circle(to)] / width;

      // if going forward but to < index, use to = slides.length + to
      // if going backward but to > index, use to = -slides.length + to
      if (direction !== natural_direction) to = -direction * slides.length + to;

    }

    var diff = Math.abs(index - to) - 1;

    // move all the slides between index and to in the right direction
    while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

    to = circle(to);

    move(index, width * direction, slideSpeed || speed);
    move(to, 0, slideSpeed || speed);

    if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }


  function prev() {

    if (options.continuous) slide(index - 1);
    else if (index) slide(index - 1);

  }

  function next() {

    if (options.continuous) slide(index + 1);
    else if (index < slides.length - 1) slide(index + 1);

  }


  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }

  function setup(reset) {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = toRem(container.getBoundingClientRect().width || container.offsetWidth, reset);

    // stack elements
    var pos = slides.length;

    while (pos--) {

      var slide = slides[pos];

      slide.style.width = width + "rem";
      slide.setAttribute("data-index", pos);

      move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
    }

    // reposition elements before and after index
    if (options.continuous) {
      move(circle(index - 1), -width, 0);
      move(circle(index + 1), width, 0);
    }

    container.style.visibility = "visible";
  }

  function reset() {
    setup(true);
  }

  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;


  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case "touchstart":
          this.start(event);
          break;
        case "touchmove":
          this.move(event);
          break;
        case "touchend":
          offloadFn(this.end(event));
          break;
        case "webkitTransitionEnd":
        case "msTransitionEnd":
        case "oTransitionEnd":
        case "otransitionend":
        case "transitionend":
          offloadFn(this.transitionEnd(event));
          break;
        case "resize":
          offloadFn(reset);
          break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };

      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener("touchmove", this, false);
      element.addEventListener("touchend", this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1 || event.scale && event.scale !== 1) {
        return;
      }

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };
      delta.x = toRem(delta.x);
      delta.y = toRem(delta.y);

      // determine if scrolling test has run - one time test
      if (typeof isScrolling == "undefined") {
        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don"t add resistance at the end

          translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

        } else {

          delta.x =
            delta.x /
            ((!index && delta.x > 0 // if first slide and sliding left
                || index == slides.length - 1 // or if last slide and sliding right
                && delta.x < 0 // and if sliding at all
              ) ?
              (Math.abs(delta.x) / width + 1) // determine resistance level
              : 1); // no resistance if false

          // translate 1:1
          translate(index - 1, delta.x + slidePos[index - 1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index + 1, delta.x + slidePos[index + 1], 0);
        }

      }

    },
    end: function() {

      // measure duration
      var duration = Date.now() - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
        Number(duration) < 250 // if slide duration is less than 250ms
        && Math.abs(delta.x) * rootFontSize > 20 // and if slide amt is greater than 20px
        || Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds = !index && delta.x > 0 // if first slide and slide amt is greater than 0
        || index == slides.length - 1 && delta.x < 0; // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index - 1), -width, 0);
              move(circle(index + 2), width, 0);

            } else {
              move(index - 1, -width, 0);
            }

            move(index, slidePos[index] - width, speed);
            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
            index = circle(index + 1);

          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index + 1), width, 0);
              move(circle(index - 2), -width, 0);

            } else {
              move(index + 1, width, 0);
            }

            move(index, slidePos[index] + width, speed);
            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
            index = circle(index - 1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index - 1), -width, speed);
            move(index, 0, speed);
            move(circle(index + 1), width, speed);

          } else {

            move(index - 1, -width, speed);
            move(index, 0, speed);
            move(index + 1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener("touchmove", events, false);
      element.removeEventListener("touchend", events, false);

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute("data-index"), 10) == index) {

        if (delay) {
          begin();
        } else {

          // continue to slideshow
          if (options.auto) {
            delay = options.auto;
            begin();
          }
        }

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  };

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();

  // set touchstart event on element
  element.addEventListener("touchstart", events, false);

  element.addEventListener("webkitTransitionEnd", events, false);
  element.addEventListener("msTransitionEnd", events, false);
  element.addEventListener("oTransitionEnd", events, false);
  element.addEventListener("otransitionend", events, false);
  element.addEventListener("transitionend", events, false);

  // set resize event on window
  window.addEventListener("resize", events, false);

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {

      // cancel slideshow
      stop();

      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    stop: function() {

      // cancel slideshow
      stop();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {

      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = "";

      // reset slides
      var pos = slides.length;
      while (pos--) {

        var slide = slides[pos];
        slide.style.width = "";

        translate(pos, 0, 0);
      }

      // remove current event listeners
      element.removeEventListener("touchstart", events, false);
      element.removeEventListener("webkitTransitionEnd", events, false);
      element.removeEventListener("msTransitionEnd", events, false);
      element.removeEventListener("oTransitionEnd", events, false);
      element.removeEventListener("otransitionend", events, false);
      element.removeEventListener("transitionend", events, false);
      window.removeEventListener("resize", events, false);
    }
  };
}

// 当banner数据为两个时，修正index 
// @index 当前索引
// @total banner数据个数
Swipe.fixIndex = function(index, total) {
  if(Number(total) === 2 && index > 1) {
    index -= 2;
  }
  return index;
};

module.exports = Swipe;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(1);

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = __webpack_require__(2);

var _backbone2 = _interopRequireDefault(_backbone);

var _swipe = __webpack_require__(6);

var _swipe2 = _interopRequireDefault(_swipe);

var _banner = __webpack_require__(5);

var _banner2 = _interopRequireDefault(_banner);

var _model = __webpack_require__(4);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var model = new _model2.default();
var Url = model.get("url");

(0, _jquery2.default)("body").css({ "background": "#fff" });

_lodash2.default.each([1, 2, 3, 4], function (index, item) {
  window.console.log(index + " : " + item);
});

var AppView = _backbone2.default.View.extend({
  el: "#home",

  events: {
    "click #banner-box": "startone"
  },

  initialize: function initialize() {
    this.render();
    this.loadSwipe();
  },
  render: function render() {
    (0, _jquery2.default)(".common-banner-bar").html((0, _banner2.default)({ Url: Url }));
  },
  startone: function startone() {
    window.console.log(1);
  },
  loadSwipe: function loadSwipe() {
    var $SwipeBox = (0, _jquery2.default)("#banner-box", this.$el);
    var $index = (0, _jquery2.default)("#banner-index>i", this.$el);
    new _swipe2.default($SwipeBox.get(0), {
      startSlide: 0,
      speed: 600,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function callback(index) {
        index = _swipe2.default.fixIndex(index, $index.length);
        $index.removeClass("active").eq(index).addClass("active");
      },
      transitionEnd: function transitionEnd() {}
    });
  }
});

new AppView();

/***/ })
],[7]);
//# sourceMappingURL=index.bundle.js.map