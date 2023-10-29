// needed for all pages
// add to cart counter and setting the badge
var localPassedProduct = 'passedProductId';
var localAddToCartCountedNum = 'AddToCartCountedNum';
var localCartData = 'cartData';
var localFilterChecked = 'filterChecked';
var localCurrentLogged = 'currentLoggedId';
var localPassedHref = 'PassedHref';
var localTotalPrice = 'PassedTotalPrice';

// get and set in local storage
var addToCartBadgeCounter = getItem(localAddToCartCountedNum);

function getItem ( key )
{
    return window.localStorage.getItem(key);
}
function setItem (key, value)
{
    window.localStorage.setItem(key, value);
}

    // load data from local if Exist


initializingFromLocal();
function initializingFromLocal(){
    
    if (getItem(localCartData) == null )
    {
        setItem(localCartData,null);
    }

    if (getItem(localAddToCartCountedNum) == null)
    {
        setItem(localAddToCartCountedNum,0);
    }

    if (getItem(localPassedProduct) == null)
    {
        setItem(localPassedProduct,null);
    }

    // setting counted num from local to the add to cart badge
    let addToCartBadge = document.querySelector('#addToCartBadge');
    addToCartBadge.innerHTML = getItem(localAddToCartCountedNum);
};

var productsUrl = 'https://testing-e2f37-default-rtdb.firebaseio.com/products.json';
var usersUrl = 'https://testing-e2f37-default-rtdb.firebaseio.com/users.json';
var commentsUrl = 'https://testing-e2f37-default-rtdb.firebaseio.com/comments.json';




// ==================== [ Data Base Tools ] ============================================
function UpdateDataBase     (url,id,key,value){

    fetch(url)
    .then(res => res.json())
    .then(data=> {

        data[id][key] = value;

        putData(url,data);

});
}
function DeleteDataBase     (url,id,key){
    
    fetch(url)
    .then(res => res.json())
    .then(data=> {

        delete data[id][key];

        putData(url,data);

});
}    
function updateDataBaseAll  (url,key,value){
    
    fetch(url)
    .then(res => res.json())
    .then(data=> {

        
        for ( let element of data )
        {

            element[key] = value;
        }

        putData(url,data);

});
}
function deleteDataBaseAll  (url,key){
    
    fetch(url)
    .then(res => res.json())
    .then(data=> {

        
        for ( let element of data )
        {

            delete element[key];
        }

        putData(url,data);

});
}
function showData(url){
    fetch(url)
    .then(res=>res.json())
    .then(data=>console.log(data))
}
function putData (url, data){
    
    data = JSON.stringify(data);

    let option = {
        method:'put',
        body:data,
        header:{
            'content-type':'application/json'
        }
    };

    fetch(url, option);

}
function searchDataBase(url, key)
{
    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        let state = false;
        for (let element of data)
        {
            
            if ( element[key] != undefined )
            {
                execute(element);
                state = true;
                break;
            }

        }
        
        if (!state){
        console.log("Not found");
        // do something here ... write code to execute
        }

    })

    function execute(data){
        console.log(data);
    }

}
function getDataBaseById(url, id)
{
    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        let state = false;
        for (let element of data)
        {
            
            if ( element.id == parseInt(id)+1 )
            {
                execute(element);
                state = true;
                break;
            }

        }
        
        if (!state){
        console.log("Not found");
        // do something here ... write code to execute
        }

    })

    function execute(data){
// =============== [ Fetching Product Price Details ] ===================

        let name = document.querySelector('#productName');
        let brand = document.querySelector('#productBrand');
        let description = document.querySelector('#productDescription');
        let category = document.querySelector('#productCategory');
        let price = document.querySelector('#productPrice');

        name.innerHTML = `<strong>Title:</strong> ${data.title}`;
        brand.innerHTML = `<strong>brand:</strong> ${data.brand}`;
        description.innerHTML = `<strong>description:</strong> ${data.description}`;
        category.innerHTML = `<strong>category:</strong> ${data.category}`;
        price.innerHTML = `price: ${data.price}LE`;


    
// ============= [ Fetching product Image ] ===============================

        for ( element of data.images )
        {

            let imageContainer = document.querySelector('#imageSectionDetails');

            let image = document.createElement('img');
                image.setAttribute('class','img-thumbnail w-50');
                image.setAttribute('src',element)
                
                imageContainer.appendChild(image);

        }




    }
}
// =========================================================================================-

// adding event for shopping cart button in the header to open cart page
let shoppingCartButton = document.querySelector('#headerShoppingCartButton');
shoppingCartButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('s')
    window.open('cartPage.html', '_self');
});


// ----------------------- [ Logged and UnLogged ] ---------------------------------
let logged = document.querySelector('#logged');
let unLogged = document.querySelector('#unLogged');

