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






let addToCartBadge = document.querySelector('#addToCartBadge');



fetch('https://testing-e2f37-default-rtdb.firebaseio.com/products.json')
.then(res => res.json())
.then(data=> {


    // load data from local if Exist
    initializingFromLocal();

    // creating products cards
    createCards(data);

    // adding click event to all loaded buttons
    addToCartButtonClickEven()

    // set the number of counted categories
    numberingFilterBadge(data);



// ============================ [ Set filter from home page by category ] =============================
    if (getItem(localFilterChecked) != '0')
    {
        filters.forEach(
            filter => {
                let value = getItem(localFilterChecked);
                if ( filter.getAttribute('value') == value )
                
                {
        
                    if (getItem(localFilterChecked) != '0')
                    {
                        let bodyProductsContainer = document.querySelector("#bodyProducts");
                        bodyProductsContainer.innerHTML = "";
        
                        filter.checked = true;
                        let event = new Event('click');
                        filter.dispatchEvent(event);
                        setItem(localFilterChecked, 0);
                    }
        
                }
        
            }
        );


        


    }
    
});


function initializingFromLocal()
{
    
    if (getItem(localCartData) == null )
    {
        setItem(localCartData,null);
    }

    if (getItem(localAddToCartCountedNum) == null)
    {
        setItem(localAddToCartCountedNum,'0');
    }

    if (getItem(localPassedProduct) == null)
    {
        setItem(localPassedProduct,null);
    }

    // setting counted num from local to the add to cart badge
    let addToCartBadge = document.querySelector('#addToCartBadge');
    addToCartBadge.innerHTML = getItem(localAddToCartCountedNum);

}

// setting PassedProductId on the localStorage
function passedProductId(value)
{
    window.localStorage.setItem('passedProductId', value );
}


// Adding click event on all the addToCart buttons
function addToCartButtonClickEven()
{

    let card = document.querySelectorAll(".card");
    // Open the clicked card with setting its value on the localStorage
        card.forEach(
            c => {
               
                c.addEventListener('click', (e) => {
                    e.preventDefault();

                    let id = e.target.getAttribute('value');
                    setItem(localPassedProduct,e.target.getAttribute('value'));
                    window.open('productDetailPage.html', '_self')})
            }
        );


    // Selecting all addToCart anchors(button) 
    addToCartBtns = document.querySelectorAll('.card a'); 
    // looping over the buttons to add event for each one on add to cart click to count the page
    addToCartBtns.forEach(

        btn => btn.addEventListener( 'click', e => {

            e.stopPropagation();
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



            
            // addToCartBadge.innerHTML = `${++addToCartBadgeCounter}`;
            // window.localStorage.setItem(localAddToCartCountedNum, `${addToCartBadgeCounter}`)
            
        })
    );
}

// ============ [ SETTING NUMBERS OF THE BADGE FILTER ] =============================================
// the main function for showing the counted repeated categories number
function numberingFilterBadge(obj)
{
    // array to count each category
    let categoryArray = [ 0, 0, 0, 0, 0, 0];

    // looping over the categories of the products and counting each 
    // repeated category and set the value on the categoryArray
    for ( let element of obj )
    {
        switch (element.category)
        {
            // smartphones laptops fragrances skincare groceries home-decoration
            
            case 'smartphones':
            categoryArray[0]++;
            break;
            
            case 'laptops':
                categoryArray[1]++;
                break;
            
            case 'fragrances':
                categoryArray[2]++;
                break;
            
            case 'skincare':
                categoryArray[3]++;
                break;
            
            case 'groceries':
                categoryArray[4]++;
                break;
            
            case 'home-decoration':
                categoryArray[5]++;
                break;

            default:
                console.log("non");
                break;
        }
    }

    // setting filters badges with the counted categories for each filter type
    setFilterBadgeNum(categoryArray)

}

// accessing each filter badge span and setting assigning 
// tha passed array with each filter's inner html
function setFilterBadgeNum(countedNumArray)
{
         
    let smartphones =   document.querySelector('#filterBadge1');
    let laptops =       document.querySelector('#filterBadge2');
    let fragrances =    document.querySelector('#filterBadge3');
    let skincare =      document.querySelector('#filterBadge4');
    let groceries =     document.querySelector('#filterBadge5');
    let homeDecoration =document.querySelector('#filterBadge6');

    // using destructuring array assigned each inner http value with its equivalent 
    [smartphones.innerHTML,laptops.innerHTML,fragrances.innerHTML,skincare.innerHTML,groceries.innerHTML,homeDecoration.innerHTML] = countedNumArray;
    
}
// ======================================================================

