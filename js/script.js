//Blank global variables for user about inputs (for Daily recommended calories query).
var username;
var age;
var gender;
var height;
var weight;
var activity;
var diet;

// Tracking if the warning message has been displayed already
var warningDisplayed = false; 

//Obect array to store meal inputs (for total calorie intake query)
var mealObject = {
    mealOne: {
        oneItems: [],
        oneWeights: [],
    },
}

var actualCarbs = 0;
var actualFat = 0;
var actualProtein = 0;

var mealItem  =mealObject.mealOne.oneItems;
var mealWeight = mealObject.mealOne.oneWeights;

// Function for a warning element (if any input fields are left blank/invalid data)
function createWarningElement(message) {
    var warningElement = document.createElement('div');
    warningElement.className = 'text-danger'; 
    warningElement.textContent = message;
    return warningElement;
}




$("#about-form").on("submit", function (event) {
    event.preventDefault();

    // Capture user's information values    
    username = $("#name-input").val();
    age = $("#age-input").val();
    gender = $("#gender-input").val();
    height = $("#height-input").val();
    weight = $("#weight-input").val();
    activity = $("#activity-input").val();
    diet = $(".form-check input:radio:checked").val();

    if (!username || !age || !gender || !height || !weight || !activity || !diet) {
        // If any field is empty, return without showing the modal
        return;
    }

    // Add the data attributes to #modal-calories and display the modal sequencially in case all fields are filled
  $("#about-submit").attr({ "data-bs-toggle": "modal", "data-bs-target": "#modal-calories" });
  $('#modal-calories').modal('show'); 

    aboutFormStorageSet();
    dailyRecommendedCalorieFetch();

    //Adds personalised message using input name value from user    
    $("#dyn-name").text(username);
    //location.href = "#meal-form";
    
});

$(document).ready(function () {
    // Reset button functionality for About form
    $("#reset-user-form").on("click", function(event){
        event.preventDefault();
        
        $("#name-input").val("");
        $("#age-input").val("");
        $("#gender-input").val("");
        $("#height-input").val("");
        $("#weight-input").val("");
        $("#activity-input").val("");
        $(".form-check-input").prop('checked', false); 
        // Removes any existing warning message, after page reset
        $("#modal-calories .text-danger").remove();

    // resets local storage
    localStorage.clear()

})

});





//Button to push meal inputs into object array, and append list item to page.
$("#meal-add").on("click", function(event){
    event.preventDefault();
    var mealItemVal = $("#meal-item").val()
    var mealWeightVal = $("#meal-weight").val()

    if(mealItemVal !== "" && mealWeightVal !== ""){
        var mealItem  =mealObject.mealOne.oneItems;
        var mealWeight = mealObject.mealOne.oneWeights;
        mealItem.push(mealItemVal)
        mealWeight.push(mealWeightVal)
        $("#meal-list").append($("<li>").text(`${mealWeight[mealWeight.length-1]}g of ${mealItem[mealItem.length-1]}`))
    }
    console.log(mealObject)
})

// Reset Meal form 
$("#reset-meal-form").on("click", function(event){
    event.preventDefault();

    $("#meal-list").empty();
    mealObject.mealOne.oneItems = [];
    mealObject.mealOne.oneWeights= [];

    TotalCalories = 0;
    console.log(TotalCalories);
})

//Meal form submit function to capture values of the form and construct the query string. totalMealCalories fetch function is called and query string is passed through as a parameter.
$("#meal-form").on("submit", function(event){
    event.preventDefault();
    if(mealItem.length === 0){
        $("#meal-warning").remove();
        $("#meal-form").append($("<p>").attr("id","meal-warning").addClass("text-danger").text("Please enter at least one meal."));
    }else{
        $("#meal-warning").remove();
        var query = ""
        for (let i = 0; i < mealItem.length; i++) {
            query += `${mealWeight[i]}g ${mealItem[i]} `  
        }
        console.log(query);
        totalMealCalories(query);
    
    //If the prepare meals form fields are not empty, the #modal-prepare-meal hides and #modal-total-calories come up
    $('#modal-prepare-meal').modal('hide');
    $('#modal-total-calories').modal('show');
    }
  
})

