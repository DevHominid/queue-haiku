$(document).ready(function() {
  $('.delete-haiku').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/haiku/'+id,
      success: function(response) {
        alert('Deleting Haiku');
        window.location.href='/';
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
