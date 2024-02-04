//Blank global variables.
var username;
var age;
var gender;
var height;
var weight;
var activity;
var meal1item1= "";
var meal2item2= "";
var meal3item3= "";
var meal1weight1= "";
var meal2weight2= "";
var meal2weight3= "";

//About form submit function to capture values of the form, and run them through the dailyRecommendedCalorieFetch function
$("#about-form").on("submit", function(event){
    event.preventDefault();
    username = $("#name-input").val();
    age = $("#age-input").val();
    gender = $("#gender-input").val();
    height = $("#height-input").val();
    weight = $("#weight-input").val();
    activity = $("#activity-input").val();
    aboutFormStorageSet()
    dailyRecommendedCalorieFetch();

    $("#dyn-name").text(username);
    location.href = "#meal-form";
})

//Meal form submit function to capture values of the form and construct the query string. totalMealCalories fetch function is called and query string is passed through as a parameter.
$("#meal-form").on("submit", function(event){
    event.preventDefault();
    meal1item1 = $("#meal1item1").val();
    meal2item2 = $("#meal2item2").val();
    meal3item3 = $("#meal3item3").val();
    meal1weight1 = $("#meal1weight1").val();
    meal2weight2 = $("#meal2weight2").val();
    meal3weight3 = $("#meal3weight3").val();
    
    var query = meal1weight1+"g "+meal1item1+" "+meal2weight2+"g "+meal2item2+" "+meal3weight3+"g "+meal3item3
    console.log(query);
    totalMealCalories(query);

  
})

//Function to store inputs on the about form into localStorage.
function aboutFormStorageSet() {
    localStorage.setItem("nameStorage", username)
    localStorage.setItem("ageStorage", age)
    localStorage.setItem("genderStorage", gender)
    localStorage.setItem("heightStorage", height)
    localStorage.setItem("weightStorage", weight)
    localStorage.setItem("activityStorage", activity)
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
        
        displayCaloriesResult('.daily-recommend-container', 'p', recommendedCalories);
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
        console.log(result);
        // console.log(result.items[0].calories);
        var TotalCalories = 0;
        for (let i = 0; i < result.items.length; i++) {
            
            TotalCalories += parseFloat(result.items[i].calories);
            TotalCalories = Math.round(TotalCalories);
            
        }
        console.log(TotalCalories);
        
        displayCaloriesResult('.total-calorie-container', 'p', TotalCalories);
        
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
                      fontWeight: "600" })
            .append(`<`+elem+`>&nbsp; ${calories} calories </`+elem+`>`);
}