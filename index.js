var display;
var knob;
let d = new Date();
let currentHour = d.getHours();
let currentMinutes = d.getMinutes();
let currentBattery = 50;
let minimumCharge = 20;
const chargingRatePerMinute = (7*60)/100;// Assuming it takes 7 hours to charge a full charge and that the charging speed is uniform

function minToHrs(min){
    return Math.floor(min / 60) % 24;
}

function onlyMinutes(min){
    return min % 60;
}

function pad(num){
    return num.toString().padStart(2, 0);
}

function delayableChargingTime(){
    const result = currentBattery < minimumCharge ? 100-minimumCharge: 100-currentBattery;
    return Math.round(result*chargingRatePerMinute);
}

function updateDisplay(){
    let expectedChargeAt = currentHour * 60 + currentMinutes + delayableChargingTime() + knob.getValue();//minutes from 00:00
    let hours = pad(minToHrs(expectedChargeAt));
    let minutes = pad(onlyMinutes(expectedChargeAt));
    display.setValue(hours + ':' + minutes);
}

function updateBattery(){
    currentBattery = document.getElementById('battery_level').value;
    updateDisplay();
}

function updateMinCharge(){
    minimumCharge = document.getElementById('min_charge').value;
    updateDisplay();
}

function makeKnob(){
    // Create knob element, 300 x 300 px in size.
    knob = pureknob.createKnob(300, 300);
    // Set properties.
    knob.setProperty('angleStart', 0 * Math.PI);
    knob.setProperty('angleEnd', 2 * Math.PI);
    knob.setProperty('colorFG', '#fff');
    knob.setProperty('colorBG', '#000');
    knob.setProperty('trackWidth', 0.4);
    knob.setProperty('valMin', 0);
    knob.setProperty('valMax', 16*60);
    knob.setProperty('needle', true);
    knob.setProperty('textScale', 0.75);

    const listener = function (knob, value) {
        updateDisplay();
    };
    knob.addListener(listener);
    // Set initial value.
    knob.setValue(0);
    knob.setProperty('fnValueToString', function (value) {
        let hours = Math.floor(value / 60).toString();
        let minutes = (value % 60).toString();
        return hours + ':' + pad(minutes);
    });


    // Create element node.
    const node = knob.node();
    // Add it to the DOM.
    const elem = document.getElementById('the_knob');
    elem.appendChild(node);

    
}
setInterval(() => {
    d = new Date();
    currentHour = d.getHours();
    currentMinutes = d.getMinutes();
    // Lower by one each minute
    if (knob.getValue() > 0) {
        knob.setValue(knob.getValue() - 1);
    }
}, 1000 * 60);

function makeDisplay(){
    display = new SegmentDisplay("display");
    display.pattern = "##:##";
    display.displayAngle = 6;
    display.digitHeight = 20;
    display.digitWidth = 14;
    display.digitDistance = 2.5;
    display.segmentWidth = 2;
    display.segmentDistance = 0.3;
    display.segmentCount = 7;
    display.cornerType = 3;
    display.colorOn = "#e95d0f";
    display.colorOff = "#331403";
    display.draw();
    //Update even before mouse button is released
    setInterval(updateDisplay, 1000);
}

// Returns how much the electricity costs at a certatin time of day on a scale from 0.00 (free) to 1.00 (the highest price during that day)
function getGridUsage(hourOfDay, minuteOfDay){
    // Price of electricity hour by hour in Sweden at 2022-03-07
    // Source: https://www.vattenfall.se/elavtal/elpriser/timpris-pa-elborsen/
    let gridUsage = [59.31, 58.27, 53.97, 73.04, 118.54, 154.32, 242.66, 539.08, 541.87, 504.55, 365.23, 223.44, 215.50, 212.00, 205.98, 206.79, 208.13, 216.63, 218.54, 231.47, 215.68, 202.84, 157.24, 122.00]
    // Using 2022-02-17 instead since it shows a peak both in the morning and late afternoon
    gridUsage = [18.48, 15.89, 15.87, 14.76, 15.89, 34.89, 95.15, 116.01, 113.31, 108.37, 100.45, 81.86, 68.75, 38.02, 45.10, 69.42, 90.96, 112.24, 113.96, 104.73, 63.34, 42.33, 37.07, 16.91]
    if(minuteOfDay < 30){
        hourOfDay += 1;
    }
    if(hourOfDay >= 24){
        hourOfDay = hourOfDay % 24
    }
    return gridUsage[hourOfDay]/Math.max.apply(Math, gridUsage);
}

// From https://codepen.io/panicbear/pen/OJVgpdx
function makeCircle(){
    var canvas = document.getElementById("circle");
    var context = canvas.getContext("2d");

    var dotsPerCircle = 16;

    var interval = (Math.PI * 2) / dotsPerCircle;

    var centerX = 500;
    var centerY = 500;
    var radius = 400;

    for (var i = 0; i < dotsPerCircle; i++) {

        let desiredRadianAngleOnCircle = interval * i;

        var x = centerX + radius * Math.sin(desiredRadianAngleOnCircle);
        var y = centerY - radius * Math.cos(desiredRadianAngleOnCircle);
        context.beginPath();
        context.arc(x, y, 15, 0, Math.PI * 2);
        context.closePath();
        
        let colorIntensity = getGridUsage(i+currentHour, currentMinutes)*255;
        let r = Math.floor(colorIntensity);
        let g = Math.floor(255 - colorIntensity);
        let b = 0;
        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        context.fill();

    }
}

function ready() {
    makeDisplay();
    makeKnob();
    makeCircle();
    updateBattery();
    updateMinCharge();
}

document.addEventListener('DOMContentLoaded', ready, false);