//dom selectors
const card = document.getElementById("card");
const compContainer = document.querySelector(".card__comp--container");
const form = document.getElementById("card__form");
const formHeading = document.querySelector(".card__form--heading");
const formDescription = document.querySelector(".card__form--description");
const formSubmit = document.getElementById("card__form--btn");
const clearAllBtn = document.getElementById("clear-all");

const app = () => {
  let map,
    coordMarker,
    markerData = [];

  const _getLoaction = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          _loadMap(pos);
        },
        function () {
          console.error("Couldn't get the location");
        }
      );
    }
  };

  const _loadMap = (pos) => {
    let { latitude: lat, longitude: lng } = pos.coords;
    let coords = [lat, lng];

    map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    //load stored markers
    markerData.forEach((data) => {
      _renderMarker(data);
    });

    //click on map
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      coordMarker = [lat, lng];

      _showForm();
    });
  };

  const _renderMarker = (coords) => {
    let id;
    let localData = JSON.parse(localStorage.getItem("input__data"));

    function arrayEquals(a, b) {
      return (
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
      );
    }

    //get id from local storage
    localData.forEach((data) => {
      if (arrayEquals(data[3], coords)) {
        id = data[2];
      }
    });

    //extract heading with matching id
    let headingArr = localData.map((data) => data.includes(id) && data[0]);
    let heading = headingArr.map((data) => {
      if (data) {
        let index = headingArr.indexOf(data);
        return headingArr[index];
      }
    });

    marker = L.marker(coords)
      .addTo(map)
      .bindPopup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: true,
      })
      .setPopupContent(
        `<h2>${formHeading.value || heading.map((data) => data)}</h2>`
      )
      .openPopup();
  };

  //make input form visible
  const _showForm = () => {
    form.style.display = "flex";
  };

  //Hides form
  const _hideForm = () => {
    form.style.display = "none";
    formHeading.value = formDescription.value = "";
  };

  //Adds comps to the card.
  const _addField = (id, inputCoords) => {
    if (!formHeading.value || !formDescription.value) {
      alert("empty fields");
    }

    if (formHeading.value && formDescription.value) {
      //saveLoacal input hading and description
      _saveLocal(formHeading.value, formDescription.value, id, inputCoords);

      //create comp div based on local storage
      _createDiv(formHeading.value, formDescription.value, id, inputCoords);

      //render marker
      _renderMarker(inputCoords);

      //hide form
      _hideForm();
    }
  };

  //move to location in map
  const _moveToCoords = (coords) => {
    map.setView(coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    //15 is zoom level
  };

  // create a comp div when called.
  const _createDiv = (heading, description, id, inputCoords) => {
    //created comp div
    const comp = document.createElement("div");
    comp.classList.add("card__comp--div");

    comp.setAttribute("id", id);
    comp.setAttribute("coords", inputCoords);

    comp.addEventListener("click", () => {
      let coordsStr = document.getElementById(id).getAttribute("coords");
      coordsArr = coordsStr.split(",");
      _moveToCoords(coordsArr);
    });
    //created comp info div
    const compInfo = document.createElement("div");
    compInfo.classList.add("comp__info");
    comp.appendChild(compInfo);
    //created comp title
    const compTitle = document.createElement("h1");
    compTitle.classList.add("comp__info--tilte");
    compTitle.innerText = heading;
    compInfo.appendChild(compTitle);

    //created comp description
    const compDescription = document.createElement("p");
    compDescription.innerText = description;
    compDescription.classList.add("comp__info--description");
    compInfo.appendChild(compDescription);

    //created submit button
    const clearBtn = document.createElement("button");
    clearBtn.classList.add("comp--clear");
    clearBtn.innerText = "clear";
    //adding clear button functionality
    clearBtn.addEventListener("click", (e) => {
      //stop trigiring event on parent element
      e.stopPropagation();
      _deleteDiv(e);
      location.reload();
    });
    comp.appendChild(clearBtn);

    compContainer.prepend(comp);
    // compContainer.appendChild(comp);
  };

  //reads data from localStorage
  const _getDiv = () => {
    let inputData;
    if (localStorage.getItem("input__data") === null) {
      inputData = [];
    } else {
      inputData = JSON.parse(localStorage.getItem("input__data"));
    }

    inputData.forEach((data) => {
      _createDiv(data[0], data[1], data[2], data[3]);
    });
  };

  //delete the comp div when called
  const _deleteDiv = (e) => {
    e.preventDefault();
    const item = e.target;
    const parentDiv = item.parentElement;
    //getting heading and description value from the parent element
    const heading = parentDiv.children[0].children[0].innerText;
    const description = parentDiv.children[0].children[1].innerText;

    _removeLoacalStorage(heading, description);

    //hide the parent div
    parentDiv.classList.add("hideDiv");
  };

  //delete all the divs
  const _deleteAllDiv = () => {
    localStorage.removeItem("input__data");
    location.reload();
  };

  //save data on local storage
  const _saveLocal = (heading, description, id, inputCoords) => {
    let inputData;
    if (localStorage.getItem("input__data") === null) {
      inputData = [];
    } else {
      inputData = JSON.parse(localStorage.getItem("input__data"));
    }

    inputData.push([heading, description, id, inputCoords]);

    localStorage.setItem("input__data", JSON.stringify(inputData));
  };

  //remove items from local storage when called.
  const _removeLoacalStorage = (heading, description) => {
    //reads data from the local storage
    let inputData = JSON.parse(localStorage.getItem("input__data"));

    const removeItem = (arr) => {
      let newArr = [...arr];

      const index = newArr.findIndex(
        (element) => element[0] === heading && element[1] === description
      );
      if (index || index === 0) {
        newArr.splice(index, 1);
        return newArr;
      } else {
        return "item not found";
      }
    };
    //updated inputData value.
    inputData = removeItem(inputData, heading);
    //removing value from local storage.
    localStorage.setItem("input__data", JSON.stringify(inputData));
  };

  //Eventlisteners

  formSubmit.addEventListener("click", () => {
    let id = (Date.now() + "").slice(-10);
    let inputCoords = coordMarker;
    _addField(id, inputCoords);
  });

  clearAllBtn.addEventListener("click", () => {
    _deleteAllDiv();
  });

  // init

  document.addEventListener("DOMContentLoaded", () => {
    //load localstorage marker data
    let localData = JSON.parse(localStorage.getItem("input__data"));

    if (localData) {
      localData.forEach((data) => markerData.push(data[3]));
    }

    //get location
    _getLoaction();
    //get stored divs
    _getDiv();
  });
};

app();
