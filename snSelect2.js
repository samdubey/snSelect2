(function () {
    'use strict';
    var directiveId = 'snSelect2';
    angular.module('app').directive(directiveId, ['datacontext', snSelect2]);

    function snSelect2(datacontext) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                var urlPrefix =datacontext.urlPrefix;
                $(function () {
                    element.select2({
                        placeholder: element.attr('placeholder'),
                        multiple: angular.isDefined(attrs.multiple),
                        minimumInputLength: 3,
                        blurOnChange: true,
                        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                            url: urlPrefix + "/Employees",
                            dataType: 'json',
                            data: function (term) {
                                return {
                                    term: term
                                };
                            },
                            results: function (data) { // parse the results into the format expected by Select2.
                                // since we are using custom formatting functions we do not need to alter remote JSON data
                                return { results: data };
                            }
                        },
                        initSelection: function (element, callback) {
                            var id = scope.$eval(attrs.ngModel);//$(element).val();
                            if (id != "") {
                                $.ajax(urlPrefix + "/EmployeeById",
                                    {
                                        data: {
                                            id: id,
                                            format: 'json'
                                        },
                                        datatype: 'json'
                                    }).done(function (data) {
                                        if (angular.isDefined(attrs.multiple)) {
                                            callback(data);
                                        }
                                        else {
                                            callback(data[0]);
                                        }
                                    });
                            }
                            //var data = {id: element.val(), text: element.val()};
                            //callback(data);
                        },
                        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                        escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                    }).select2('val', scope.$eval(attrs.ngModel))
                        .on("change", function (e) {
                            scope.$apply(function () {
                                controller.$setViewValue(attrs.ngModel);
                            });
                        });
                    element.bind("change", function (e) {
                        scope.$apply(function () {
                            scope[attrs.ngModel] = e.val;
                        });
                    });
                });
            }
        }
    }

})();
