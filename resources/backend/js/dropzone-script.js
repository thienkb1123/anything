var DropzoneInit = function() {
    var NewDropzone = function() {
        Dropzone.options.multiFileUpload = {
            paramName: "files",
            maxFiles: 10,
            maxFilesize: 10,
            url: '/any-admin/media',
            accept: function(file, done) {
                done();
            },
            complete: function() {
                this.removeAllFiles(true)
            }
        }
    }
    return {
        init: function() {
            NewDropzone()
        }
    };
}();
DropzoneInit.init()