// needed for all pages
// add to cart counter and setting the badge
var localPassedProduct = "passedProductId";
var localAddToCartCountedNum = "AddToCartCountedNum";
var localCartData = "cartData";
var localFilterChecked = "filterChecked";
var localCurrentLogged = "currentLoggedId";
var localPassedHref = "PassedHref";
var localTotalPrice = "PassedTotalPrice";

// get and set in local storage
var addToCartBadgeCounter = getItem(localAddToCartCountedNum);

function getItem(key) {
  return window.localStorage.getItem(key);
}
function setItem(key, value) {
  window.localStorage.setItem(key, value);
}

// load data from local if Exist

initializingFromLocal();
function initializingFromLocal() {
  if (getItem(localCartData) == null) {
    setItem(localCartData, null);
  }

  if (getItem(localAddToCartCountedNum) == null) {
    setItem(localAddToCartCountedNum, 0);
  }

  if (getItem(localPassedProduct) == null) {
    setItem(localPassedProduct, null);
  }

  // setting counted num from local to the add to cart badge
  let addToCartBadge = document.querySelector("#addToCartBadge");
  addToCartBadge.innerHTML = getItem(localAddToCartCountedNum);
}

var productsUrl =
  "https://testing-e2f37-default-rtdb.firebaseio.com/products.json";
var usersUrl = "https://testing-e2f37-default-rtdb.firebaseio.com/users.json";
var commentsUrl =
  "https://testing-e2f37-default-rtdb.firebaseio.com/comments.json";

// ==================== [ Data Base Tools ] ============================================
function UpdateDataBase(url, id, key, value) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data[id][key] = value;

      putData(url, data);
    });
}
function DeleteDataBase(url, id, key) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      delete data[id][key];

      putData(url, data);
    });
}
function updateDataBaseAll(url, key, value) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (let element of data) {
        element[key] = value;
      }

      putData(url, data);
    });
}
function deleteDataBaseAll(url, key) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (let element of data) {
        delete element[key];
      }

      putData(url, data);
    });
}
function showData(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => console.log(data));
}
function putData(url, data) {
  data = JSON.stringify(data);

  let option = {
    method: "put",
    body: data,
    header: {
      "content-type": "application/json",
    },
  };

  fetch(url, option);
}
function searchDataBase(url, key) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let state = false;
      for (let element of data) {
        if (element[key] != undefined) {
          execute(element);
          state = true;
          break;
        }
      }

      if (!state) {
        console.log("Not found");
        // do something here ... write code to execute
      }
    });

  function execute(data) {
    console.log(data);
  }
}
function getDataBaseById(url, id) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let state = false;
      for (let element of data) {
        if (element.id == parseInt(id) + 1) {
          execute(element);
          state = true;
          break;
        }
      }

      if (!state) {
        console.log("Not found");
        // do something here ... write code to execute
      }
    });

  function execute(data) {
    // =============== [ Fetching Product Price Details ] ===================

    let name = document.querySelector("#productName");
    let brand = document.querySelector("#productBrand");
    let description = document.querySelector("#productDescription");
    let category = document.querySelector("#productCategory");
    let price = document.querySelector("#productPrice");

    name.innerHTML = `<strong>Title:</strong> ${data.title}`;
    brand.innerHTML = `<strong>brand:</strong> ${data.brand}`;
    description.innerHTML = `<strong>description:</strong> ${data.description}`;
    category.innerHTML = `<strong>category:</strong> ${data.category}`;
    price.innerHTML = `price: ${data.price}LE`;

    // ============= [ Fetching product Image ] ===============================

    for (element of data.images) {
      let imageContainer = document.querySelector("#imageSectionDetails");

      let image = document.createElement("img");
      image.setAttribute("class", "img-thumbnail w-50");
      image.setAttribute("src", element);

      imageContainer.appendChild(image);
    }
  }
}
// =========================================================================================-

