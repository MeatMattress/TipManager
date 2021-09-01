// This is the cycle.js initialization defaults
$.fn.cycle.defaults = {
    after: null,   // transition callback (scope set to element that was shown)
    before: null,   // transition callback (scope set to element to be shown)
    delay: 0,      // additional delay (in ms) for first transition (hint: can be negative)
    fit: 1,      // force slides to fit container
    fx: 'scrollHorz',  // name of transition function
    height: window.innerHeight,  // container height
    width: window.innerWidth,
    metaAttr: 'cycle', // data- attribute that holds the option data for the slideshow
    next: null,   // id of element to use as click trigger for next slide
    pause: 0,      // true to enable "pause on hover"
    prev: null,   // id of element to use as click trigger for previous slide
    timeout: 0,   // milliseconds between slide transitions (0 to disable auto advance)
    speed: 300,   // speed of the transition (any valid fx speed value)
    slideExpr: null,   // expression for selecting slides (if something other than all children is required)
    sync: 1,      // true if in/out transitions should occur simultaneously

    // the following options let you create transitions other than fade
    cssBefore: {},     // properties that define the initial state of the slide before transitioning in
    cssAfter: {'display': 'flex'},     // properties that defined the state of the slide after transitioning out
    animIn: {},     // properties that define how the slide animates in
    animOut: {}      // properties that define how the slide animates out
};

// Init cycleLite.js
$('#pages').cycle();

// Will contain data outside of function calls. Functions have temp data, and store it here
// depending on what the user is doing
var globalForm = {
    totalServers : 0,
    peopleLeaving : {
        
    },
    endingTips : {

    },
}

// Makes a get request to the MongoDB server, and makes chart creation calls.
// this data is stored in globalForm.mongoData
function displayStatistics(){
    // cycle to statistics page
    $('#pages').cycle(3);
    // callback function (when response has arrived)
    mongoGetAll(function(){
        // hide the loading div
        $('#loadingDiv').css('display', 'none');
        createLineChart();
        createPolarAreaChart();
        createPieChart();
    });
}

// Chart.js line chart
function createLineChart() {
    let canvas = document.getElementById("statsCanvasLineChart")
    let ctx = canvas.getContext('2d');
    var timeFormat = 'YYYY/MM/DD';
    let data = globalForm.mongoData;
    usableData = [];
    // Only need date and tips, Chart.js accepts arrays of dicts
    for (let x of data) {
        usableData.push({
            x: x.date,
            y: x.totalTips
        })
    }
    var config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: "Total Tips Over Time",
                    data: usableData,
                    fill: true,
                    borderColor: 'red'
                }
            ],
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: "Total Tips Over Time"
                },
                scales: {
                    xAxis: [{
                        type: 'time',
                        time: {
                            format: timeFormat
                        },
                    scaleLabel: {
                        display:     true,
                        labelString: 'Date'
                    }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display:     true,
                            labelString: 'Tips'
                        }
                    }]
                }
            }
        }
    };
    // create chart with the given canvas and configuration
    var myChart = new Chart(ctx, config)
}

function createPolarAreaChart() {
    // This chart will be a representation of the average values of each category
    let canvas = document.getElementById("statsCanvasPolarAreaChart");
    let ctx = canvas.getContext('2d');
    let mongoData = globalForm.mongoData;
    // get average of total tips
    let usableData = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let x of mongoData) {
        usableData[0] += parseFloat(x.totalTips) || 0;
        usableData[1] += parseFloat(x.cashTips) || 0;
        usableData[2] += parseFloat(x.creditTips) || 0;
        usableData[3] += parseFloat(x.toGoTips) || 0;
        usableData[4] += parseFloat(x.chowNowTips) || 0;
        usableData[5] += parseFloat(x.totalTipout) || 0;
        usableData[6] += parseFloat(x.perServer) || 0;
        usableData[7] += parseFloat(x.perHelper) || 0;
    }
    for (let i=0; i < usableData.length; i++) {
        usableData[i] /= mongoData.length;
        usableData[i] = parseFloat(usableData[i]) || 0
    }

    const data = {
    labels: [
        'Total Tips',
        'Cash Tips',
        'Credit Tips',
        'To-Go Tips',
        'Chow Now Tips',
        'Tip-out',
        'Per Server',
        'Per Helper'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: usableData,
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(223, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
        'rgb(23, 123, 169)',
        'rgb(241, 12, 23)',
        'rgb(14, 153, 93)'
        ]
    }]
    };
    const config = {
    type: 'polarArea',
    data: data,
    options: {}
    };
    var polarAreaChart = new Chart(ctx, config)
}

