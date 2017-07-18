import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import Swipe from "com/lib/swipe/swipe.js";
import bannerTpl from "app/tpl/home/banner.tpl";
import Model from "app/js/home/model/model.js";

var model = new Model();
const Url = model.get("url");

$("body").css({"background": "#fff"});

_.each([1,2,3,4],function(index, item) {
  window.console.log(index + " : " + item);
});

var AppView = Backbone.View.extend({
  el: "#home",

  events: {
    "click #banner-box": "startone"
  },

  initialize() {
    this.render();
    this.loadSwipe();
  },

  render() {
    $(".common-banner-bar").html(bannerTpl({Url: Url}));
  },

  startone() {
    window.console.log(1);
  },

  loadSwipe() {
    const $SwipeBox = $("#banner-box", this.$el);
    const $index    = $("#banner-index>i", this.$el);
    new Swipe($SwipeBox.get(0), {
      startSlide: 0,
      speed: 600,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback(index) {
        index = Swipe.fixIndex(index, $index.length);
        $index
          .removeClass("active")
            .eq(index)
            .addClass("active");
      },
      transitionEnd() {}
    });
  }
});

new AppView();
