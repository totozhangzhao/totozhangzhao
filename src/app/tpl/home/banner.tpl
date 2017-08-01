<div id="banner-box" class="common-banner-wrapper">
  <ul class="common-banner-area clearfix">
    <% _.each(Url, function(item, index) {  %>
    <li class="common-banner-pic fl">
      <a data-href="<%= item.url %>" class="js-open">
        <img src="<%= item.img %>" class="goods-img" alt="">
      </a>
    </li>
    <% }) %>
  </ul>
</div>
<div id="banner-index" class="common-banner-indexs">
  <% _.each(Url, function(item, index) { %>
    <i class="<%= index === 0 ? "active" : "" %> "></i>
  <% }); %>
</div>