function createPieChart(){
    let canvas = document.getElementById("statsCanvasPieChart");
    let ctx = canvas.getContext('2d');
    let mongoData = globalForm.mongoData;
    // get average of total tips
    let usableData = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let x of mongoData) {
        usableData[0] += parseFloat(x.totalTips) || 0;
        usableData[1] += parseFloat(x.cashTips) || 0;
        usableData[2] += parseFloat(x.creditTips) || 0;
        usableData[3] += parseFloat(x.toGoTips) || 0;
        usableData[4] += parseFloat(x.chowNowTips) || 0;
        usableData[5] += parseFloat(x.totalTipout) || 0;
        usableData[6] += parseFloat(x.perServer) || 0;
        usableData[7] += parseFloat(x.perHelper) || 0;
    }
    for (let i=0; i < usableData.length; i++) {
        usableData[i] /= mongoData.length;
        usableData[i] = parseFloat(usableData[i]) || 0;
    }

    const data = {
    labels: [
        'Total Tips',
        'Cash Tips',
        'Credit Tips',
        'To-Go Tips',
        'Chow Now Tips',
        'Tip-out',
        'Per Server',
        'Per Helper'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: usableData,
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(223, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
        'rgb(23, 123, 169)',
        'rgb(241, 12, 23)',
        'rgb(14, 153, 93)'
        ]
    }]
    };
    const config = {
    type: 'pie',
    data: data,
    options: {}
    };
    var pieChart = new Chart(ctx, config)
}

// GET request to the Node.js server which accesses MongoDB server
function mongoGetAll(callback){
$.ajax({
    url: "https://trevornodeserver.club", // Node server address
    method: "GET",
    dataType: 'json',
    accepts: "application/json",
    contentType: "application/json",
    success: function(response) {
        console.log("GET Success", response)
        globalForm.mongoData = response;
        callback();
    },
    error: function(response) {
        console.log("GET Error!", response)
    }
    });
}

function isValidJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }
    return false;
}

// disable user pressing enter = submitForm
$(window).keydown(function(event){
    if( (event.keyCode == 13) && (validationFunction() == false) ) {
      event.preventDefault();
      return false;
    }
});

// POST request to submit data to Node server which accesses MongoDB
async function postToNodeServer(data, callback) {
    data = JSON.stringify(data)
    $.ajax({
        url: "https://trevornodeserver.club",
        method: "POST",
        data: data,
        dataType: 'json',
        accepts: "application/json",
        contentType: "application/json",
        success: function(response) {
            console.log("POST Success", response)
            callback(true)
        },
        error: function(response) {
            console.log("POST Error!", response)
            callback(false, response)
        }
    });
}

function displayPostResult(bool, response) {
    // if result of post worked, display success and reload site to clear all
    if (bool) {
        document.getElementById('postResult').innerText = "Thank You!"
        setTimeout(function(){location.reload()}, 2000)
    }
    else {
        document.getElementById('postResult').innerText = "Error, please show Trevor this:\n" + response
    }
}

