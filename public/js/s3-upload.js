(function() {
  document.getElementById('avatar-input').onchange = function() {
    const files = document.getElementById('avatar-input').files;
    const file = files[0];
    if (file == null) {
      return alert('No file selected');
    }
    getSignedRequest(file);
  };
})();

function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/sign-s3?file-name=' + encodeURIComponent(file.name) + '&file-type=' + encodeURIComponent(file.type));
  xhr.onreadystatechange = function() {
    if (xhr.readystate === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse.signedRequest, response.url);
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert('Could not get signed URL');
      }
    }
  };
  xhr.send();
}
