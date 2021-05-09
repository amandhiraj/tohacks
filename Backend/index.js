var five = require("johnny-five");
var board = new five.Board({
    port: "COM5"
});

const {
    Board,
    Thermometer
} = require("johnny-five");
// const board = new Board();
const express = require('express')
var cors = require('cors')
const request = require('request')
const app = express()
const port = 5700
app.use(express.json());
app.use(cors())


var temp;
var executed = false;
var executed2 = false;

board.on("ready", function () {
    console.log("connected")

    var touch = new five.Pin(2)
    var temperature = new Thermometer({
        controller: "LM35",
        pin: "A5",
        freq: 1000
    });

    temperature.on('data', function () {
        //console.log(this.celsius + '°C');
        temp = this.celsius;
        if (temp > 30) {
            send();
        } else if (temp < 26) {
            executed = false;
        }
    });
    touch.read(function (error, value) {
        if (value == 1) {
            send2();
        }
    });

});
var send = (function () {
    return function () {
        if (!executed) {
            executed = true;
            thermalSensor("", temp, "The temperature is back to normal :)")
        }
    };
})();

var send2 = (function () {
    return function () {
        if (!executed2) {
            executed2 = true;
            touchSensor("", "Triggered")
        }
    };
})();

app.post('/prithcall', (req, res) => {
    console.log(req.body); // your JSON
    res.sendStatus(200); // echo the result back
    if (req.body.sensorType === "gasSensor") {
        gasSensor("Gas Sensor", req.body.sensorValue);
    }

    if (req.body.sensorType === "airSensor") {
        airQuality("Air Sensor", req.body.sensorValue);
    }
})

app.get('/status', (req, res) => {
    console.log(res.body); // your JSON
    res.send("Hello Kidda"); // echo the result back
})

function touchSensor(type, value, message) {
    console.log("Touch HIT: " + value)
    callAPI("Touch Sensor", value, message)
}

// Thermal
function thermalSensor(type, value, message) {
    console.log("Thermal HIT: " + value)
    callAPI("Thermal Sensor", value, message)
}

// gasSensor
function gasSensor(type, value, message) {
    console.log("Gas Sensor: " + value)
    callAPI(type, value)
}


//airQuality
function airQuality(type, value) {
    console.log("Air hit: " + value)
    callAPI(type, value)
}


function callAPI(alertType, alertReading, message) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();
    var msg = `We have detected an alert for ${alertType} with the readings of ${alertReading}`;
    var jsonBody = {
        "event": "PJ56F2VXDZ4Q02N12T7SR5WKXRN1",
        "recipient": "CHANNEL_FROM-SERVER",
        "profile": {
            "slack": {
                "access_token": "xoxb-2057797582977-2030425658343-YBeFWz17UF5FwxmWUgGAwcPG",
                "channel": "C021HJM5BLL"
            }
        },
        "data": {
            "name": `${alertType}`,
            "message": `${msg}`,
            "currTime": `${ year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds}`
        }
    }
    const options = {
        url: 'https://api.courier.com/send',
        headers: {
            'Authorization': 'Bearer dk_prod_GJ41WSW20B4XHNMWPN1N8EQ03AAP',
            'Content-Type': 'application/json'
        },
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
//https://174.119.162.34:5700/status