import Backbone from "backbone";
import $ from "jquery";

var Router = Backbone.Router.extend({
  routes: {
    "": "index",
    "index": "index",
    "second": "second",
    ":action": "second"
  },

  index() {
    $("body").show();
  },

  second() {
    $("body").hide();
  }
});

export default Router;
