import Backbone from "backbone";

var Model = Backbone.Model.extend({
  defaults() {
    return {
      "url": [
        {
          "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1500257634359-5034920.JPG",
          "url": "http://www.baidu.com"
        },
        {
          "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1499740574117-719-A1-banner.jpg",
          "url": "http://www.sohu.com"
        },
        {
          "img": "https://cdn.rsscc.cn/guanggao/cmsimg/content-1499913333899-0713xingnan_20170713103338.jpg",
          "url": "http://amap.com"
        }
      ]
    };
  }
});

export default Model;
