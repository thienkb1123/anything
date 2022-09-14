function swalAlert(title, message, type) {
    swal(title, message, type)
}

function confirmDelete(url) {
    swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this!',
        icon: 'warning',
        buttons: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var settings = {
                    url: url,
                    method: 'DELETE',
                    dataType: 'json'
                };

                $.ajax(settings).done(function (response) {
                    if (response.code == 0) {
                        $(`#row-${response.result.id}`).fadeOut(300, function () { $(this).remove() })
                        return
                    }

                    swalAlert('Error', "An error occurred. Refresh the page and let's try", 'error')
                    return
                });
            }
        });
}