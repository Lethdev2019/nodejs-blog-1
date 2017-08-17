module.exports = {
    validateForm: function (formId) {
        var _this = this;
        var status = true;

        function markError(element, errorMsgId) {
            $(formId).find('.' + errorMsgId).show();
            element.addClass('error');
            status = false;
            return false;
        }

        function unMarkError(element, errorMsgId) {
            $(formId).find('.' + errorMsgId).hide();
            element.removeClass('error');
        }

        function validateFieldType(fieldType, element, elementVal, errorMsgId) {
            if (typeof _this[fieldType] === 'function') {
                return _this[fieldType](elementVal, element) ? unMarkError(element, errorMsgId) : markError(element, errorMsgId);
            }
            return false;
        }

        $(formId + ' .required').each(function () {
            var element = $(this);
            var elementVal = $(this).val();
            var errorMsgId = element.attr('data-errormsg');
            var validateList = element.attr('data-groupname');
            var isElementsNeedValidation = false;

            if (elementVal === '' && !validateList) {
                markError(element, errorMsgId);
                return;
            }

            $.each(_this.getAllFieldsToValidate(), function (index, value) {
                if (element.hasClass(value)) {
                    isElementsNeedValidation = true;
                    validateFieldType(value, element, elementVal, errorMsgId);
                }
            });

            if (!isElementsNeedValidation) {
                unMarkError(element, errorMsgId);
            }
        });
        return status;
    },

    getAllFieldsToValidate: function () {
        return ['isValidEmail', 'isValidMobileNumber', 'isNumber', 'isLengthOk', 'numberInRange', 'isValidResetPassword', 'isEqualTo', 'isCardNo', 'validateList'];
    },

    isNumber: function (input) {
        return !isNaN(input);
    },

    numberInRange: function (input, element) {
        var inputInt = Number(input);
        var min = $(element).data('min');
        var max = $(element).data('max');
        if (!this.isNumber(input)) {
            return false;
        }
        return inputInt >= min && inputInt <= max;
    },

    isLengthOk: function (input, element) {
        var minLength = element.data('minlength');
        var maxLength = element.prop('maxlength');
        return input.length >= minLength && input.length <= maxLength;
    },

    isValidEmail: function (email) {
        var emailRegex = /^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    },

    isValidUserName: function (userName) {
        userName = userName.trim();
        return userName.length >= 4;
    },

    isValidAmount: function (amount) {
        var amountRegex = /^[1-9]\d+$/;
        return amountRegex.test(amount);
    },

    isValidMobileNumber: function (mobileNumber) {
        var mobileNumberTrimmed = mobileNumber.trim();
        var minlength = 10;
        var specialCharRegex = /^[\w{./\\(),'}:?®©-]+$/;
        var isValidNumber = mobileNumberTrimmed > 0;
        var hasSpecialChars = specialCharRegex.test(mobileNumberTrimmed);
        var isSatisfyLenth = mobileNumberTrimmed.length >= minlength;
        return (isValidNumber && hasSpecialChars && isSatisfyLenth);
    },

    isEqualTo: function (password, element) {
        var equalField = element.data('equalto');
        return $(equalField).val() === password;
    },

    isCardNo: function (input, element) {
        var inputEdited = input.replace(/ /g, '');
        var minLength = element.data('minlength');
        var maxLength = element.prop('maxlength');
        return inputEdited.length >= minLength && inputEdited.length <= maxLength;
    },

    validateList: function (input, element) {
        var groupName = element.data('groupname');
        var status = false;
        $('[name="' + groupName + '"]').each(function () {
            if ($(this).is(':checked')) {
                status = true;
                return;
            }
        });
        return status;
    }
};
