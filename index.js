function makeKnob(){
    // Create knob element, 300 x 300 px in size.
    const knob = pureknob.createKnob(300, 300);
    // Set properties.
    knob.setProperty('angleStart', 0 * Math.PI);
    knob.setProperty('angleEnd', 2 * Math.PI);
    knob.setProperty('colorFG', '#000');
    knob.setProperty('colorBG', '#bbbbbb');
    knob.setProperty('trackWidth', 0.2);
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
    };
    knob.addListener(listener);

    // Create element node.
    const node = knob.node();
    // Add it to the DOM.
    const elem = document.getElementById('the_knob');
    elem.appendChild(node);
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

        var x = centerX + radius * Math.cos(desiredRadianAngleOnCircle);
        var y = centerY + radius * Math.sin(desiredRadianAngleOnCircle);

        context.beginPath();
        context.arc(x, y, 15, 0, Math.PI * 2);
        context.closePath();
        context.fill();

    }
}

function ready() {
    makeKnob();
    makeCircle();
}

document.addEventListener('DOMContentLoaded', ready, false);