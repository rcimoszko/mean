'use strict';

angular.module('fu.admin').controller('AdminListSportsController', ['$scope', 'Sports',
    function ($scope, Sports) {
        Sports.getAll()
    }
]);
