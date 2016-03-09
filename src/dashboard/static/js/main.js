$(document).ready(function() {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
    $('#poll_item_input').keypress(function(event) {
        if (event.which == 13) {
            addOption();
        }
    });
    $('#deloptbtn').click(delOptions);
});

function addOption() {
    var optiontext = $('#poll_item_input').val();
    $('<div class="chip">' + optiontext +
        '<i class="material-icons">close</i></div>').appendTo(
        ".pollitems");
    $('#poll_item_input').val("");
}

function delOptions() {
    $('.pollitems').empty(); // CLEAR ALL POLL ITEMS
    $('#poll_question').val(""); // CLEAR THE CURRENT POLL QUESTION
}
