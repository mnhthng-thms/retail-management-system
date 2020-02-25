var inputFields = document.querySelectorAll('.validate-input>.input100');
var validateForm = document.forms[0];
var mailRegex = new RegExp(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/, 'g');
var phoneRegex = new RegExp(/(09|01[2|6|8|9])+([0-9]{8})\b/, 'g');

if (!!localStorage.getItem('jwt')) {
  window.location.href = "/user";
}

/* Focus contact 
*/
inputFields.forEach(curElement => {
  curElement.addEventListener('blur', function (_) {
    if (!curElement.value.trim()) {
      curElement.classList.remove('has-val');
    } else {
      curElement.classList.add('has-val');
    }
  })
});

/*Validate 
*/
function showAlert(cursor) {
  var alertNode = cursor.parentNode;
  alertNode.classList.add('alert-validate');
};
function hideAlert(cursor) {
  var alertNode = cursor.parentNode;
  alertNode.classList.remove('alert-validate');
};
function isValidInput(input) {
  if (input.getAttribute('name') == 'email') {
    if (!(input.value.trim().match(mailRegex) || input.value.trim().match(phoneRegex))) {
      return false;
    }
  } else if (!(input.value.trim())) {
    return false;
  }
  return true;
};

validateForm.addEventListener('submit', function (event) {
  inputFields.forEach(curElement => {
    if (!(isValidInput(curElement))) {
      showAlert(curElement);
      event.preventDefault();
    }
    else {
      var xhr = new XMLHttpRequest();
      console.dir(event.target);
      var email = event.target[0].value;
      var password = event.target[1].value;
      var loginCredentials = email + ':' + password;

      xhr.open('POST', 'api/signin');
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(loginCredentials));
      xhr.withCredentials = true;
      xhr.responseType = 'json';

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 200) {
          showAlert(curElement);
          event.preventDefault();
        } else {
          var tokenString = xhr.response.token;
          console.log(tokenString);
          if (!tokenString) {
            showAlert(curElement);
            event.preventDefault();
          }
          localStorage.setItem('jwt', tokenString);
          window.location.href = '/user';
        }
      };

      xhr.addEventListener('error', function (event) {
        console.log(event.type);
        console.error(event);
      })

      xhr.send(null);
    }
  })
});

inputFields.forEach(curElement => {
  curElement.addEventListener('focus', function (_) {
    hideAlert(curElement);
  })
});