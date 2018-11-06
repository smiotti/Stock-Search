// Validation stock symbol array for all availalbe stock symbols in iexTrading 
const validationList = [];


 // Creating an AJAX call for all stock symbol data to be stored in array 
 $.ajax({
    url: `https://api.iextrading.com/1.0/ref-data/symbols?`,
    method: 'GET'
  }).then(function(response) {

    for (let i = 0; i < response.length; i++) {
    stockSymbol = response[i].symbol;
    validationList.push(stockSymbol);
    // console.log(validationList);
    };

});


// Initial array of stocks
const stocksList = ['FB', 'AAPL', 'GE', `AMZN`, `IBM`, `CSCO`, `KO`, `SBUX`, `UPS`, `HOG`];


// displaystockInfo function re-renders the HTML to display the appropriate content
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,Logo,news&range=1m&last=1`;

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {

    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');

    // Storing the company name
    const companyName = response.quote.companyName;

    // Creating an element to display the company name
    const nameHolder = $('<p>').text(`Company Name: ${companyName}`);

    // Appending the name to our stockDiv
    stockDiv.append(nameHolder);

    // Storing the company logo
    const stockLogo = response.Logo.url;

    // Creating an element to display the logo
    var logoHolder = $('<img />').attr({
        'id': companyName,
        'src': stockLogo,
        'alt': 'Company logo',
        'width': 25   
    });

     // const logoHolder = $('<img />').attr(`"src" + "${stockLogo}"`);
    // <img src="https://storage.googleapis.com/iex/api/logos/GE.png" height="25px" width="25px" alt="Company Logo">
    // https://www.encodedna.com/jquery/dynamically-add-image-to-div-using-jquery-append-method.htm


    // Appending the logo to our stockDiv
    stockDiv.append(logoHolder);

    // Storing the price
    const stockPrice = response.quote.latestPrice;

    // Creating an element to display the price
    const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);

    // Appending the price to our stockDiv
    stockDiv.append(priceHolder);

    // Storing the first news summary
    const companyNews = response.news[0].summary;

    // Creating an element to display the news summary
    const summaryHolder = $('<p>').text(`News Headline: ${companyNews}`);

    // Appending the summary to our stockDiv
    stockDiv.append(summaryHolder);

    // Finally adding the stockDiv to the DOM
    // Until this point nothing is actually displayed on our page
    $('#stocks-view').append(stockDiv);
  });

}

// Function for displaying stock data buttons
const render = function () {

  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();

  // Looping through the array of stocks
  for (let i = 0; i < stocksList.length; i++) {

    // Then dynamicaly generating buttons for each stock in the array
    // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
    const newButton = $('<button>');
    
    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');
    newButton.addClass('btn-sm');
    // newButton.addClass('btn-primary');
    
    // Adding a data-attribute
    newButton.attr('data-name', stocksList[i]);

      
    // Providing the initial button text
    newButton.text(stocksList[i]);
    

            // add some validation to prevent duplicate buttons??


    // Adding the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function(event) {

  // event.preventDefault() prevents the form from trying to submit itself.
  // We're using a form so that the user can hit enter instead of clicking the button if they want
  event.preventDefault();

  // This line will grab the text from the input box, trim off any spaces and convert the string to uppercase letters
  const stock = $('#stock-input').val().trim().toUpperCase();
  let inList=false;

    // validating submitted stock sybmol is in the iexTrading list
     for (let i = 0; i < validationList.length; i++) {
        if (stock === validationList [i]) {
               
        // The stock from user input is valid...add to array
        stocksList.push(stock);
        inList=true;
        }
    }
     // The stock from user input is not valid...alert user
     if (inList == false) {
        alert (stock + " is not a valid stock symbol!");
    }



  // The stock from the textbox is then added to our array
//   stocksList.push(stock);

  // Deletes the contents of the input
  $('#stock-input').val('');

  // calling render which handles the processing of our stock array
  render();
}

// Even listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Calling the renderButtons function to display the intial buttons
render();










// 4. Add a form to your page that takes the value from a user input box and adds it into your `stocksList` 
// array only if the input exists in our `validationList`. Hint: You'll want to make sure the user input 
// is always capitalized. Then make a function call that takes each topic in the array remakes 
// the buttons on the page.



