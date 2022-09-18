function swalAlert(title, message, type, redirectURL) {
    swal({
        title: title,
        text: message,
        icon: type,
        html: true
    }).then(function() {
        if (redirectURL) {
            window.location = redirectURL
        }

        console.log(redirectURL)
    })
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function newSelec2Custom(id, placeholder, data = [], selections = []) {
    const _id = $(`#${id}`)
    _id.select2({
        placeholder: placeholder,
        data: data
    })

    if (selections.length) {
        _id.val(selections).trigger('change')
    }
}

function updateSelect2Custom(id, data = [], placeholder) {
    const _id = $(`#${id}`)
    if (data.length) {
        _id.append(data)
    }

    _id.select2UpdatePlaceholder(placeholder)
    _id.trigger('change')
}

$.fn.select2UpdatePlaceholder = function(newPlaceholder) {
    var $select2 = $(this).data('select2');
    $select2.selection.placeholder.text = newPlaceholder;
    return $select2.$container.find('.select2-selection__placeholder').text(newPlaceholder);
};

$("#any-select2-site").select2({
        placeholder: "Select site create a post",
    })
    .on('change', function(e) {

        const siteAddr = $("#any-select2-site option:selected").text();
        if (!siteAddr) {
            swalAlert('Error', "Select site an error occurred. Refresh the page and let's try", 'error')
            return
        }

        const _categories = $('#categories-create-post-wp')
        const _tags = $('#tags-create-post-wp')

        _categories.select2UpdatePlaceholder('Getting data. Please wait')
        _categories.trigger('change')
        _tags.select2UpdatePlaceholder('Getting data. Please wait').trigger('change')
        _tags.trigger('change')

        const settings = {
            url: '/any-admin/post-tool/wordpress/info-create-post',
            data: { siteAddr: siteAddr },
            method: 'GET',
            dataType: 'json'
        };

        $.ajax(settings).done(function(response) {
            if (response.code != 0) {
                swalAlert('Error', "Getting tags and categories an error occurred. Refresh the page and let's try", 'error')
                return
            }

            let categories = response.result.categories
            let dataCategories = []
            for (const category of categories) {
                if (_categories.find("option[value='" + category.id + "']").length == 0) {
                    dataCategories.push(new Option(category.text, category.id, false, false))
                }
            }
            updateSelect2Custom('categories-create-post-wp', dataCategories, 'Select categories')

            let tags = response.result.tags
            let dataTags = []
            for (const tag of tags) {
                if (_tags.find("option[value='" + tag.id + "']").length == 0) {
                    dataTags.push(new Option(tag.text, tag.id, false, false))
                }
            }
            updateSelect2Custom('tags-create-post-wp', dataTags, 'Select tags')
            return
        });
    });

$(".any-select2-basic").select2();



$("form").submit(function(e) {
    var data_array = $("form").map(function() {
        return $(this).serializeArray();
    });

});