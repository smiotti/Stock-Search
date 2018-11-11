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
const stocksList = ['FB', 'AAPL', 'GE', `AMZN`, `IBM`, `CSCO`, `KO`, `SBUX`, `UPS`, `TR`, `HOG`];


// displaystockInfo function re-renders the HTML to display the appropriate content
const displayStockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  // Grab the number of News Articles to display from the uers input 
  const numArticles = $('#article-count').val();
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,Logo,news&range=last=${numArticles}`;

  // Creating an AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {


    for (let i = 0; i < numArticles; i++) {

    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');

    // Storing the company name
    const companyName = response.quote.companyName;

    // Creating an element to display the company name
    const nameHolder = $('<h5>').text(`${companyName}`);
    
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


    // Appending the logo to our stockDiv
    stockDiv.append(logoHolder);

    // Storing the price
    const stockPrice = response.quote.latestPrice;
   
    // Creating an element to display the price
    const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);

    // Appending the price to our stockDiv
    stockDiv.append(priceHolder);


    // Appending the news article Headline and associate url to stockDiv if it exists
     if (response.news[i].headline) {
      const companyNewsHeadline = response.news[i].headline;
      console.log(companyNewsHeadline);
      // Creating an element to display the news Headline
      const summaryHolder = $('<a>').text(`News Headline: ${companyNewsHeadline}`);
      summaryHolder.attr('href', response.news[i].url)
      summaryHolder.attr('target', '_blank');

      // Appending the Headline to our stockDiv
      stockDiv.append(summaryHolder);
    }


    // Storing the news Source if it exists
    const companyNewsSource = response.news[i].source;

    if (companyNewsSource) {
      console.log(companyNewsSource);
      // Creating an element to display the news Source
      const sourceHolder = $('<p>').text(`News Source: ${companyNewsSource}`);
      // Appending the Source to our stockDiv
      stockDiv.append(sourceHolder);
    }


    // Add published date, and append to document if exists
    const companyNewsDate = response.news[i].datetime;

    if (companyNewsDate) {
      stockDiv.append($('<p>').text('Article Date: ' + formatDate(response.news[i].datetime)));
      stockDiv.append($('<hr>'));
    }

   
    // Adding the stockDiv to the DOM
    // $('#stocks-view').html("");
    $('#stocks-view').prepend(stockDiv);

  }
  });
}


// FUnction for formatting the Article dates into a more readable format
const formatDate = function(date) {
  const months = [
    'January', 
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Create a new JavaScript Date object from the passed in date
  const dateObj = new Date(date);

  // return the date as a string in format 'Month DD, YYYY'
  return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
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
   
    
    // Adding a data-attribute
    newButton.attr('data-name', stocksList[i]);

      
    // Providing the initial button text
    newButton.text(stocksList[i]);
    

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





