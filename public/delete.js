function deleteWhosit(id){
    $.ajax({
        url: '/whosit/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteHasA(whosit_id, whatsit_id) {
    $.ajax({
        url: '/hasA/whosit_id/' + whosit_id + '/whatsit_id/' + whatsit_id,
        type: 'DELETE',
        success: function(result) {
            if (result.responseText != undefined) {
                alert(result.responseText);
            } else {
                window.location.reload(true);
            }
        }
    })
};
