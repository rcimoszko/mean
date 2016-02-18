'use strict';

angular.module('fu').directive('uploadProfilePicture', function() {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/upload-profile-picture.client.template.html',
        controller: ['$scope', '$http', 'Authentication', function($scope, $http, Authentication) {
            //$scope.profileImage = '../../modules/users/img/signup/profile.png';

            $scope.profileUrl = 'http://res.cloudinary.com/hltkmtrz5/image/upload/v1408811714/profile-add.png';

            if(Authentication.user.profileUrl.indexOf('profile-default.png') === -1){
                $scope.profileUrl = Authentication.user.profileUrl;
            }

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.openUpload = function () {
                FileUpload.click();
            };

            $scope.uploadFile = function(files) {
                var file = files[0];
                var ext = file.name.split('.');
                ext = ext[ext.length-1].toLowerCase();
                switch(ext){
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                    case 'png':
                        $scope.invalidImageType = false;
                        var fd = new FormData();
                        fd.append('file', files[0]);
                        $http.post('/api/profileupload', fd, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        })
                            .success(function(response){
                                Authentication.user = response;
                                $scope.profileUrl = Authentication.user.profileUrl;
                            })
                            .error(function(response){
                                console.log('error');
                            });
                        break;
                    default:
                        $scope.invalidImageType = true;
                        return;
                }
            };
        }]
    };
});
