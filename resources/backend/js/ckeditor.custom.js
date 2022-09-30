// Default ckeditor
CKEDITOR.replace('content', {
    on: {
        contentDom: function (evt) {
            // Allow custom context menu only with table elemnts.
            evt.editor.editable().on('contextmenu', function (contextEvent) {
                var path = evt.editor.elementPath();

                if (!path.contains('table')) {
                    contextEvent.cancel();
                }
            }, null, null, 5);
        }
    },
    filebrowserBrowseUrl: '/media',
    filebrowserUploadUrl: '/media'
});