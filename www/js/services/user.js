/**
 * Created by greg on 19/06/16.
 */
angular.module('starter.services.user', ['firebase'])
    .factory('User', function($q, $firebaseAuth, $firebaseObject, $localStorage, Promise, Storage) {

        var USERS_IMAGES_PATH = 'images/users';
        var JPG_EXTENSION = '.jpg';
        var USER_DB_PATH = 'user';

        var auth = $firebaseAuth();

        var userInfos = null;

        var user = null;

        function setUser(firebaseUser) {
            user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email
            }

            $localStorage.user = user;
        }

        function getUser() {
            if (user != null) {
                return user;
            }

            if ($localStorage.user != null) {
                user = $localStorage.user;
            }

            return user;
        }

        function getUserInfos() {
            if (!isUserLoggedIn()) {
                throw new Error('User is not logged in.');
            }

            if (userInfos == null) {
                userInfos = $firebaseObject(
                    firebase
                        .database()
                        .ref()
                        .child(USER_DB_PATH)
                        .child(user.uid));
            }

            return userInfos;
        }

        function isUserLoggedIn() {
            return getUser() != null;
        }

        return {

            getUser: getUser,

            getUserInfos: getUserInfos,

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

                try {
                    auth
                        .$signInWithEmailAndPassword(name, pw)
                        .then(
                            function(firebaseUser) {
                                setUser(firebaseUser);
                                deferred.resolve(user);
                            }
                        ).catch(
                        function(error) {
                            deferred.reject(error);
                        }
                    );
                } catch (error) {
                    deferred.reject(error);
                }

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
                $localStorage.user = null;
            }
        }
    });