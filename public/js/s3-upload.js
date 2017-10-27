(function() {
  if (document.getElementById('avatar-input') !== null) {
    document.getElementById('avatar-input').onchange = function() {
      const files = document.getElementById('avatar-input').files;
      const file = files[0];
      if (file == null) {
        return alert('No file selected');
      }
      getSignedRequest(file, 'avatars');
    };
  }
})();

(function() {
  if (document.getElementById('haiku-img-input') !== null) {
    document.getElementById('haiku-img-input').onchange = function() {
      const files = document.getElementById('haiku-img-input').files;
      const file = files[0];
      if (file == null) {
        return alert('No file selected');
      }
      getSignedRequest(file, 'haikus');
    };
  }
})();

function getSignedRequest(file, folderName) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/sign-s3?folder-name='
    + folderName
    + '&file-name=' + encodeURIComponent(file.name)
    + '&file-type=' + encodeURIComponent(file.type));
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url, folderName);
      } else {
        alert('Could not get signed URL');
      }
    } else {
      console.log(xhr.readystate);
    }
  };
  xhr.send();
}

function uploadFile(file, signedRequest, url, folderName) {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      if(xhr.status === 200) {
        document.getElementById('preview').src = url;
        if (folderName === 'avatars') {
          document.getElementById('avatar-url').value = url;
        } else if (folderName === 'haikus') {
          document.getElementById('haiku-img-url').value = url;
        }
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
