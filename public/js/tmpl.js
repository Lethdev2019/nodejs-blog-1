Handlebars.registerPartial("blog_basic_details", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row\">\n    <div class=\"col-md-10 col-md-offset-1\">\n        <form id=\"blogBasicDetails\" class=\"blog_basic_details_form\">\n            <div class=\"form-group\">\n                <label>\n                    URL:\n                </label>\n                <input type=\"text\" class=\"form-control j_url required\">\n            </div>\n            <div class=\"form-group\">\n                <label>\n                    Title:\n                </label>\n                <input type=\"text\" class=\"form-control j_title required\">\n            </div>\n            <div class=\"form-group\">\n                <label>\n                    Small Description:\n                </label>\n                <textarea class=\"form-control js_desc required\"></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label>\n                    Cover Image:\n                </label>\n                <input type=\"file\" name=\"filePhoto\" value=\"\" id=\"filePhoto\" class=\"form-control required borrowerImageFile\" data-errormsg=\"PhotoUploadErrorMsg\">\n                <img id=\"previewHolder\" alt=\"Uploaded Image Preview Holder\" width=\"250px\" height=\"250px\" class=\"hide\"/>\n            </div>\n            <div class=\"form-group js_server_error hide\">\n                <label>&nbsp;</label>\n                <div class=\"server_error_msg js_error\"></div>\n            </div>\n        </form>\n    </div>\n</div>\n\n";
},"useData":true}));

Handlebars.registerPartial("blog_card", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(container.lambda(depth0, depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"col-sm-6 col-lg-3 col-md-4 "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.blog : depth0)) != null ? stack1.tags : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n    <div class=\"gal-detail thumb\">\n        <a href=\"/blog/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.blog : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" class=\"image-popup\" title=\"\">\n            <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.blog : depth0)) != null ? stack1.cover_img : stack1), depth0))
    + "\" class=\"thumb-img\" alt=\"\">\n        </a>\n        <h4>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.blog : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h4>\n        <p class=\"text-muted\">\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.blog : depth0)) != null ? stack1.small_desc : stack1), depth0))
    + "\n        </p>\n    </div>\n</div>";
},"useData":true}));

Handlebars.registerPartial("popup", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function";

  return "<div class=\"cd-popup is-visible "
    + container.escapeExpression(((helper = (helper = helpers.theme || (depth0 != null ? depth0.theme : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"theme","hash":{},"data":data}) : helper)))
    + "\" role=\"alert\" id=\"windowPopup\">\n    <div class=\"cd-popup-container\">\n        "
    + ((stack1 = ((helper = (helper = helpers.html || (depth0 != null ? depth0.html : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"html","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        <a href=\"#0\" class=\"cd-popup-close\">\n            <i class=\"tr_icon tr_icon--close_icon icon cd-popup-close-icon\"></i>\n        </a>\n    </div>\n</div>";
},"useData":true}));