// adding event for shopping cart button in the header to open cart page
let shoppingCartButton = document.querySelector("#headerShoppingCartButton");
shoppingCartButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("s");
  window.open("cartPage.html", "_self");
});

// ----------------------- [ Logged and UnLogged ] ---------------------------------
let logged = document.querySelector("#logged");
let unLogged = document.querySelector("#unLogged");

let currentId = getItem(localCurrentLogged);
if (currentId == "0" || !getItem(localCurrentLogged)) {
  logged.style.display = "none";
  setItem(localCurrentLogged, "0");
} else {
  unLogged.style.display = "none";
  getDataBaseByIdProfile(usersUrl, currentId);
}

function getDataBaseByIdProfile(url, id) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      for (let element of data) {
        if (element.id == id) {
          createLoggedProfile(element);
          console.log("1");
          break;
        }
      }
    });
}

function createLoggedProfile(obj) {
  let link = document.querySelector("#loggedLink");
  let image = document.createElement("img");
  image.setAttribute("class", "img-fluid align-middle");
  image.setAttribute("id", "loggedImage");
  image.setAttribute("src", obj.image);

  let text = document.createTextNode(` ${obj.firstName}`);

  link.appendChild(image);
  link.appendChild(text);
}

unLogged.addEventListener("click", (e) => {
  e.preventDefault();
  let currentUrl = window.location.href;
  setItem(localPassedHref, currentUrl);
  window.location.href = "../html/signInPage.html";
});

// =====================================================================================================================================================

let TotalAmount = 0;

function CreateCardsForCheck(obj) {
  let productsContainer = document.querySelector("#productsContainer");

  let cardContainer = document.createElement("div");
  cardContainer.setAttribute("id", "cardContainer");
  cardContainer.setAttribute("class", "card mb-3, w-100");

  let imageAndTextHolder = document.createElement("div");
  imageAndTextHolder.setAttribute("class", "row g-0");

  let imageHolder = document.createElement("div");
  imageHolder.setAttribute("class", "col-3");

  let image = document.createElement("img");
  image.setAttribute("class", "img-fluid rounded-start");
  image.setAttribute("src", obj.images[0]);

  let textContainer = document.createElement("div");
  textContainer.setAttribute("class", "row col-9");

  let productName = document.createElement("p");
  productName.setAttribute("class", "card-text col-12 smaller");
  productName.innerHTML = obj.title;

  let productPrice = document.createElement("h5");
  productPrice.setAttribute("class", "card-text fs-6 col-12");
  productPrice.innerHTML = `${obj.price}LE`;

  textContainer.appendChild(productName);
  textContainer.appendChild(productPrice);

  imageHolder.appendChild(image);

  imageAndTextHolder.appendChild(imageHolder);
  imageAndTextHolder.appendChild(textContainer);

  cardContainer.appendChild(imageAndTextHolder);

  productsContainer.appendChild(cardContainer);
  let br = document.createElement("hr");
  cardContainer.appendChild(br);
}

function getCartDataBaseById(url, id) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let state = false;
      for (let element of data) {
        if (element.id == parseInt(id) + 1) {
          execute(element);
          state = true;
          break;
        }
      }

      if (!state) {
        console.log("Not found");
        // do something here ... write code to execute
      }
    });
  function execute(data) {
    createCartProduct(data);
    TotalAmount = TotalAmount + data.price;

    totalPrice.innerHTML = TotalAmount;
  }
}

function getStoredData() {
  if (getItem(localCartData) != null) {
    let dataStore = getItem(localCartData).split(",");
    for (let item of dataStore) {
      getCartDataBaseById(productsUrl, parseInt(item));
    }
  }
}

function getCartDataBaseById(url, id) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let state = false;
      for (let element of data) {
        if (element.id == parseInt(id) + 1) {
          execute(element);
          state = true;
          break;
        }
      }

      if (!state) {
        console.log("Not found");
        // do something here ... write code to execute
      }
    });
  function execute(data) {
    CreateCardsForCheck(data);
    TotalAmount = TotalAmount + data.price;

    totalPrice.innerHTML = TotalAmount;
  }
}

