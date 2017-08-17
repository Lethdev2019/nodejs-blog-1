var ApiUtil = require('../util/apiUtil');
var FormValidator = require('../util/formValidator');

function FeaturedBlogPage() {

    function postData(obj) {
        var callback = function (data) {
            var formEle = $('#jsForm');
            if (!data.err) {
                window.location.href = '/view/featured-blog';
            } else {
                formEle.find('.js_server_error').removeClass('hide');
                formEle.find('.js_server_error_msg').html(data.msg);
            }
        };
        ApiUtil.makeAjaxRequest('/api/post/featured-blog', '', 'POST', '', obj, callback);
    }

    function updateData(obj,_id) {
        var callback = function (data) {
            var formEle = $('#jsForm');
            if (!data.err) {
                window.location.href = '/view/featured-blog';
            } else {
                formEle.find('.js_server_error').removeClass('hide');
                formEle.find('.js_server_error_msg').html(data.msg);
            }
        };
        ApiUtil.makeAjaxRequest('/api/post/featured-blog/update/' + _id, '', 'POST', '', obj, callback);
    }

    return {
        init: function () {
            $('#jsForm').submit(function (e) {
                e.preventDefault();

                if (FormValidator.validateForm('#jsForm')) {
                    var obj = {
                        title: $('.js_heading').val(),
                        blogs: $('.js_blogs').val(),
                    };
                    postData(obj);
                }
                return false;
            });

            $('.js_new_tag').on('click', function () {
                $('.js_new_tag_sec_wrap').append('<input type="text" class="form-control js_tag"><br/>')
            });

            $('.js_new_gallery').on('click', function () {
                $('.js_new_gallery_image_sec_wrap').append('<input type="text" class="form-control js_gallery_img"><br/>')
            });
            $(".js_blogs").select2({
                tags: true
            })
        },
        initEditForm: function () {
            $('#jsForm').submit(function (e) {
                e.preventDefault();

                if (FormValidator.validateForm('#jsForm')) {
                    var obj = {
                        title: $('.js_heading').val(),
                        blogs: $('.js_blogs').val(),
                    };
                    updateData(obj,$('.js_id').val());
                }
                return false;
            });

            $('.js_new_tag').on('click', function () {
                $('.js_new_tag_sec_wrap').append('<input type="text" class="form-control js_tag"><br/>')
            });

            $('.js_new_gallery').on('click', function () {
                $('.js_new_gallery_image_sec_wrap').append('<input type="text" class="form-control js_gallery_img"><br/>')
            });
            $(".js_blogs").select2({
                tags: true
            })
        }
    }
}

module.exports = FeaturedBlogPage();
