/* GLOBAL WARNING BADGES SET-UP */
var globalAlertWrapper = document.querySelector('div.alert-wrapper');
/* @TODO keeping copy of global alert <div> tags for later appending 
    globalAlertBadges[0] : (HTMLDivElement)  warning alert div 
    globalAlertBadges[1] : (HTMLDivElement)  success alert div
*/
var globalAlertBadges = [...globalAlertWrapper.children];
/* @TODO function to bring up message to display 
     @param[0] (Enum)   elementOf [0, 1, 'warning', 'success', false, true]
     @param[1] (String) to customise message string
*/
var showGlobalBadge = (option) => (customMessage) => {
  var showWarning = function () {
    if (!customMessage) {
      globalAlertWrapper.appendChild(globalAlertBadges[0]);
    } else {
      let customAlertBadge = globalAlertBadges[0];
      customAlertBadge.children[1].innerHTML = `<b>${customMessage}</b>`;
      globalAlertWrapper.appendChild(customAlertBadge);
    }
  };
  var showSuccess = function () {
    if (!customMessage) {
      globalAlertWrapper.appendChild(globalAlertBadges[1]);
    } else {
      let customAlertBadge = globalAlertBadges[1];
      customAlertBadge.children[1].innerHTML = `<b>${customMessage}</b>`;
      globalAlertWrapper.appendChild(customAlertBadge);
    }
  };
  var resetGlobalWarnings = function () {
    while (!!globalAlertWrapper.firstChild) {
      globalAlertWrapper.removeChild(globalAlertWrapper.firstChild);
    }
  };

  const givenOptions = [0, 1, 'warning', 'success', false, true];
  if (givenOptions.filter((_, idx) => idx % 2 == 0).indexOf(option) >= 0) {
    resetGlobalWarnings();
    showWarning();
  }
  if (givenOptions.filter((_, idx) => idx % 2 != 0).indexOf(option) >= 0) {
    resetGlobalWarnings();
    showSuccess();
  }
}

/* INVALID INPUT WARNINGS SET-UP */
/* @TODO  constructor for objects holding metadata of invalid-input warnings
   @return: array of objects, each remembering metadata of a pre-defined invalid-input-warnings 
      * each object's properties: 
        * `ofField`       : (String)                   name of input field to which this warning references
        * `warningWrapper`: (HTMLDivElement)           wrapper of this warning
        * `messages`      : ([HTMLParagraphElement])   array of warning <p> tags
*/
var warningDicts = function (formName) {
  var thisForm = document.forms.namedItem(formName);
  var inputGroup = [...thisForm.elements].filter(el => el.localName === 'input');

  return [...inputGroup].map(el => {
    var warningWrapper = el.parentNode.parentNode.children[1];
    var warningMessages = [...warningWrapper.children];

    return {
      ofField: el.attributes.id.value,
      wrapper: warningWrapper,
      messages: warningMessages
    }
  });
};
/* @TODO `warningSetBridge` implements dictionary ADT
    key: form name
    value: copy of HTML warning elements before removing
*/
var warningSetBridge = {
  createUser: warningDicts('createUser'),
}

/* <-- ON WINDOW FIRST `LOAD` -->
   @TODOs: 
           - 'hide' all global warnings
           - 'hide' all invalid-input warnings 
*/

globalAlertBadges.forEach(el => globalAlertWrapper.removeChild(el));

(function hideAllInputWarnings() {
  Object.values(warningSetBridge).forEach(curObjs => {
    curObjs.forEach(curObj => {
      while (curObj.wrapper.firstChild) {
        curObj.wrapper.removeChild(curObj.wrapper.firstChild);
      }
    })
  })
})();
/* <-- /ON WINDOW FIRST `LOAD` --> */

var numOfWarningShowed = ([...document.body.getElementsByClassName('text-danger')].length);

/* @TODO check if all input fields' value are valid 
         & show warnings in case of invalidation
*/
var showInvalidWarnings = function (formName) {
  var mailRegex = new RegExp(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/, 'g');
  var phoneRegex = new RegExp(/(09|01[2|6|8|9])+([0-9]{8})\b/, 'g');

  var thisForm = document.forms.namedItem(formName);
  var thisWarningsSet = warningSetBridge[formName];

  thisWarningsSet.forEach((curWarningDict, idx) => {
    var curInputField = thisForm.elements[idx];
    var inputFieldId = curInputField.attributes.id.value;

    var appendWarning = function (messageIndex) {
      curWarningDict.wrapper.appendChild(curWarningDict.messages[messageIndex]);
    }

    // @TODO 'show' invalid warning badge if field left blank
    if (!curInputField.value.trim() && !curWarningDict.wrapper.children.length) {
      appendWarning(0);
    }

    switch (inputFieldId) {
      case 'email':
        while (curWarningDict.wrapper.firstChild) {
          curWarningDict.wrapper.removeChild(curWarningDict.wrapper.firstChild);
        };
        // @TODO 'show' warning if email not in right format
        if (!curInputField.value.trim().match(mailRegex)
          && !curWarningDict.wrapper.children.length) {
          appendWarning(0);
        }
        break;
      case 'phone-number':
        while (curWarningDict.wrapper.firstChild) {
          curWarningDict.wrapper.removeChild(curWarningDict.wrapper.firstChild);
        };
        // @TODO 'show' warning if phone not in right format
        if (!curInputField.value.trim().match(phoneRegex)
          && !curWarningDict.wrapper.children.length) {
          appendWarning(1);
        }
        break;
      case 'repassword':
        // @TODO if this field is currently blank, skip validating
        //       else checking if password in this field and `password` field match
        while (curWarningDict.wrapper.firstChild) {
          curWarningDict.wrapper.removeChild(curWarningDict.wrapper.firstChild);
        };

        if ((curInputField.value.trim() !== thisForm.elements.password.value.trim())
          && !curWarningDict.wrapper.children.length) {
          appendWarning(0);
        }
        break;
      default:
        break;
    }
  });
};

/* <-- CREATEUSER's ON `SUBMIT` EVENT --> */
var createUserForm = document.forms.namedItem('createUser');

[...createUserForm.elements].forEach(el => {
  el.addEventListener('change', (event) => {
    showInvalidWarnings('createUser');
    event.preventDefault();
  })
});

createUserForm.addEventListener('submit', (event) => {
  if (numOfWarningShowed < 1) {
    const full_name = event.target.elements[0].value.trim();
    const email = event.target.elements[1].value.trim();
    const phone = event.target.elements[2].value.trim();
    const password = event.target.elements[3].value.trim();
    const is_admin = !(event.target.elements[5].selectedIndex);
    const reqData = { full_name, email, phone, password, is_admin };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/signup');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.responseType = 'json';

    xhr.addEventListener('load', function (event) {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status != 201) {
        event.preventDefault();
        showGlobalBadge(0)(xhr.response.message);
      } else {
        showGlobalBadge(1)();
      }
    });

    xhr.addEventListener('timeout', function (event) {
      event.preventDefault();
      showGlobalBadge(0)('Server time out error!');
    });

    xhr.addEventListener('error', function (event) {
      console.log(event.type);
      showGlobalBadge(0)('Request not sent! Please reload page & try again');
      event.preventDefault();
    });

    xhr.send(JSON.stringify(reqData));

    showGlobalBadge('success');
    event.preventDefault();
  } else {
    event.preventDefault();
    showGlobalBadge('warning');
  }
});
/* <-- /CREATEUSER's ON `SUBMIT` EVENT --> */