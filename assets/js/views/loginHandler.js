var ApiUtil = require('../util/apiUtil');
var FormValidator = require('../util/formValidator');

function LoginPage() {

    function postLogin(obj) {
        var callback = function (data) {
            var formEle = $('#jsForm');
            if (data && data.hasOwnProperty('name')) {
                window.location.href = '/';
            } else {
                formEle.find('.js_server_error').removeClass('hide');
                formEle.find('.js_server_error_msg').html(data.msg);
            }
        };
        ApiUtil.makeAjaxRequest('/api/user/login', '', 'POST', '', obj, callback);
    }

    function postSignUp(obj) {
        var callback = function (data) {
            var formEle = $('#jsSignUpForm');
            if (!data.err) {
                window.location.href = '/';
            } else {
                formEle.find('.js_server_error').removeClass('hide');
                formEle.find('.js_server_error_msg').html(data.msg);
            }
        };
        ApiUtil.makeAjaxRequest('/api/user/register', '', 'POST', '', obj, callback);
    }

    return {
        init: function () {
            $('.js_user_password').on('keypress', function (e) {
                var code = event.keyCode ? event.keyCode : event.which;
                if (code === 13) {
                    e.preventDefault();
                    if (FormValidator.validateForm('#jsLoginForm')) {
                        var obj = {
                            username: $('.js_user_name').val(),
                            password: $('.js_user_password').val()
                        };
                        postLogin(obj);
                    }
                    return false;
                }
            });
            $('#jsLoginForm').submit(function (e) {
                e.preventDefault();
                if (FormValidator.validateForm('#jsLoginForm')) {
                    var obj = {
                        username: $('.js_user_name').val(),
                        password: $('.js_user_password').val()
                    };
                    postLogin(obj);
                }
                return false;
            });

        },
        initSignUp: function () {
            $('#jsSignUpForm').submit(function (e) {
                e.preventDefault();
                if (FormValidator.validateForm('#jsSignUpForm')) {
                    var obj = {
                        name: $('.js_user_name').val(),
                        email: $('.js_user_email').val(),
                        password: $('.js_user_password').val()
                    };
                    postSignUp(obj);
                }
                return false;
            });
        }
    }
}

module.exports = LoginPage();
