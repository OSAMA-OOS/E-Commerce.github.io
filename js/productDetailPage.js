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
                console.log('1');
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



// Load the the product that have been clicked.

getDataBaseById(productsUrl,getItem(localPassedProduct))

// load comments to the page
function PlaceComments(url){
    fetch(url)
    .then(res=>res.json())
    .then(data=>{

        for ( let obj of data )
        {
            createComment(obj);
        }

    })
}

// Creating elements and append it on the comment body
function createComment(obj)
{

    let commentContainer = document.querySelector("#commentContainer");

    let listItem = document.createElement('li');
        listItem.setAttribute('class', 'list-group-item d-flex flex-wrap');

    let profileContainer = document.createElement('div');
        profileContainer.setAttribute('class', 'col-12 fs-4 d-flex align-items-center justify-content-start');
        profileContainer.setAttribute('id', 'commentProfile');

        let commentImage = document.createElement('img');
            commentImage.setAttribute('src',`https://picsum.photos/50/${50+parseInt(obj.id)}`);
            commentImage.setAttribute('id','commentProfileImage' );

        let commentName = document.createElement('div');
            commentName.setAttribute('class', 'fs-4');
            commentName.setAttribute('id', 'commentName');
            commentName.innerHTML = obj.username;

    let commentText = document.createElement('div');
        commentText.setAttribute('class', 'col-12');
        commentText.innerHTML = obj.body;

        profileContainer.appendChild(commentImage);
        profileContainer.appendChild(commentName);

        listItem.appendChild(profileContainer);
        listItem.appendChild(commentText)

        commentContainer.appendChild(listItem)



}
PlaceComments(commentsUrl);

let addToCartButton = document.querySelector('#cartPriceDetails a');
    addToCartButton.setAttribute('value', getItem(localPassedProduct));

addToCartButton.addEventListener('click', e => {

    e.preventDefault();


    let dataStore = new Array();

            if (getItem(localCartData) == 'null')
            {

                dataStore = [e.target.getAttribute('value')];
                setItem(localCartData, dataStore);

                setItem(localAddToCartCountedNum, getItem(localCartData).split(',').length);
                initializingFromLocal();

            }
            
            else
            {   

                dataStore = getItem(localCartData).split(',');
                let repeated = false;

                // check if the element is repeated
                for ( let element of dataStore )
                {  
                    if ( element == e.target.getAttribute('value') )
                    {
                        repeated = true;
                    }                    
                }

                // if not repeated push the value to the local storage
                if (!repeated)
                {
                    dataStore.push(e.target.getAttribute('value'));
                    setItem(localCartData, dataStore);


                    setItem(localAddToCartCountedNum, getItem(localCartData).split(',').length);
                    initializingFromLocal();

                }

            }

    

    

    
    initializingFromLocal();
});


// ---------------------------------------------------------------------------------

