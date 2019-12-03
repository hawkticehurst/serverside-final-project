(function () {
  "use strict";

  // Remember to always run the main.go file on port 4000 (vs the default port 80)
  // const BASE_URL = "http://localhost:4000/v1/summary";

  const BASE_URL = "https://api.info441summary.me/v1/events";
  const LOGOUT_URL = "https://api.info441summary.me/v1/sessions/mine";

  /**
   *  Functions that will be called once the window is loaded
   *  Submit button will get click event listener and call fetchUrlSummary
   */
  window.addEventListener("load", () => {
    getEvents();

    const button = id('submit');
    button.addEventListener('click', function (event) {
      //event.preventDefault();
      createEvent();
    });

    const logoutButton = id('log_out')
    logoutButton.addEventListener('click', function (event) {
      //event.preventDefault();
      logUserOut();
    });
  });

  const createEvent = () => {
    const newEvent = {
      title: idValue('Title'),
      datetime: idValue('DateTime'),
      location: idValue('Location'),
      description: idValue('Description'),
    }
    console.log(newEvent);
    fetch(BASE_URL, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(newEvent) // body data type must match "Content-Type" header
    }).then(checkStatus)
      .then(getEvents)
      .catch(displayErrorForm)
  }

  const logUserOut = () => {
    fetch(LOGOUT_URL, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'text/html'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: ""// body data type must match "Content-Type" header
    }).then(checkStatus)
    //.then(getEvents)
    then(window.location.pathname = '/').catch(displayErrorForm)
  }

  const getEvents = () => {
    fetch(BASE_URL, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Authorization': getAuthToken()
      }
    })
      .then(checkStatus)
      .then(JSON.parse)
      .then(displayCards)
      .catch(displayErrorHomePage);
  }

  const displayCards = (info) => {
    for (var i = 0; i < info.length; i++) {
      let data = info[i];
      let card = document.createElement('div');
      card.className = 'card';

      let title = document.createElement('h4');
      title.innerText = data.title;
      title.className = 'card-title';

      let datetime = document.createElement('p');
      datetime.innerText = data.datetime;
      datetime.className = 'card-text';

      let location = document.createElement('p');
      location.innerText = data.location;
      location.className = 'card-text';

      let description = document.createElement('p');
      description.innerText = data.description;
      description.className = 'card-text';

      let joinBtn = document.createElement("button");
      joinBtn.innerText = "Join Event";
      joinBtn.setAttribute("type", "button");
      joinBtn.classList.add("btn");
      joinBtn.classList.add("btn-primary");
      joinBtn.classList.add("join-btn");
      joinBtn.addEventListener("click", joinEvent);

      card.appendChild(title);
      card.appendChild(datetime);
      card.appendChild(location);
      card.appendChild(description);
      card.appendChild(joinBtn);
      id("events-container").appendChild(card);
    }
  }

  // HERE STANLEY :)
  const joinEvent = () => {
    alert("You joined this event!"); // Remove this later
  }

  const getAuthToken = () => {
    let nameEQ = "auth=";
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) == " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) == 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }

  /**
   * Function to handle the result of an unsuccessful fetch call
   * @param {Object} error - Error resulting from unsuccesful fetch call 
   */
  const displayErrorForm = (error) => {
    // Retrieve container for displaying error
    const metaContainer = id('formError');
    if (metaContainer.classList.contains("hidden")) {
      metaContainer.classList.remove("hidden");
    }
    metaContainer.innerHTML = "";

    // Render error
    const errorMsg = document.createElement('h2');
    errorMsg.classList.add("error-msg");
    errorMsg.textContent = error;
    metaContainer.appendChild(errorMsg);
  }

  const displayErrorHomePage = (error) => {
    // Retrieve container for displaying error
    const metaContainer = id('errorHome');
    if (metaContainer.classList.contains("hidden")) {
      metaContainer.classList.remove("hidden");
    }
    metaContainer.innerHTML = "";

    // Render error
    const errorMsg = document.createElement('h2');
    errorMsg.classList.add("error-msg");
    errorMsg.textContent = error;
    metaContainer.appendChild(errorMsg);
  }


  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {String} idName HTML element ID.
   * @returns {Object} DOM object associated with ID.
   */
  const id = (idName) => {
    return document.getElementById(idName);
  }

  const idValue = (idName) => {
    return document.getElementById(idName).value;
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {Object} response Response to check for success/error
   * @returns {Object} Valid result text if response was successful, otherwise rejected
   *                   Promise result
   */
  const checkStatus = (response) => {
    if (response.status != 200) {
      return Promise.reject(new Error("Server error"));
    } else {
      return response.text();
    }
  }

})();