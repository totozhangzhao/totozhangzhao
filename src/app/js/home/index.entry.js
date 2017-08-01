import $ from "jquery";
import Backbone from "backbone";
import Swipe from "com/lib/swipe/swipe.js";
import bannerTpl from "app/tpl/home/banner.tpl";
import HomeBarTpl from "app/tpl/home/home-bar.tpl";
import HomeBottomTpl from "app/tpl/home/bottom.tpl";
import Model from "app/js/home/model/model.js";
import openPage from "app/js/util/common.js";
import Router from "app/js/home/router/router.js";


var route = new Router();
Backbone.history.start();

var model = new Model();
const Url = model.get("url");

var AppView = Backbone.View.extend({
  el: "#home",

  events: {
    "click .switch": "switch"
  },

  initialize() {
    this.render();
  },

  switch() {
    route.navigate("second", {trigger: true});
  },

  render() {
    $(".home-bottom-nav").html(HomeBottomTpl);
    $(".common-banner-bar").html(bannerTpl({Url: Url}));
    $(".home-bar").html(HomeBarTpl);
    this.loadSwipe();
    openPage();
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