function start() {
    // Clear values in form, if any
    $('#tipsInputForm').trigger('reset');
    $('#serverCountInput').prop('placeholder', '#');
    $('#pages').cycle('next');
    var globalForm = {
    totalServers : 0,
    peopleLeaving : {
        
    },
    endingTips : {

    },
}

    // clear all 'leaving early' divs
    $('#leaveEarlyDiv').html('')

    // Add first 'leaving early' name space (Hidden element)
    var nextName = document.getElementById('leaveEarlyWrapper').cloneNode(true);
    nextName.id = ''
    nextName.style.display = "flex";
    $('#leaveEarlyDiv').append(nextName);
}

    // Handle radio button change to hide/show necessary fields
    $('input[type=radio][name=shiftType]').change(function () {
    if (this.value == 'brunch') {
        $('#baristaCountDiv').css('display', 'block');
        $('#busserFoodRunnerCountDiv').css('display', 'block');
        $('#tookPartTipsDiv').css('display', 'block');
        $('#toGoTipsDiv').css('display', 'block');
    }
    else if (this.value == 'dinner') {
        $("#baristaCountInput").val('');
        $('#baristaCountDiv').css('display', 'none');
        $('#toGoTipsDiv').css('display', 'none');
        $('#toGoTipsInput').val('');
        $('#busserFoodRunnerCountDiv').css('display', 'none');
        $('#busserFoodRunnerCountInput').val('');
        $('#tookPartTipsDiv').css('display', 'none');
    }
});

// Leaving early button response functionality
function addPerson(){
    var inputElement = event.target.previousElementSibling;
    var confirmationPrompt = inputElement.previousElementSibling;
    var confirmationDiv = event.target.nextElementSibling;
    var inputValue = inputElement.value;
    if (inputValue.length < 1) {
        inputElement.placeholder = 'Please type name first';
    }
    else {
        // hide plus button
        event.target.style.display = 'none';

        // hide server name button
        inputElement.style.display = 'none'

        // show Tips correct Div
        confirmationPrompt.style.display = 'flex';
        
        // add confirmation buttons
        confirmationDiv.style.display = 'flex';
    }
}

// Person added and + button clicked
function confirmTipInfo(){
    var input = $(event.target).closest('.leaveEarlyWrapper').children(':first').next();

    const data = new FormData(document.getElementById('tipsInputForm'));
    const form = Object.fromEntries(data.entries());

    if (!validateInputs(form)){ // returns false if not valid
        return false;
    } else {
        // hide 'Tips correct?' prompt
        input.prev().css('display', 'none');
        
        // show the input 
        input.css('display', 'flex');
        
        // hide the confirmation box
        $(event.target).closest('div').css('display', 'none');
        
        // show X button (remove) next to name
        $(event.target).parent().next().css('display', 'flex')
        
        // calculate tips
        personLeaving(form);
        
        // Set the global total servers for that day (for true tipout)
        globalForm.totalServers = parseInt($('#serverCountInput').val())
        
        // Clone for another name
        var nextName = document.getElementById('leaveEarlyWrapper').cloneNode(true);
        nextName.removeAttribute('id');
        nextName.style.display = 'flex';
        document.getElementById('leaveEarlyDiv').appendChild(nextName);
        
        // Decrement serverCountInput because server leaving
        $('#serverCountInput').val(parseInt($('#serverCountInput').val()) - 1)
    }
}

function removeName(){
    // Increment serverCountInput because user deleted the server leaving
    $('#serverCountInput').val(parseInt($('#serverCountInput').val()) + 1)

    $(event.target).closest('.leaveEarlyWrapper').remove();
}

// Person added and X button clicked (After "Tips Correct?")
function declineTipInfo(){
    // hide 'Tips correct?' prompt
    $(event.target).closest('.leaveEarlyWrapper').children(':first').css('display', 'none');

    // return showing the input 
    $(event.target).closest('.leaveEarlyWrapper').children(':first').next().css('display', 'flex');

    // hide the confirmation box
    $(event.target).closest('div').css('display', 'none');
    
    // show the plus button
    $(event.target).closest('div').prev().css('display', 'flex');
}