getStoredData();

var cardName = document.getElementById("cardName");

var cardNum1 = document.getElementById("firstFour");
var cardNum2 = document.getElementById("secondFour");
var cardNum3 = document.getElementById("thirdFour");
var cardNum4 = document.getElementById("fourthFour");
var cardNumAll = document.querySelectorAll(".cardNum");
var alertMsg = document.getElementById("alert");
var doneMsg = document.getElementById("doneMsg");

var expirationDate = document.getElementById("expirationDate");
var cvv = document.getElementById("cvv");

var payBtn = document.getElementById("payBtn");

// card number validation/////////////////

for (let i = 0; i < cardNumAll.length; i++) {
  cardNumAll[i].addEventListener("keypress", prev);
  cardNumAll[i].addEventListener("keyup", check);
  function prev(event) {
    if (event.key.match(/[0-9]/i)) {
    } else {
      event.preventDefault();
    }
  }
  function check() {
    if (cardNumAll[i].value.length > 3 && i <= 2) {
      cardNumAll[i].blur();
      cardNumAll[i + 1].focus();
    } else if (cardNumAll[i].value.length > 3 && i == 3) {
      cardNumAll[i].blur();
      expirationDate.focus();
    }
  }
}

/////////////////////Expiration Date validation////
expirationDate.addEventListener("keypress", (event) => {
  if (event.key.match(/[0-9\/]/i)) {
  } else {
    event.preventDefault();
  }
});
expirationDate.addEventListener("keyup", () => {
  if (expirationDate.value.length == 7) {
    expirationDate.blur();
    cvv.focus();
  }
});

////////////////////////////////////////////////////////////// Alert Validation /////////////////////////////////////////////////////////

///////////cvv validation////////////////////////
cvv.addEventListener("keypress", prev);

///////////////////////////////////////////////
payBtn.addEventListener("click", checkForm);

function checkForm() {
  // card name //////////////////
  if (cardName.value.match(/^[a-z\s]{3,}/gim)) {
    // card number////////////////////////
    if (cardNumFunc()) {
      // expiration Date////////////////////////////////////
      if (expirationDate.value.match(/[0-9]{2}\/[0-9]{4}/)) {
        // cvv//////////
        if (cvv.value.match(/[0-9]{3}/)) {
          ////////////////////////////done////////////////////////////////
          doneMsg.style.opacity = "1";
          setTimeout(() => {
            doneMsg.style.opacity = "0";

            setItem(localAddToCartCountedNum,0);
            setItem(localCartData,null);
            window.location.href = '../html/productsPage.html';


          }, 2000);
          /////////////////////////////////////////////////
        } else {
          alertMsg.innerText = "CVV Invalid";
          alertMsg.style.opacity = "1";
          setTimeout(() => {
            alertMsg.style.opacity = "0";
          }, 2000);
        }
        /////////////////////////////////
      } else {
        alertMsg.innerText = "Expiration Date Invalid";
        alertMsg.style.opacity = "1";
        setTimeout(() => {
          alertMsg.style.opacity = "0";
        }, 2000);
      }
      /////////////////
    } else {
      alertMsg.innerText = "Card Number Invalid";
      alertMsg.style.opacity = "1";
      setTimeout(() => {
        alertMsg.style.opacity = "0";
      }, 2000);
    }
    ///////////
  } else {
    alertMsg.innerText = "Card Name Invalid";
    alertMsg.style.opacity = "1";
    setTimeout(() => {
      alertMsg.style.opacity = "0";
    }, 2000);
  }




}

// card numbers validation assest//////////////////

function cardNumFunc() {
  for (let i = 0; i < cardNumAll.length; i++) {
    if (cardNumAll[i].value.length == 4) {
      return true;
    } else {
      return false;
    }
  }
}