//Function to store inputs on the about form into localStorage.
function aboutFormStorageSet() {
    localStorage.setItem("nameStorage", username)
    localStorage.setItem("ageStorage", age)
    localStorage.setItem("genderStorage", gender)
    localStorage.setItem("heightStorage", height)
    localStorage.setItem("weightStorage", weight)
    localStorage.setItem("activityStorage", activity)
    localStorage.setItem("dietStorage", diet)
}

//Function to set text inputs on the about form to previous inputs saved to localStorage.
function aboutFormStorageGet() {
    $("#name-input").val(localStorage.getItem("nameStorage"))
    $("#age-input").val(localStorage.getItem("ageStorage"))
    $("#gender-input").val(localStorage.getItem("genderStorage"))
    $("#height-input").val(localStorage.getItem("heightStorage"))
    $("#weight-input").val(localStorage.getItem("weightStorage"))
    $("#activity-input").val(localStorage.getItem("activityStorage"))

    // append name to meal form header
    $("#dyn-name").text(localStorage.getItem("nameStorage"));
}

//Function call to set text inputs on page load.
aboutFormStorageGet();

//Function to fetch API data for daily recommended calories and to then append it to the page.
function dailyRecommendedCalorieFetch(){
    
    const settings = {
        async: true,
        crossDomain: true,
        url: "https://fitness-calculator.p.rapidapi.com/macrocalculator?age="+age+"&gender="+gender+"&height="+height+"&weight="+weight+"&activitylevel="+activity+"&goal=maintain",
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '611029d5cdmsh95b408358857d6dp125829jsnd98c774d80d9',
            'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
        }
    };

    //Make Ajax request
    $.ajax(settings).done(function (response) {
        console.log(response);
        //console.log(response.data.calorie);

        //Round float value to a whole number
        var recommendedCalories = Math.round(response.data.calorie);
        
        var dietCarbs = response.data[diet].carbs;
        var dietFat = response.data[diet].fat;
        var dietProtein = response.data[diet].protein;

        console.log(dietCarbs);
        console.log(dietFat);
        console.log(dietProtein);

        displayCaloriesResult('.daily-recommend-container', 'p', recommendedCalories);
               // Add the attributes to the modal only when the form is valid
    /* $("#about-submit").attr({ "data-bs-toggle": "modal", "data-bs-target": "#modal-calories" }); */


    var dietCarbs = response.data[diet].carbs;
    var dietFat = response.data[diet].fat;
    var dietProtein = response.data[diet].protein;

    console.log(dietFat);
    console.log(dietProtein);
    console.log(dietCarbs);

    $(rCarb).text(dietCarbs);
    $(rFat).text(dietFat);
    $(rProtein).text(dietProtein);
    
    });

};





