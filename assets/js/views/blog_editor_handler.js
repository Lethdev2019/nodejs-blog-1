var apiUtils = require('../util/apiUtil');
var formValidator = require('../util/formValidator');
var async = require('async');

function BlogEditor() {

    function submitBlog(_form_error, _obj) {
        var _blog_id = $('.js_blog_id').val();
        var _callback = function (data) {
            if (!data.err) {
                window.location.href = '/blogs';
            } else {
                _form_error.removeClass('hide');
                _form_error.find('.js_error').html(data.msg);
            }
        };

        if (_blog_id) {
            apiUtils.makeAjaxRequest('/api/update/blog/' + _blog_id, '', 'POST', '', _obj, _callback)
        } else {
            apiUtils.makeAjaxRequest('/api/blog/upload', '', 'POST', '', _obj, _callback)
        }
    }

    function blogFormEvents() {
        $('.js_desc').textcounter({
            max: 140,
            countDown: true,
        });
        $("#filePhoto").change(function () {
            readURL(this);
        });
        $('#blogBasicDetails').submit(function (e) {
            e.preventDefault();
            var _form = $('#blogBasicDetails');
            var _form_error = $('.js_server_error');
            var cover_img = $('#previewHolder');
            var dataString = cover_img.attr('src');
            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

            if (formValidator.validateForm('#blogBasicDetails')) {
                $('.medium-insert-buttons').remove();
                var _img_obj = {
                    src: dataString
                };
                var _obj = {
                    url: _form.find('.j_url').val(),
                    title: _form.find('.j_title').val(),
                    desc: $('.medium-editor-element').html(),
                    small_desc: _form.find('.js_desc').val(),
                    cover_img: '',
                    tags: _form.find('.js_page_tags').val(),
                    meta_keywords: _form.find('.js_meta_keywords').val(),
                };

                if (matches && matches.length === 3) {
                    var _img_callback = function (data) {
                        if (!data.err) {
                            _obj.cover_img = data.data.path;
                        }
                        submitBlog(_form_error, _obj);
                    };
                    apiUtils.makeAjaxRequest('/api/blog/image-upload', '', 'POST', '', _img_obj, _img_callback);
                } else {
                    _obj.cover_img = dataString;
                    submitBlog(_form_error, _obj);
                }
            }
        });

        $('.js_close_drawer').off('click').on('click', function () {
            $('.js_blog_form_sec').toggleClass('inactive');
        });
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#previewHolder').removeClass('hide').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }


    function clickNewBlogEvents() {
        $('.js_publish_blog').on('click', function () {
            var _eleArr = $('.medium-editor-element').find('figure img');
            async.forEachOf(_eleArr, function (value, key, callback) {
                var _this = value;
                var dataString = value.src;
                var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (value.src && matches && matches.length === 3) {
                    var _obj = {
                        src: value.src
                    };
                    var _callback = function (data) {
                        if (!data.err) {
                            _this.src = data.data.path;
                        }
                        callback(null, []);
                    };
                    apiUtils.makeAjaxRequest('/api/blog/image-upload', '', 'POST', '', _obj, _callback)
                } else {
                    callback(null, []);
                }
            }, function (err, results) {
                $('#blogBasicDetails').submit();
            });
        });

    }

    function initEditor() {
        var title = new MediumEditor('.title', {
            placeholder: {
                /* This example includes the default options for placeholder,
                   if nothing is passed this is what it used */
                text: 'Star writing your blog here',
                hideOnClick: false
            },
            toolbar: {
                /* These are the default options for the toolbar,
                   if nothing is passed this is what is used */
                allowMultiParagraphSelection: true,
                buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'h4', 'quote', 'orderedlist', 'unorderedlist'],
                diffLeft: 0,
                diffTop: -10,
                firstButtonClass: 'medium-editor-button-first',
                lastButtonClass: 'medium-editor-button-last',
                relativeContainer: null,
                standardizeSelectionStart: false,
                static: false,

                /* options which only apply when static is true */
                align: 'center',
                sticky: false,
                updateOnEmptySelection: false
            }
        });
        $('.title').mediumInsert({
            editor: title,
            addons: {
                images: {
                    uploadScript: null,
                    deleteScript: null,
                    captionPlaceholder: 'Type caption for image',
                    styles: {
                        slideshow: {
                            label: '<span class="fa fa-play"></span>',
                            added: function ($el) {
                                $el
                                    .data('cycle-center-vert', true)
                                    .cycle({
                                        slides: 'figure'
                                    });
                            },
                            removed: function ($el) {
                                $el.cycle('destroy');
                            }
                        }
                    },
                    actions: null
                }
            }
        });
    }

    return {
        init: function () {
            clickNewBlogEvents();
            blogFormEvents();
            initEditor();

            $(".js_tags").select2({
                tags: true
            })
        },
        initEdit: function () {
            clickNewBlogEvents();
            blogFormEvents();
            initEditor();

            $(".js_tags").select2({
                tags: true
            })
        }
    }
}

module.exports = BlogEditor();