// Show me the money button
function handleFormSubmit() {
    const data = new FormData(document.querySelector('form'));
    var form = Object.fromEntries(data.entries());

    if (!validateInputs(form)){ // returns false if not valid
        return false;
    }
    globalForm.endingTips = calculateTips(form);
    let date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let formattedDate = year + '/' + month + '/' + day;
    globalForm.endingTips.date = formattedDate;
    formatResultsPage(globalForm.endingTips);
}

// Submit button on results page
function handleSubmit() {
    $('#pages').cycle(4)
    postToNodeServer(globalForm.endingTips, displayPostResult);
}

// REGEX
function isItNumber(str) {
    return /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(str);
}

// Show me the money button handler
function formatResultsPage(endingTips) {

    let strings = {
        "Per Server": parseFloat(endingTips.perServer).toFixed(2),
        "Per Busser/Foodrunner": parseFloat(endingTips.perHelper).toFixed(2),
        "Per Barista": parseFloat(endingTips.perBarista).toFixed(2),
        "Total Tips": parseFloat(endingTips.totalTips).toFixed(2),
        "Total Tip-out": parseFloat(endingTips.totalTipout).toFixed(2),
        "Server Total": parseFloat(endingTips.serverTotal).toFixed(2),
        "Barista Bonus (Chow/To-Go)": parseFloat(endingTips.baristaBonus).toFixed(2)
    }

    // clear table first
    $("#resultsTable tr").remove(); 
    for (var key in strings) {
        var row = document.createElement('tr');

        row.appendChild(document.createElement('td'));
        row.appendChild(document.createElement('td'));

        row.cells[0].appendChild(document.createTextNode(key));
        row.cells[1].appendChild(document.createTextNode('$' + strings[key]));
        if (key == 'Per Server' || key == 'Per Barista' || key == 'Per Busser/Foodrunner') {
            row.cells[0].style.color = 'red';
            row.cells[1].style.color = 'red';
        }
        document.getElementById('resultsTable').appendChild(row);
    }
    $('#pages').cycle('next')
}

// Tip calculation when someone is leaving
function personLeaving(form) {
    // holds all float values
    let floatForm = {
        totalTips : (parseFloat(form.cashTips) || 0) + (parseFloat(form.creditTips) || 0) + (parseFloat(form.chowNowTips) || 0) + (parseFloat(form.toGoTips) || 0),
        serverTotal : (parseFloat(form.cashTips) || 0) + (parseFloat(form.creditTips) || 0) + (parseFloat(form.chowNowTips) || 0) + (parseFloat(form.toGoTips) || 0),
        perServer : 0,
        serverTipout: 0,
        perHelper : 0,
        baristaBonus : 0,
        perBarista: 0,
        totalTipout : 0,
        baristaCount: parseFloat(form.baristaCount) || 0,
        busserFoodRunnerCount: parseFloat(form.busserFoodRunnerCount) || 0,
        chowNowTips: parseFloat(form.chowNowTips) || 0,
        toGoTips: parseFloat(form.toGoTips) || 0,
        serverCount: parseFloat(form.serverCount) || 0,
    }
    
    if (form.shiftType == "brunch") { // lunch shift
        // Do we have people to tip out?
        if (floatForm.baristaCount + floatForm.busserFoodRunnerCount > 0) {
            // Do we have baristas to tip out?
            if (floatForm.baristaCount > 0) { // Baristas are here, they get chow tips from the drawer, and to-go tips from our tip jar
                floatForm.totalTipout = (floatForm.totalTips - floatForm.chowNowTips - floatForm.toGoTips) * 0.1; // 10% to the house
                // Take out the barista's self-made tips from ours
                floatForm.serverTotal -= floatForm.chowNowTips + floatForm.toGoTips;
            }
            else {
                floatForm.totalTipout = floatForm.totalTips * 0.1 // 10% to the house
            }
        }
        
        // divide that up between the helpers
        floatForm.perHelper = floatForm.totalTipout / (floatForm.baristaCount + floatForm.busserFoodRunnerCount);
        floatForm.perBarista = floatForm.perHelper + (floatForm.baristaBonus / floatForm.baristaCount);
        // deduct tipout
        floatForm.serverTotal -= floatForm.totalTipout;
        floatForm.serverTipout = floatForm.totalTipout / floatForm.serverCount;
    }

    for (let person in globalForm.peopleLeaving) {
        floatForm.serverTotal -= globalForm.peopleLeaving[person]
    }

    floatForm.perServer = floatForm.serverTotal / floatForm.serverCount;
    globalForm.peopleLeaving[leaveEarlyDiv.children[leaveEarlyDiv.children.length - 1].children[1].value] = floatForm.perServer;

    leaveEarlyDiv.children[leaveEarlyDiv.children.length - 1].children[5].textContent = parseFloat(floatForm.perServer).toFixed(2)
}

