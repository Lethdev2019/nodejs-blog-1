function PopupPage() {

    function bindClickEvents() {
        //open popup
        $('.cd-popup-trigger').off('click').on('click', function (event) {
            event.preventDefault();
            $('body').addClass('popup-visible');
            $('.cd-popup').addClass('is-visible');
        });

        //close popup
        $('.cd-popup').off('click').on('click', function (event) {
            if ($(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup-close-icon') || $(event.target).is('.cd-popup')) {
                event.preventDefault();
                $('body').removeClass('popup-visible');
                $(this).removeClass('is-visible');
            }
        });

        //close popup when clicking the esc keyboard button
        $(document).keyup(function (event) {
            if (event.which == '27') {
                $('body').removeClass('popup-visible');
                $('.cd-popup').removeClass('is-visible');
            }
        });
    }

    return {
        init: function (html, theme, cb) {
            $("#windowPopup").remove();
            var tmpl = Handlebars.partials['popup'];
            $('body').append(tmpl({html: html, theme: theme}));
            bindClickEvents();
            if (cb) {
                cb();
            }
        },
        close: function () {
            $("#windowPopup").remove();
        }
    }
}

module.exports = PopupPage();
