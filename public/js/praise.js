$(document).ready(function() {
  $('.give-praise-btn').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'POST',
      url: '/haikus/'+id+'/give-praise',
      success: function(response) {
        window.location.href = '/haikus/'+id;
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $('.undo-praise-btn').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'POST',
      url: '/haikus/'+id+'/undo-praise',
      success: function(response) {
        window.location.href = '/haikus/'+id;
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