let currentId = getItem(localCurrentLogged);
if (currentId == '0' || !getItem(localCurrentLogged))
    {
        logged.style.display = 'none';
        setItem(localCurrentLogged, '0');
    }
    else
    {
        unLogged.style.display = 'none';
        getDataBaseByIdProfile(usersUrl, currentId);
    }


function getDataBaseByIdProfile(url, id)
{
    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        for (let element of data)
        {
            if ( element.id == id )
            {
                createLoggedProfile(element);
                break;
            }
        }
    })
}   

function createLoggedProfile(obj){
    let link = document.querySelector('#loggedLink');
    let image = document.createElement('img');
        image.setAttribute('class', 'img-fluid align-middle');
        image.setAttribute('id', 'loggedImage');
        image.setAttribute('src', obj.image);

    let text = document.createTextNode(` ${obj.firstName}`);

    link.appendChild(image);
    link.appendChild(text);
}

unLogged.addEventListener('click', e => {
    e.preventDefault();
    let currentUrl = window.location.href;
    setItem(localPassedHref, currentUrl);
    window.location.href = '../html/signInPage.html';
});

// =====================================================================================================================================================


let totalPrice = document.querySelector("#totalPrice");

var TotalAmount = null;

// clear the add to cart badge when clicked
let clearCart = document.querySelector('#clearCartButton');
    clearCart.addEventListener('click', e => {

        setItem(localAddToCartCountedNum, '0' );
        setItem(localCartData, null);
        let cartProductContainer = document.querySelector('#cartProductsContainer');
        cartProductContainer.innerHTML='';
        setItem(localCartData, null);
        getStoredData();
        totalPrice.innerHTML = 'Total Price: 0LE'



        // I'mHere
        let addToCartBadge = document.querySelector('#addToCartBadge');
        addToCartBadge.innerHTML = getItem(localAddToCartCountedNum);

    });



getStoredData()

function getStoredData()
{ if (getItem(localCartData) != null){

   

    let dataStore = getItem(localCartData).split(',');
    for (let item of dataStore)
    {
        getCartDataBaseById(productsUrl, parseInt(item)) 
         
    }


}}

function getCartDataBaseById(url, id)
{

    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        let state = false;
        for (let element of data)
        {
            if ( element.id == parseInt(id)+1 )
            {
                execute(element);
                state = true;
                break;
            }
        }
    })

    function execute(data){
        if (TotalAmount == null)
            {TotalAmount = 0;}
        createCartProduct(data);
        TotalAmount = TotalAmount + data.price;      
        totalPrice.innerHTML = `Total Price: ${TotalAmount}LE`;
    }

}

function createCartProduct(obj)
{

    let cartProductContainer = document.querySelector('#cartProductsContainer');

    let mainContainer = document.createElement('div');
        mainContainer.setAttribute('class', 'card mb-3 w-75');

        let secondContainer = document.createElement('div');
            secondContainer.setAttribute('class', 'row g-0');
            
            let  imageContainer = document.createElement('div');
                imageContainer.setAttribute('class', 'col-md-3');

                let image = document.createElement('img');
                image.setAttribute('class', 'img-fluid rounded-start');
                image.setAttribute('src',`${obj.images[0]}`);

            let thirdContainer = document.createElement('div');
                thirdContainer.setAttribute('class','col-md-9');

                let cardBody = document.createElement('div');
                    cardBody.setAttribute('class', 'card-body');

                    let cartTitle = document.createElement('div');
                        cartTitle.setAttribute('class', 'card-title');
                        cartTitle.innerHTML = `<strong>Product Name:</strong> ${obj.title}`;

                    let cardText = document.createElement('p');
                        cardText.setAttribute('class', 'card-text');
                        cardText.innerHTML = `<strong>Description:</strong> ${obj.description}`;

                    let price = document.createElement('h4');
                        price.setAttribute('class', 'card-title');
                        price.innerHTML = `<strong>Price: ${obj.price}</strong>`;

    cardBody.appendChild(cartTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(price);

    thirdContainer.appendChild(cardBody);

    imageContainer.appendChild(image);

    secondContainer.appendChild(imageContainer);
    secondContainer.appendChild(thirdContainer);

    mainContainer.appendChild(secondContainer);

    cartProductContainer.appendChild(mainContainer);

}


// ----------- [ Check Button ] --------------------
let checkoutButton = document.querySelector('#checkOutButton');
    checkoutButton.addEventListener('click', e => {

        e.preventDefault();
        if (currentId == '0' || !getItem(localCurrentLogged))
        {
            let currentUrl = window.location.href;
            setItem(localPassedHref,currentUrl);
            window.location.href = '/html/signInPage.html';
        }
        
        else 
        {   
            if ( getItem(localCartData) == 'null' )
            {
                console.log('Empty Cart');
            }
            else
            {
                setItem(localTotalPrice, TotalAmount);
                window.location.href = '../html/paymentPage.html';
            }
        }


    });