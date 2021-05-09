
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
  const sensor = new Sensor("A1");

  // When the sensor value changes, log the value
  sensor.on("change", value => {

    if (co2readings.length < 10) {
      co2readings.push(sensor.value);
    } else {
      co2sum = 0
      for (var i in co2readings) {
        //console.log("i: ", co2readings[i]);
        co2sum = co2sum + co2readings[i];
      }
      co2avg = co2sum / co2readings.length; // divide total to get avg
      co2comp = co2avg - co2cal; // get compensated value
      var avgcomp = (co2comp / 1000000) * 100;
      console.log("Average CO2: ", avgcomp);
      if (avgcomp < 0.032) {
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
      callAPI("gasSensor", co2comp);
    }
  };
})();

var sendData2 = (function (type) {
  var executed = false;
  return function () {
    if (!executed) {
      executed = true;
      callAPI("airSensor", co2comp);
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