// validate inputs on form page
function validateInputs(form) {
    let allValid = true;

    if (parseFloat($('#serverCountInput').val()) < 1 || $('#serverCountInput').val() == "") {
        $('#serverCountInput').val('')
        $('#serverCountInput').prop('placeholder', 'Missing');
        allValid = false;
    }

    let mustBeNumericInputs = 
    {
        baristaCountInput: form.baristaCount,
        busserFoodRunnerCountInput: form.busserFoodRunnerCount,
        cashTipsInput: form.cashTips,
        chowNowTipsInput: form.chowNowTips,
        creditTipsInput: form.creditTips,
        serverCountInput: form.serverCount,
        toGoTipsInput: form.toGoTips
    }

    for ([key, val] of Object.entries(mustBeNumericInputs)) {
        if (val != ""){
            if (!isItNumber(val) || val < 0) {
                $('#'+key).val('')
                $('#'+key).prop('placeholder', 'Invalid');
                $('#'+key).css('border', '2px solid red')
                allValid = false;
            }
        }
    }
    return allValid;
}

// Calculate tips when show me the money button is pressed
function calculateTips(form) {
    let floatForm = {
        totalTips : (parseFloat(form.cashTips) || 0) + (parseFloat(form.creditTips) || 0) + (parseFloat(form.chowNowTips) || 0) + (parseFloat(form.toGoTips) || 0),
        serverTotal : (parseFloat(form.cashTips) || 0) + (parseFloat(form.creditTips) || 0) + (parseFloat(form.chowNowTips) || 0) + (parseFloat(form.toGoTips) || 0),
        perServer : 0,
        serverTipout: 0,
        perHelper : 0,
        baristaBonus : 0,
        perBarista: 0,
        totalTipout : 0,
        baristaCount: parseFloat(form.baristaCount) || 0,
        busserFoodRunnerCount: parseFloat(form.busserFoodRunnerCount) || 0,
        chowNowTips: parseFloat(form.chowNowTips) || 0,
        toGoTips: parseFloat(form.toGoTips) || 0,
        serverCount: parseFloat(form.serverCount) || 0,
    }
    
    if (form.shiftType == "brunch") { // lunch shift
        // Do we have people to tip out?
        if (floatForm.baristaCount + floatForm.busserFoodRunnerCount > 0) {
            // Do we have baristas to tip out?
            if (floatForm.baristaCount > 0) { // Baristas are here, they get chow tips from the drawer, and to-go tips from our tip jar
                floatForm.totalTipout = (floatForm.totalTips - floatForm.chowNowTips - floatForm.toGoTips) * 0.1; // 10% to the house
                if (!form.tookChowNowTips == "on") {
                    floatForm.baristaBonus += floatForm.chowNowTips;
                }
                if (!form.tookToGoTips == "on") {
                    floatForm.baristaBonus += floatForm.toGoTips;
                }
                // Take out the barista's self-made tips from ours
                floatForm.serverTotal -= floatForm.chowNowTips + floatForm.toGoTips;
            }
            else {
                floatForm.totalTipout = floatForm.totalTips * 0.1 // 10% to the house
            }
        }
        
        // divide that up between the helpers
        floatForm.perHelper = floatForm.totalTipout / (floatForm.baristaCount + floatForm.busserFoodRunnerCount);
        floatForm.perBarista = floatForm.perHelper + (floatForm.baristaBonus / floatForm.baristaCount);
        // deduct tipout
        floatForm.serverTotal -= floatForm.totalTipout;
        floatForm.serverTipout = floatForm.totalTipout / floatForm.serverCount;
    }
    
    for (let person in globalForm.peopleLeaving) {
        floatForm.serverTotal -= globalForm.peopleLeaving[person]
    }

    floatForm.perServer = floatForm.serverTotal / floatForm.serverCount;

    let returnObject = {
        perServer: parseFloat(floatForm.perServer) || 0,
        perHelper: parseFloat(floatForm.perHelper) || 0,
        // serverTotal was modified for the calculation so we can just recreate it for the object
        serverTotal: (parseFloat(floatForm.totalTips) || 0) - (parseFloat(floatForm.totalTipout) || 0),
        totalTipout: parseFloat(floatForm.totalTipout) || 0,
        totalTips: parseFloat(floatForm.totalTips) || 0,
        perBarista: parseFloat(floatForm.perBarista) || 0,
        baristaBonus: parseFloat(floatForm.baristaBonus) || 0,
        creditTips: parseFloat(form.creditTips) || 0,
        cashTips: parseFloat(form.cashTips) || 0
    }
    return returnObject;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return parseFloat((Math.random() * (max - min + 1)) + min)
}

