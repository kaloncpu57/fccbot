//global array to store poll info....
var pollinfo = [];
var pollquestion = "";


$(document).ready(function() {
  // TODO: If there is no poll remove the poll widget

  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();

  $('#poll_item_input').keypress(function(event) {
    if (event.which == 13) {
      if ($(this).val() !== "") {
        addOption();
      }
    }
  });
  $('#deloptbtn').click(delOptions);

  $('#submit_poll').click(function() {

    if ($('#poll_question').val() !== "" && $('.chips').length!==0) {
      updatePoll();
      Materialize.toast('Poll Updated', 3000); // 4000 is the duration of the toast
    }

  });
});

function addOption() {
  var optiontext = $('#poll_item_input').val();
  $('<div class="chip"><span class="chips">' + optiontext +
    '</span><i class="material-icons">close</i></div>').appendTo(
    ".pollitems");
  $('#poll_item_input').val("");
}

function delOptions() {
  $('.pollitems').empty(); // CLEAR ALL POLL ITEMS
  $('#poll_question').val(""); // CLEAR THE CURRENT POLL QUESTION
}


function updatePoll() {
  // clear and empty array and poll items
    pollinfo =[];
    $('#right3_collapsible_body').empty();


  $('.right3_collapsible_header').text($('#poll_question').val());


  $('.chips').each(function(index, element) {


    pollinfo.push($(element).text());

  });
  console.log(pollinfo);

  for (var x in pollinfo) {
    $('<li class="collection-item">' + pollinfo[x] + '</li>').appendTo(
      "#right3_collapsible_body");



  }
  // $('#right3_collapsible_body')
  // <li class="collection-item">yes</li>


}
