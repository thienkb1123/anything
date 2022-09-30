var DropzoneInit = function () {
    var NewDropzone = function () {
        Dropzone.options.multiFileUpload = {
            uploadMultiple: false,
            paramName: "file",
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

function viewItems(mediaID) {
    $.ajax({
        url: "/any-admin/media/list",
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            if (res.code !== 0) {
                return
            }

            let tempalte = ''
            for (row of res.result.items) {
                tempalte += `
                    <li class="file-box${mediaID === row.id ? ' active' : ''}" data-id="${row.id}" data-path="${row.path}">
                        <div class="file-top">
                            <img src="${row.path}" alt="${row.name}">
                        </div>
                        <div class="file-bottom">
                            <h6>${row.name}</h6>
                            <p>${formatDate(row.created_at)}</p>
                            <p>${humanFileSize(row.size, true)}</p>
                        </div>
                    </li>
                `
            }

            $('#list-files').html(tempalte)
        }
    });
}


/**
 * Handler set media to form-data
 */
function onSetAvatar() {
    const id = $('.file-box.active').attr('data-id');
    $('input[name="mediaID"]').val(id)

    const path = $('.file-box.active').attr('data-path');
    $('#any-gallery').html(`
        <figure itemprop="associatedMedia">
            <img class="img-thumbnail" src="${path}" itemprop="thumbnail" alt="Image description">
        </figure>
    `)

    $('#mediaModal').modal('hide');
}

/**
 * Handler media
 * Click show modal media
 * Handler click select item
 */
$(document).ready(function () {
    $('#mediaBtn').on('click', function () {
        $('#mediaModal').modal('toggle')


        const mediaID = $('input[name="mediaID"]').val()
        viewItems(mediaID)
    });

    $('body').on('click', '.file-box', function (e) {
        $(this).toggleClass('active', 1000).siblings().removeClass('active');

    })
});

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    )
}