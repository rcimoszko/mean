'use strict';

angular.module('fu').controller('PressController', ['$scope',
    function($scope) {

        $scope.press = [
            { show:false },
            { show:false },
            { show:false },
            { show:false },
            { show:false },
            { show:false }
        ];
    }
]);