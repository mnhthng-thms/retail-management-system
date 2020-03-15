/* #region GLOBAL WARNING BADGES SET-UP */
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

/* <-- #region COMPONENTS SET-UP --> */
var componentBridge = {
  viewUsers: document.getElementById('view-users'),
  updateUser: document.getElementById('update-user')
};
/* @TODO toggle component on & off 
    @param[0]:    (String)           component name
    @param[1][0]: (Enum)             elementOf ['on', 'off', true, false, 0, 1]
    @param[1][1]: (UserInfo Object)  default value for the form
*/
var toggleComponent = (componentName) => (...options) => {
  var bodyContentWrapper = document.body.querySelector('.wrapper>.main-panel>.content>.container-fluid');
  var thisComponentWrapper = componentBridge[componentName]; //@WHY this is a value copy, not a reference copy
  let thisForm = document.forms.namedItem(componentName);

  const givenFirstParamOptions = ['on', 'off', true, false, 1, 0];
  if (givenFirstParamOptions.filter((_, idx) => idx % 2 == 0).indexOf(options[0]) >= 0) {
    bodyContentWrapper.appendChild(thisComponentWrapper);
  }
  if (givenFirstParamOptions.filter((_, idx) => idx % 2 != 0).indexOf(options[0]) >= 0) {
    bodyContentWrapper.removeChild(thisComponentWrapper);
  }

  if (!!options[1]) {
    // @WHY: options[1] is used only in case of appending new Form instance,
    //       & when document.forms are updated => 
    //       hence, reference to `thisForm` need to be reassigned
    thisForm = document.forms.namedItem(componentName);
    thisForm.setAttribute('id', options[1]);
    console.dir(thisForm);

    // $('p.card-category>span#user-to-be-updated').innerHTML
    document.querySelector('#update-user > div > div > div.card-header.card-header-primary > p').innerHTML
      = `<b>User Id:</b> ${options[1].id}`;
    thisForm[0].value = options[1].full_name;
    thisForm[1].value = options[1].email;
    thisForm[2].value = options[1].phone;
    thisForm[5].selectedIndex = (!!options[1].is_admin) ? 0 : 1;
  }
};

/* <-- #endregion COMPONENTS SET-UP --> */

/* <-- #region UPDATEUSER's ON `SUBMIT` EVENT --> */
//     these event handlers are delegated to document.onClick
//     see below ...
/* <-- #endregion UPDATEUSER's ON `SUBMIT` EVENT --> */

/* <-- #region VIEWUSER's EVENT -->
    @TODOs: - on default, display the list of all user accounts
            - when user triggers a search request, fetch the result
            - close this component when user requests updating a profile
              or user registration view
*/
var tableDom = [...document.body.getElementsByTagName('table')][0];
var tableBody = [...document.body.getElementsByTagName('table')][0].tBodies[0];

var renderUtilities = function (idString) {
  let tdElement = document.createElement('td');
  tdElement.classList.value = 'td-actions text-right';

  const tooltipButton = function (option) {
    // @TODO constructing the interface
    let buttonDom = document.createElement('button');
    let iconDom = document.createElement('i');
    let iconWrapper = document.createElement('div');
    let rippleContainer = document.createElement('div');

    iconWrapper.classList.value = 'tooltip-icon-wrapper';
    rippleContainer.classList.value = 'ripple-container';
    iconDom.classList.value = 'material-icons';

    buttonDom.type = 'button';
    buttonDom.setAttribute('rel', 'tooltip');
    buttonDom.id = idString;
    ['btn', 'btn-primary', 'btn-link', 'btn-sm'].forEach(el => buttonDom.classList.add(el));

    iconWrapper.onclick = function (event) {
      event.preventDefault();
      console.log('front-end design is bullshit');
    }
    // @TODO customise based on input option
    const givenOptions = ['edit', 'remove'];
    const chosenOption = givenOptions.indexOf(option);
    if (chosenOption == 0) {
      buttonDom.setAttribute('data-original-title', 'Edit this User Profile');
      iconDom.innerHTML = 'edit';
      iconWrapper.classList.add('tooltip-edit-user');
      //@TODO attach event handler for updating user
    }
    else if (chosenOption == 1) {
      iconWrapper.classList.add('tooltip-remove-user');
      buttonDom.setAttribute('data-original-title', 'Delete this Account');
      iconDom.innerHTML = 'close';
      // attach event handler for editing user
    }

    // @TODO finalise
    iconWrapper.appendChild(iconDom);
    buttonDom.appendChild(iconWrapper);
    buttonDom.appendChild(rippleContainer);
    return buttonDom;
  }

  tdElement.appendChild(tooltipButton('edit'));
  tdElement.appendChild(tooltipButton('remove'));
  return tdElement;
};

var renderUserDataToTable = function (userJSONs) {
  tableBody.innerHTML = '';
  const sanitiseHTML = function (HTMLString) {
    return HTMLString.split(',,,').join('').split(',').join('');
  }

  const processedRes = userJSONs.map(cur => {
    return {
      id: cur._id,
      full_name: cur.full_name,
      email: cur.email,
      phone: cur.phone,
      is_admin: cur.is_admin
    }
  });
  const tableInnerHTML = processedRes.reduce((acc, curUserObj, idxRow) => {
    return acc +
      `<tr id=${idxRow}>
        ${Object.keys(curUserObj)
        .filter(curKey => curKey != 'id')
        .map(curKey => {
          if (curKey == 'is_admin') {
            return curUserObj[curKey] == true ?
              `<td class="text-center ${curUserObj['id']}" id="is_admin">✓</td>` :
              `<td class="text-center ${curUserObj['id']}" id="is_admin">✗</td>`;
          } else {
            return `<td class=${curUserObj['id']} id=${curKey}>${curUserObj[curKey]}</td>`;
          }
        })}
         ${(renderUtilities(curUserObj['id']).outerHTML)}
       </tr>`;
  }, '');

  tableBody.innerHTML = sanitiseHTML(tableInnerHTML);
}

