
$( '.icon-close' ).click(function() {
  console.log('clicked');
  $( '.error-wrapper ').css( 'display', 'none' );
  $( '.message-wrapper' ).css( 'display', 'none' );
});

function checkMessages() {
  var messages = $( '.messages' );
  console.log(messages);
  if (messages.length !== 0) {
    $( '.message-wrapper' ).css( 'display', 'block' );
  }
}
checkMessages();
