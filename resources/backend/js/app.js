function swalAlert(title, message, type) {
    swal(title, message, type)
}

function confirmDelete(url) {
    swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        icon: 'warning',
        buttons: true,
    }).then((willDelete) => {
        if (willDelete) {
            const settings = {
                url: url,
                method: 'DELETE',
                dataType: 'json'
            };

            $.ajax(settings).done(function(response) {
                if (response.code == 0) {
                    $(`#row-${response.result.id}`).fadeOut(300, function() { $(this).remove() })
                    return
                }

                swalAlert('Error', "An error occurred. Refresh the page and let's try", 'error')
                return
            });
        }
    });
}


$.fn.Select2UpdatePlaceholder = function(newPlaceholder) {
    var $select2 = $(this).data('select2');
    $select2.selection.placeholder.text = newPlaceholder;
    return $select2.$container.find('.select2-selection__placeholder').text(newPlaceholder);
};

// With Placeholder
$("#categories-create-post-wp").select2({
    placeholder: "First your need select site create post"
});

$("#tags-create-post-wp").select2({
    placeholder: "First your need select site create post"
});

$("#any-select2-site").select2({
    placeholder: "Select site create post"
}).on('change', function(e) {
    const siteAddr = $("#any-select2-site option:selected").text();
    if (!siteAddr) {
        swalAlert('Error', "An error occurred. Refresh the page and let's try", 'error')
        return
    }

    $('#categories-create-post-wp').Select2UpdatePlaceholder('Getting data. Please wait')
    $('#categories-create-post-wp').trigger('change')
    $('#tags-create-post-wp').Select2UpdatePlaceholder('Getting data. Please wait')
    $('#tags-create-post-wp').trigger('change')

    const settings = {
        url: '/any-admin/tools/make-content/youtube/info-create-post',
        data: { siteAddr: siteAddr },
        method: 'GET',
        dataType: 'json'
    };

    $.ajax(settings).done(function(response) {
        if (response.code != 0) {
            swalAlert('Error', "An error occurred. Refresh the page and let's try", 'error')
            return
        }

        let categories = response.result.categories
        for (const category of categories) {
            $('#categories-create-post-wp').append(new Option(category.text, category.id, false, false))
        }
        $('#categories-create-post-wp').Select2UpdatePlaceholder('Select categories')
        $('#categories-create-post-wp').trigger('change')

        let tags = response.result.tags
        for (const tag of tags) {
            $('#tags-create-post-wp').append(new Option(tag.text, tag.id, false, false))
        }
        $('#tags-create-post-wp').Select2UpdatePlaceholder('Select tags')
        $('#tags-create-post-wp').trigger('change')
        return
    });
});

$(".any-select2-basic").select2();