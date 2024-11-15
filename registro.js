'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function registro (usuario, passwd) {
    const auth = getAuth(app);
    console.log(`auth: ${auth} email: ${usuario} password: ${passwd}`);

    createUserWithEmailAndPassword(auth, usuario, passwd)
    .then((user) => {
        console.log("Usuario registrado");
        alert("Usuario registrado");
    })
    .catch((err) => {
        console.log("Error al registrarse: "+err);
        alert("Error al registrarse: "+err);
    });
}

export { registro };