//Function to fetch API data for meal form input total calories. For loop used to sum the total calories.
function totalMealCalories(query) {
$.ajax({
    method: 'GET',
    url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
    headers: { 'X-Api-Key': 'bbmC/ZvQmx/lB6Kb22gtQA==osiiqiKhgKtEUAqq'},
    contentType: 'application/json',
    success: function(result) {

        var TotalCalories = 0;

        var actualCarbs = 0;
        var actualFat = 0;
        var actualProtein = 0;
        for (let i = 0; i < result.items.length; i++) {
            
            TotalCalories += parseFloat(result.items[i].calories);
            TotalCalories = Math.round(TotalCalories);
            
        actualCarbs += Math.round(result.items[i].carbohydrates_total_g*10)/10;
        actualFat += Math.round(result.items[i].fat_total_g*10)/10;
        actualProtein += Math.round(result.items[i].protein_g*10)/10;

        }
        if (TotalCalories>5000){
            $('.total-calorie-container').find('p').remove();
        
            $('.total-calorie-container').removeAttr('style').append($("<p>").text("Something went wrong, please reset and try again."));
        }else{
        displayCaloriesResult('.total-calorie-container', 'p', TotalCalories);}

        // Traffic light system for Total Calories

        var CaloriesRec = parseFloat($(".daily-recommend-container p").text());

      
        if(Math.abs(TotalCalories-CaloriesRec) < 200){
            $("#totalTextContainer").attr("style", "background-color: var(--green-light);");
        }else if (Math.abs(TotalCalories-CaloriesRec) < 400 && Math.abs(TotalCalories-CaloriesRec) > 200){
            $("#totalTextContainer").attr("style", "background-color: var(--amber-light);");
        }else if(Math.abs(TotalCalories-CaloriesRec) > 400){
            $("#totalTextContainer").attr("style", "background-color: var(--red-light);");
        }
        

        // Pie chart data


        var pElCarb = Math.round(parseFloat( $("#rCarb").text()) *10)/10;
        var pElFat = Math.round(parseFloat( $("#rFat").text()) *10)/10;
        var pElProtein = Math.round(parseFloat( $("#rProtein").text()) *10)/10;

        var pElTotal = Math.round(parseFloat(pElCarb +pElFat+pElProtein) *10)/10;
        var actualTotal = Math.round(actualCarbs + actualFat + actualProtein*10)/10;

        var actualfracCarbs =  Math.round(actualCarbs/actualTotal*10)/10;
        var actualfracFat =  Math.round(actualFat/actualTotal*10)/10;
        var actualfracProtein =  Math.round(actualProtein/actualTotal*10)/10;

        var recCarb = (pElCarb/pElTotal) *100;
        var recFat = (pElFat/pElTotal) *100;
        var recProtein = (pElProtein/pElTotal) *100;

        
        // Load the Visualization API and the corechart package.
        google.charts.load('current', {'packages':['corechart']});
        
        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(drawChart);
        
        // Callback that creates and populates a data table,
        // instantiates the pie chart, passes in the data and
        // draws it.
        function drawChart() {
            // Recommended Pie Chart
            
            // Set Data
        var data1 = new google.visualization.DataTable();
        data1.addColumn('string', 'Macronutrients');
        data1.addColumn('number', 'amount');
        data1.addRows([
          ['Carbohydrates', recCarb],
          ['Fats', recFat],
          ['Protein', recProtein]
        ]);
        
        // Set Options
        const options1 = {
          'title' : 'Recommended Daily Macronutrients',
                    'legend': 'none'
                    
        };
        // Draw
        const chart1 = new google.visualization.PieChart(document.getElementById('rec-pie'));
        chart1.draw(data1, options1);


        // Actual diet PieChart

        // Set Data
        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'Macronutrients');
        data2.addColumn('number', 'amount');
        data2.addRows([
          ['Carbohydrates', actualfracCarbs],
          ['Fats', actualfracFat],
          ['Protein', actualfracProtein]
        ]);
        
        // Set Options
        const options2 = {
          'title' : 'Actual Daily Macronutrients',
          'legend': 'none'
        };
        
        // Draw
        const chart2 = new google.visualization.PieChart(document.getElementById('actual-pie'));
        chart2.draw(data2, options2);          
    }    

    },
error: function ajaxError(jqXHR) {
    console.error('Error: ', jqXHR.responseText);
        }
});
};


//   Saves FAQ entered by user into local storage
var faq = [];

$("#faq-submit").on("click", function(e){
    e.preventDefault();

    faq.push($("#faq-input").val());

    localStorage.setItem("faqArr", JSON.stringify(faq));

    console.log(`User FAQs: ${JSON.parse(localStorage.getItem("faqArr"))}`);

    $("#faq-input").val("")


    $("#submit-msg").append($("<p>").attr("id", "faq-submitted-text").text("Submitted!"))
        
    setTimeout(function () { 
         $("#faq-submitted-text").remove();
    },3000)

});



/*
 * function displayCaloriesResult(container, elem, calories);
 *
 * @param {Object} container Parent Element containing children
 * Element tags for displaying colories results from API calls.
 * 
 * @param {string} Element tag to be created and added to
 * container parameter.
 * 
 * @param {Number} calories API call returned result.
*/


function displayCaloriesResult(container, elem, calories) {
    $(container).find(elem).remove();
        
    $(container).css({
                      display: "flex",
                      fontSize: "18px",
                      justifyContent: "center",
                      fontSize: "2em",
                      fontWeight: "600" })
            .append(`<`+elem+`>&nbsp; ${calories} calories </`+elem+`>`);
}



// JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()
