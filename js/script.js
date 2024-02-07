//Blank global variables.
var username;
var age;
var gender;
var height;
var weight;
var activity;
var diet;
var warningDisplayed = false; // Tracking if the warning message has been displayed already
var mealObject = {
    mealOne: {
        oneItems: [],
        oneWeights: [],
    },
}
var mealItem  =mealObject.mealOne.oneItems;
var mealWeight = mealObject.mealOne.oneWeights;

// Load google charts
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// Function for a warning element

/* function createWarningElement(message) {
    var warningElement = document.createElement('div');
    warningElement.className = 'text-danger'; 
    warningElement.textContent = message;
    return warningElement;
}

 */



$("#about-form").on("submit", function (event) {
    event.preventDefault();

    // Get input values
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
    

    $("#dyn-name").text(username);
    location.href = "#meal-form";
    
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
        $("#meal-warning").remove();
        var mealItem  =mealObject.mealOne.oneItems;
        var mealWeight = mealObject.mealOne.oneWeights;
        mealItem.push(mealItemVal)
        mealWeight.push(mealWeightVal)
        $("#meal-list").append($("<li>").text(`${mealWeight[mealWeight.length-1]}g of ${mealItem[mealItem.length-1]}`))
    }
    console.log(mealObject)
})

// Meal form reset button function
$("#reset-meal-form").on("click", function(event){
    event.preventDefault();

    $("#meal-list").empty();
    mealObject.mealOne.oneItems = [];
    mealObject.mealOne.oneWeights= [];
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

    $.ajax(settings).done(function (response) {
        console.log(response);
        console.log(response.data.calorie);
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
    });


}

//Function to fetch API data for meal form input total calories. For loop used to sum the total calories.
function totalMealCalories(query){
$.ajax({
    method: 'GET',
    url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
    headers: { 'X-Api-Key': 'bbmC/ZvQmx/lB6Kb22gtQA==osiiqiKhgKtEUAqq'},
    contentType: 'application/json',
    success: function(result) {
        var TotalCalories = 0;
        for (let i = 0; i < result.items.length; i++) {
            
            TotalCalories += parseFloat(result.items[i].calories);
            TotalCalories = Math.round(TotalCalories);
            
        }
        if (TotalCalories>5000){
            $('.total-calorie-container').find('p').remove();
        
            $('.total-calorie-container').removeAttr('style').append($("<p>").text("Something went wrong, please reset and try again."));
        }else{
        displayCaloriesResult('.total-calorie-container', 'p', TotalCalories);
        }
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
})

}

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
