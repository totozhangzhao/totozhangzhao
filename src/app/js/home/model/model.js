import Backbone from "backbone";
import homeUrl from "app/js/data/home.js";

var Model = Backbone.Model.extend({
  defaults() {
    return {
      "url": homeUrl
    };
  },

  initialize() {}
});

export default Model;
