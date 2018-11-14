function updateWhosit(id) {
    $.ajax({
        url: '/whosit/' + id,
        type: 'PUT',
        data: $('#updateWhosit').serialize(),
        success: function(result) {
            window.location.replace("./");
        }
    })
}
