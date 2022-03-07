var display;
var knob;

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
    // Set initial value.
    knob.setValue(0);
    knob.setProperty('fnValueToString', function (value) {
        let hours = Math.floor(value / 60).toString();
        let minutes = (value % 60).toString();
        return hours.padStart(1, 0) + ':' + minutes.padStart(2, 0);
    });

    const listener = function (knob, value) {
        console.log(value);
        //assuming a charge will take 8 hours
        display.setValue((8 + Math.floor(value / 60)).toString().padStart(2, 0) + ':' + (value % 60).toString().padStart(2, 0));
    };
    knob.addListener(listener);

    // Create element node.
    const node = knob.node();
    // Add it to the DOM.
    const elem = document.getElementById('the_knob');
    elem.appendChild(node);

    // Lower by one each minute
    setInterval(() => {
        if (knob.val > 0){
            knob.setValue(knob.val-1);
        }
    }, 1000 * 60);
}

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
}

function getColor(hourOfDay, minuteOfDay){
    //price of electricity hour by hour in Sweden at 2022-03-07
    let gridUsage = [59.31, 58.27, 53.97, 73.04, 118.54, 154.32, 242.66, 539.08, 541.87, 504.55, 365.23, 223.44, 215.50, 212.00, 205.98, 206.79, 208.13, 216.63, 218.54, 231.47, 215.68, 202.84, 157.24, 122.00]
    if(minuteOfDay < 30 && hourOfDay < 23){
        hourOfDay += 1;
    }
    return gridUsage[hourOfDay]/Math.max.apply(Math, gridUsage);
}

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

        var x = centerX - radius * Math.cos(desiredRadianAngleOnCircle);
        var y = centerY - radius * Math.sin(desiredRadianAngleOnCircle);

        context.beginPath();
        context.arc(x, y, 15, 0, Math.PI * 2);
        context.closePath();

        let colorIntensity = getColor(i, 0)*255;
        let r = Math.floor(255 - colorIntensity);
        let g = Math.floor(colorIntensity);
        let b = 0;
        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        context.fill();

    }
}

function ready() {
    makeKnob();
    makeCircle();
    makeDisplay();
}

document.addEventListener('DOMContentLoaded', ready, false);