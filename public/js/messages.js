
  $( '#icon-close' ).click(function() {
    $( '.message-block' ).css( 'display', 'none' );
  });

function checkMessages() {
  var messages = $( '.messages' );
  console.log(messages);
  if (messages.length === 0) {
    $( '.message-block' ).css( 'display', 'none' );
  }
}
checkMessages();
