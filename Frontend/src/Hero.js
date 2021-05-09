import React, { useEffect, useState } from 'react';
import fire from "./fire"; 
import firebase from 'firebase';
const Hero = (props) => {
    const [gas, setGas] = useState("");
    const [touch, setTouch] = useState("");
    const [air, setAir] = useState("");
    const [thermal, setThermal] = useState("");

    const {
        email, 
        handleLogout
    } = props;

    useEffect(() => {
        //firebase.database().ref('Todo').set({lol : "LOLOLER"});
        const ref = firebase.database().ref('dataset');
        ref.on("value", (snapshot) => {
            console.log(snapshot.val());
            setGas(snapshot.val().gas)
            setTouch(snapshot.val().touch)
            setAir(snapshot.val().air)
            setThermal(snapshot.val().thermal)
        })
    });


    return (
        <section className = "hero">
            <nav>
                <h2>Welcome {email}</h2>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <ul>
                <li>Gas (CO2) Sensor: <b><em>{gas}</em></b></li>
                <li>Touch Sensor: {touch}</li>
                <li>Air Quality Sensor: {air}</li>
                <li>Thermal Senor: {thermal}</li>
            </ul>
                
            </div>
        </section>
    );
};

export default Hero;