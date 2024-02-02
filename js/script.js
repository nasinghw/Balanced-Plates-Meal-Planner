//Blank global variables to store input from about you form.
var age;
var gender;
var height;
var weight;
var activity;


$("#about-form").on("submit", function(event){
    event.preventDefault();
    age = $("#age-input").val();
    gender = $("#gender-input").val();
    height = $("#height-input").val();
    weight = $("#weight-input").val();
    activity = $("#activity-input").val();
    dailyRecommendedCalorieFetch();
})

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
        console.log(response.data.calorie)
    });
}

var meal1item1= "";
var meal2item2= "";
var meal3item3= "";
var meal1weight1= "";
var meal2weight2= "";
var meal2weight3= "";

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

function totalMealCalories(query){


// var query = "200g chicken 200g rice 200g eggs"
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
                        
        }
        console.log(TotalCalories);

    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }


})
}