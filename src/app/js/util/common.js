import $ from "jquery";
import _ from "lodash";

var openPage = () => {
  $(".js-open").on("click", _.debounce((e) => {
    window.location.href = $(e.currentTarget).data("href");
  }, 50));
};

export default openPage;