//========================= [ CREATING CARDS ] ========================================================
// takes the data from fetching and then looping over it to send each product individually 
// to [ createCards ] function
function createCards(data){
    for ( let element of data)
    {
        
        cardCreator(element)
        
    };
}

// this function takes one product that passed from [ cardCreator ] function and creating 
// elements with assigning the class of each element and append it to the body
function cardCreator(obj)
{

    let bodyProductsContainer = document.querySelector("#bodyProducts");
        
    let cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'card m-1 mt-4');
    cardContainer.setAttribute('value', `${obj.id-1}`);
    cardContainer.style.width = '18rem';
    
        let cardImage = document.createElement('img');
            cardImage.setAttribute('class', 'card-img-top');
            cardImage.setAttribute('src',obj.thumbnail);
            cardImage.setAttribute('value', `${obj.id-1}`);

        let cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');
            cardBody.setAttribute('value', `${obj.id-1}`);

            let cardTitle = document.createElement('h5');
                cardTitle.setAttribute('class', 'card-title');
                cardTitle.setAttribute('value', `${obj.id-1}`);
                cardTitle.innerHTML = `${obj.title}`;

            let cardDescription = document.createElement('p');
                cardDescription.setAttribute('class', 'card-text');
                cardDescription.setAttribute('value', `${obj.id-1}`);
                cardDescription.innerHTML = `${obj.description}`;

            let cardPrice = document.createElement('h6');
                cardPrice.setAttribute('class', 'card-title')
                cardPrice.innerHTML = `${obj.price}LE`;
                cardPrice.setAttribute('value', `${obj.id-1}`);

            let addToCartBtn = document.createElement('a');
                addToCartBtn.setAttribute('class','btn btn-primary');
                addToCartBtn.setAttribute('value', `${obj.id-1}`);
                addToCartBtn.innerHTML = `<i value="${obj.id-1}" class="fa-solid fa-cart-shopping" style="color: white;"></i></i> Add To Cart`;

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDescription);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(addToCartBtn);

    cardContainer.appendChild(cardImage);
    cardContainer.appendChild(cardBody);

    bodyProductsContainer.appendChild(cardContainer);

}
//===============================================================

let current = new Array();


let filters = document.querySelectorAll('.form-check .form-check-input');

    filters.forEach(

        filter => {

            filter.addEventListener('click', e=>
            {

                let value = e.target.getAttribute('value');

                // remove the value of the filter if unchecked
                if ( current.length != 0 )
                {
                    let repeated = false;

                    for ( let index of current ) 
                    {
                        if (index == value)
                        {   
                            let toDelete = current.indexOf(index);
                            delete current[toDelete];
                            repeated = true;
                        }
                    }

                    if (!repeated)
                    {
                        current.push(value);
                    }
                }
                else
                {
                    current.push(value);
                }

                let arr = current.filter(e=>e);
                current = arr;
                

                if (current == '')
                {
                    showAll();
                }
                else{
                    showFiltered(current);
                }

            });

        }

    );


// =============================== [ Filtering Section ] ==============================
function showAll()
{
    let bodyProducts = document.querySelector('#bodyProducts'); 
        bodyProducts.innerHTML = '';
    fetch('https://testing-e2f37-default-rtdb.firebaseio.com/products.json')
.then(res => res.json())
.then(data=> {

    // creating products cards
    createCards(data);

        // adding click event to all loaded buttons
        addToCartButtonClickEven()


});
}

function showFiltered(arr)
{

    let bodyProducts = document.querySelector('#bodyProducts'); 
    bodyProducts.innerHTML = '';

    for ( index of arr )
    {

        getObjectByCategory(productsUrl, index);

    }
        console.log('s')

}

// ========================= [ Create only filtered cards ] =======================
function getObjectByCategory(url, category)
{
    fetch(url)
    .then(res=>res.json())
    .then(data=> {

        let state = false;

        for (let element of data)
        {
            
            if ( element.category == category )
            {
                execute(element);
                state = true;
            }

        }
        
        if (!state){
        console.log("Not found");
        // do something here ... write code to execute
        }

                // adding click event to all loaded buttons
                addToCartButtonClickEven()

    })

    function execute(data){
        // do something if it Work
        cardCreator(data);
    }
}


