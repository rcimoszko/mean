'use strict';

angular.module('fu').factory('Modal', [ '$modal',
    function($modal) {
        var showModal = function (template, controllerName, resolveData, size) {
            if(!size){
                size = 'sm';
            }
            var modalInstance = $modal.open({
                templateUrl: template,
                size: size,
                controller: controllerName,
                backdrop: true,
                resolve: resolveData
            });
            return modalInstance;


        };

        var closeModal = function(modalInstance){
            modalInstance.dismiss();
        };

        return{
            showModal: showModal,
            closeModal: closeModal
        };
    }
]);