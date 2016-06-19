/**
 * Created by greg on 19/06/16.
 */
angular.module('starter.services.user', ['firebase'])
    .factory('User', function($q, $firebaseAuth, $localStorage, Promise, Storage) {

        var USERS_IMAGES_PATH = 'images/users';
        var JPG_EXTENSION = '.jpg';

        var auth = $firebaseAuth();

        var user = null;

        function getUser() {
            if (user != null) {
                return user;
            }

            if ($localStorage.user != null) {
                user = $localStorage.user;
            }

            return user;
        }

        function isUserLoggedIn() {
            return getUser() != null;
        }

        return {

            getUser: getUser,

            isUserLoggedIn: isUserLoggedIn,

            register: function(name, pw) {
                var deferred = Promise.getNewPromise();

                auth
                    .$createUserWithEmailAndPassword(name, pw)
                    .then(
                        function(firebaseUser) {
                            deferred.resolve(
                                {
                                    message : "User " + firebaseUser.email + " created successfully!"
                                }
                            );
                        }
                    )
                    .catch(
                        function(error) {
                            deferred.reject(error);
                        }
                    );

                return deferred.promise;
            },

            login: function(name, pw) {
                var deferred = Promise.getNewPromise();

                auth
                    .$signInWithEmailAndPassword(name, pw)
                    .then(
                        function(firebaseUser) {
                            user = {
                                uid: firebaseUser.uid,
                                email: firebaseUser.email
                            }

                            $localStorage.user = user;

                            deferred.resolve(user);
                        }
                    ).catch(
                        function(error) {
                            deferred.reject('Wrong credentials');
                        }
                    );

                return deferred.promise;
            },

            getUserImageUrl: function () {
                if (!isUserLoggedIn()) {
                    throw new Error('User is not logged in.');
                }

                return Storage.getDownloadUrl(USERS_IMAGES_PATH, user.uid + JPG_EXTENSION)
            },

            uploadUserImage: function (imageBlob) {
                if (!isUserLoggedIn()) {
                    throw new Error('User is not logged in.');
                }

                return Storage.uploadFile(USERS_IMAGES_PATH, user.uid + JPG_EXTENSION, imageBlob);
            },

            logout: function() {
                auth.$signOut();
                user = null;
                $localStorage.user = null;
            }
        }
    });