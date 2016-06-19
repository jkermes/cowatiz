angular.module('starter.services.camera', [])
    .factory('Camera', function(Promise, $cordovaCamera, $cordovaFile, $ionicPlatform) {

        var OPTIONS;

        $ionicPlatform.ready(function () {
            OPTIONS = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 800,
                targetHeight: 800,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: false
            };
        });

        var MIME_IMAGE_JPEG = "image/jpeg";

        function getFileName(uri) {
            return uri.substring(uri.lastIndexOf('/') + 1);
        }

        function getPath(uri) {
            var path = uri.split('/');
            path.pop();
            return path.join('/');
        }

        return {

            getPictureAsBlob : function () {

                var deferred = Promise.getNewPromise();

                $cordovaCamera.getPicture(OPTIONS).then(function(uri) {
                    var filename = getFileName(uri);
                    var path = getPath(uri);

                    $cordovaFile.readAsArrayBuffer(path, filename).then(
                        function (result) {
                            var file = result;
                            var arrayBuffer = new Uint8Array(file);

                            var blob = new Blob([arrayBuffer], {type: MIME_IMAGE_JPEG});

                            deferred.resolve(blob);

                    },  function (error) {
                            defered.reject(error);
                    });

                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            },

            cleanup : function () {
                $cordovaCamera.cleanup(
                    function () {
                        console.log('Deleted local image..');
                    }
                    ,
                    function (err) {
                        console.log('Error cleaning up image..');
                    });
            }
        }
    });