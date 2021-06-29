//dom selectors
const card = document.getElementById("card");
const compContainer = document.querySelector(".card__comp--container");
const form = document.getElementById("card__form");
const formHeading = document.querySelector(".card__form--heading");
const formDescription = document.querySelector(".card__form--description");
const formSubmit = document.getElementById("card__form--btn");
const clearAllBtn = document.getElementById("clear-all");

const app = () => {
  let map;

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

    //click on map
    map.on("click", () => {
      _showForm();
    });
  };

  const _showForm = () => {
    //make input form visible
    form.style.display = "flex";
  };

  //Adds comps to the card.
  const _addField = () => {
    if (!formHeading.value || !formDescription.value) {
      alert("empty fields");
    }

    if (formHeading.value && formDescription.value) {
      //saveLoacal input hading and description
      _saveLocal(formHeading.value, formDescription.value);

      //create comp div based on local storage
      _createDiv(formHeading.value, formDescription.value);

      //hide form
      _hideForm();
    }
  };

  //Hides form
  const _hideForm = () => {
    // console.log("hide");
    form.style.display = "none";
    formHeading.value = "";
    formDescription.value = "";
  };

  // create a comp div when called.
  const _createDiv = (heading, description) => {
    //created comp div
    const comp = document.createElement("div");
    comp.classList.add("card__comp--div");
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
      _deleteDiv(e);
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
      _createDiv(data[0], data[1]);
    });
  };

  const _saveLocal = (heading, description) => {
    let inputData;
    if (localStorage.getItem("input__data") === null) {
      inputData = [];
    } else {
      inputData = JSON.parse(localStorage.getItem("input__data"));
    }

    inputData.push([heading, description]);

    localStorage.setItem("input__data", JSON.stringify(inputData));
  };

  const _deleteAllDiv = () => {
    console.log("delete");
    localStorage.removeItem("input__data");
    location.reload();
  };

  //delete the comp div when called

  const _deleteDiv = (e) => {
    const item = e.target;
    const parentDiv = item.parentElement;
    //getting heading and description value from the parent element
    const heading = parentDiv.children[0].children[0].innerText;
    const description = parentDiv.children[0].children[1].innerText;

    //have to call removeLocalStorage ______________
    _removeLoacalStorage(heading);

    //hide the parent div
    parentDiv.classList.add("hideDiv");
  };

  //remove items from local storage when called.
  const _removeLoacalStorage = (heading) => {
    //reads data from the local storage
    let inputData = JSON.parse(localStorage.getItem("input__data"));

    const removeItem = (arr) => {
      let newArr = [...arr];

      const index = newArr.findIndex((element) => element[0] === heading);
      console.log(index);
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
    _addField();
  });

  clearAllBtn.addEventListener("click", () => {
    _deleteAllDiv();
  });

  // init
  document.addEventListener("DOMContentLoaded", () => {
    //get location
    _getLoaction();
    //get stored divs
    _getDiv();
  });
};

app();

//https://stackoverflow.com/users/14703843/gourav-kumar

/* Everything working */
/* next goals */

//arrange adding of comp in reverse order--tick

//make clear buttons working.--tick

//then remove that cleared items from the saved location. -- tick

//make marker visible on form submit.
//make map zoom on click on comp

//Make minor changes in styling
