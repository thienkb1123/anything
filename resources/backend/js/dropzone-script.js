var DropzoneInit = function () {
    var NewDropzone = function () {
        Dropzone.options.multiFileUpload = {
            paramName: "files",
            maxFiles: 10,
            maxFilesize: 10,
            url: '/any-admin/media',
            accept: function (file, done) {
                done();
            },
            complete: function () {
                this.removeAllFiles(true)

                viewItems()
            }
        }
    }
    return {
        init: function () {
            NewDropzone()
        }
    };
}();
DropzoneInit.init()

function viewItems() {
    $.ajax({
        url: "/any-admin/media/list",
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            if (res.code !== 0) {
                return
            }

            let tempalte = ''
            for (row of res.result) {
                tempalte += `
                    <figure class="col-xl-2 col-md-2 xl-33" itemprop="associatedMedia" itemscope="">
                        <img class="img-thumbnail" src="${row.path}" itemprop="thumbnail" alt="Image description">
                        <figcaption itemprop="caption description">
                            <h6>${row.name}</h6>
                            <p class="mb-1">${row.size} MB</p>
                            <p> <b>Created at : </b> ${row.created_at}4</p>
                        </figcaption>
                    </figure>`
            }

            $('#list-files').html(tempalte)
        }
    });
}