/* Event-handler for hot-loading user data to table
   Triggered when DOMs loaded 
 */
var loadDataToTableOnDOMLoad = function (event) {
  let xhr2 = new XMLHttpRequest();
  xhr2.open('GET', '/api/user', true);
  xhr2.withCredentials = true;
  xhr2.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr2.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
  xhr2.responseType = 'json';

  xhr2.addEventListener('load', function (event) {
    console.log('fired!');
    if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status >= 200 && xhr2.status <= 300) {
      console.log(`readystate is ${xhr2.readyState}`);
      console.log(`status is ${xhr2.status}`);
      console.log(`response body:`);
      console.dir(xhr2.response);

      renderUserDataToTable(xhr2.response);
    }
    else {
      event.preventDefault();
      showGlobalBadge(0)(xhr2.response.message);
    }
  });

  xhr2.addEventListener('timeout', function (event) {
    event.preventDefault();
    showGlobalBadge(0)('Server time out error!');
  });

  xhr2.addEventListener('error', function (event) {
    console.log(`\'${event.type}\' event trigger`);
    showGlobalBadge(0)('Request not sent! Please reload page & try again');
    event.preventDefault();
  });

  xhr2.addEventListener('progress', (_) => {
    tableBody.innerHTML = `<tr>
      <td>loading</td>
      <td>loading</td>
      <td>loading</td>
      <td>loading</td>
      <td>loading</td>
    </tr>`
  });

  xhr2.send({});
}

/* <!-- LoadDataToTableOnSearch --> */

/* <-- #endregion VIEWUSER's EVENT --> */

/* #region GLOBAL Window & Document Event Delegation */
window.addEventListener('DOMContentLoaded', function (event) {
  /*@TODOs On start: - 'hide' all global warnings
                     - 'hide' all invalid-input warnings 
                     - 'hide' `updateUser` component 
                     - populate `viewUser` component data table
              
  */
  toggleComponent('updateUser')(false);
  toggleComponent('viewUsers')(true);

  globalAlertBadges.forEach(el => globalAlertWrapper.removeChild(el));

  loadDataToTableOnDOMLoad(event);
});

document.addEventListener('click', function (event) {
  console.dir(event.target);

  /* <-- #region click on user utility icon --> */
  if (event.target.offsetParent.matches('button.btn.btn-primary.btn-link.btn-sm')) {
    const action = (event.target.innerText == 'edit') ? 'update' : 'remove';
    const thisIconBtnWrapper = event.target.offsetParent;
    const userIdTarget = thisIconBtnWrapper.id;
    const userTarget = {
      id: userIdTarget,
      full_name: document.body.querySelector(`td[class='${userIdTarget}'][id='full_name']`).innerText,
      email: document.body.querySelector(`td[class='${userIdTarget}'][id='email']`).innerText,
      phone: document.body.querySelector(`td[class='${userIdTarget}'][id='phone']`).innerText,
      is_admin: (document.body.querySelector(`td[class='text-center ${userIdTarget}'][id='is_admin']`).innerText == '✓') ? true : false
    }
    console.dir(userTarget);

    if (action == 'update') {
      toggleComponent('updateUser')('on', userTarget);

      // @TODO define updateUser onsubmit behaviour
      document.forms.namedItem('updateUser').addEventListener('submit', function (event) {
        const full_name = event.target.elements[0].value.trim();
        const email = event.target.elements[1].value.trim();
        const phone = event.target.elements[2].value.trim();
        const password = event.target.elements[3].value.trim();
        const is_admin = !(event.target.elements[5].selectedIndex);
        const dataGathered = { full_name, email, phone, password, is_admin };
        const reqData = Object.keys(dataGathered).reduce((accObj, curKey) => {
          if (!!dataGathered[curKey]) { accObj[curKey] = dataGathered[curKey]; }
          return accObj;
        }, {});

        let xhr = new XMLHttpRequest();
        xhr.open('PUT', `api/user/${userIdTarget}`);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
        xhr.withCredentials = true;
        xhr.responseType = 'json';

        xhr.addEventListener('load', function (event) {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status > 300) {
            event.preventDefault();
            showGlobalBadge(0)(xhr.response.message);
          }
          else {
            showGlobalBadge(1)();
            console.dir(xhr.response);
            window.location.reload(true);
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
      });
    }
    else {
      // @TODO define removing user behaviour
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', `api/user/${userIdTarget}`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('jwt')}`);
      xhr.responseType = 'json';

      xhr.addEventListener('load', function (event) {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status > 300) {
          if (!xhr.response.message) {
            showGlobalBadge(0)();
          } else {
            showGlobalBadge(0)(xhr.response.message);
          }
        } else {
          showGlobalBadge(1)();
          console.dir(xhr.response);
          window.location.reload(true);
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

      xhr.send({});

      showGlobalBadge('success');
      event.preventDefault();
    }
  }
  /* <-- #endregion click on user utility icon --> */
});

/* #endregion GLOBAL Document Event Delegation */
