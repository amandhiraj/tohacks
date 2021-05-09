
const request = require('request')
/// measuers CO2 and outputs in ppm
const { Board, Sensor } = require("johnny-five");
const board = new Board();

// Atmospheric CO2 Level = 400ppm
// Average indoor CO2    = 350-450ppm
var co2readings = []; // array to store raw readings
var co2avg = 0;       // int for raw value of CO2
var co2comp = 0;      // int for compensated CO2
var co2sum = 0;       // int for summed CO2 readings
var co2cal = 75;      // margin of error of the sensor

var airreadings = []; // array to store raw readings
var airavg = 0;       // int for raw value of CO2
var aircomp = 0;      // int for compensated CO2
var airsum = 0;       // int for summed CO2 readings
var aircal = 75;      // margin of error of the sensor

board.on("ready", () => {
    // Create a new generic sensor instance for
    // a sensor connected to an analog (ADC) pin

    const sensorAir = new Sensor("A0");

    // When the sensor value changes, log the value
    sensorAir.on("change", value => {

        if (airreadings.length < 10) {
            airreadings.push(sensorAir.value);
        } else {
            airsum = 0
            for (var i in airreadings) {
                console.log("AIR i: ", airreadings[i]);
                airsum = airsum + airreadings[i];
            }
            airavg = airsum / airreadings.length; // divide total to get avg
            aircomp = airavg - aircal; // get compensated value
            var avggcomp = (aircomp / 1000000) * 100;
            console.log("Average AIR: ", avggcomp);
            if (avggcomp < 0.51) {
                //outdoor
                sendData();
            } else {
                //indoor
            }
            airreadings = [];
        }

    });

});

var sendData = (function () {
    var executed = false;
    return function () {
        if (!executed) {
            executed = true;
            callAPI("airSensor", aircomp);
        }
    };
})();

function callAPI(sensorType, sensorValue) {
    var jsonBody =
    {
        "sensorType": `${sensorType}`,
        "sensorValue": `${sensorValue}`
    }

    const options = {
        url: 'http://174.119.162.34:5700/prithcall',
        method: 'POST',
        json: jsonBody
    };

    request(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Status: ${res.statusCode}`);
        console.log(body);
    });
}