// This is to POST random data to the mongoDB server for demonstration purposes
// fillGlobalFormWithRandomData();
// function fillGlobalFormWithRandomData() {
//     let existingDates = [];
//     // test data
//     for (let i = 0; i < 100; i++) {
//         // also using this to fill out globalForm.data
//         // Format date to be yyyy/mm/dd
//         let date = new Date();
//         // TESTING: NEED RANDOM DATES SO THAT CHARTS SHOW DATA OVER TIME
//         //let year = date.getFullYear();
//         //let month = (1 + date.getMonth()).toString().padStart(2, '0');
//         //let day = date.getDate().toString().padStart(2, '0');
//         let day = getRandomInt(1, 31);
//         let month = getRandomInt(1, 12);
//         let year = 2021;
//         day = day.toString().padStart(2, '0');
//         month = month.toString().padStart(2, '0');
//         year = year.toString();
//         let formattedDate = year + '/' + month + '/' + day;
//         let data = {
//             totalTips: getRandomFloat(1900, 2500),
//             date: formattedDate,
//             shiftType: 'brunch',
//             serverCount: getRandomInt(3, 6),
//             serverTotal: getRandomFloat(1000, 1800),
//             totalTipout: getRandomFloat(50, 100),
//             baristaCount: getRandomInt(1, 3),
//             busserFoodRunnerCount: getRandomInt(1,2),
//             perHelper: getRandomFloat(30, 60),
//             chowNowTips: getRandomFloat(10, 100),
//             toGoTips: getRandomFloat(10, 200),
//             cashTips: getRandomFloat(200, 500),
//             creditTips: getRandomFloat(1300, 1600),
//             perServer: getRandomFloat(100, 200)
//         }
    
//         if (isValidJson(data) && !existingDates.includes(data.date)) {
//             existingDates.push(data.date)
//             globalForm.data = data;
//             postToNodeServer(globalForm.data, displayPostResult);
//             // console.log("Posted to server");
//         }
//         else{
//             //alert("Data is not in valid JSON format, not sent to server");
//         }
//     } 
// }