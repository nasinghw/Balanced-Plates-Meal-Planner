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



















// var query = "200g chicken 200g rice 200g eggs"
// $.ajax({
//     method: 'GET',
//     url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
//     headers: { 'X-Api-Key': 'bbmC/ZvQmx/lB6Kb22gtQA==osiiqiKhgKtEUAqq'},
//     contentType: 'application/json',
//     success: function(result) {
//         console.log(result);

//     },
//     error: function ajaxError(jqXHR) {
//         console.error('Error: ', jqXHR.responseText);
//     }
// });