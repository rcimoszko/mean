'use strict';

angular.module('fu').factory('Follow', ['Authentication', 'ApiUsersFollow', 'ApiUsersUnfollow', 'User', '$filter',
    function(Authentication, ApiUsersFollow, ApiUsersUnfollow, User, $filter) {

        var follow = function(userId){
            function cbSuccess(follow){
                User.info.following.push(follow);
            }

            function cbError(response){
                console.log(response);
            }

            ApiUsersFollow.save({userId:userId}, cbSuccess, cbError);
        };

        var unfollow = function(userId){

            function cbSuccess(follow){
                var found = $filter('filter')(User.info.following, {_id: userId});
                if(found.length){
                    User.info.following.splice(User.info.following.indexOf(found[0]), 1);
                }
            }

            function cbError(response){
                console.log(response);
            }

            ApiUsersUnfollow.save({userId:userId}, cbSuccess, cbError);
        };



        return {
            follow: follow,
            unfollow: unfollow
        };

    }
]);