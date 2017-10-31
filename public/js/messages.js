
$( '.icon-close' ).click(function() {
  $( '.error-wrapper ').css( 'display', 'none' );
  $( '.message-wrapper' ).css( 'display', 'none' );
});

function checkMessages() {
  var messages = $( '.messages' );
  if (messages.length !== 0) {
    $( '.message-wrapper' ).css( 'display', 'block' );
  }
}
checkMessages();
