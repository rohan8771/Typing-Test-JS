const API_URL = "https://api.quotable.io/random";

const textContainerGiven = document.querySelector('.text_container__given')
const textContainerWritten = document.querySelector('.text_container__written')
const timer = document.querySelector('.timer');
const wpmDiv = document.querySelector('.wpm')
const carImg = document.querySelector('.carImg');
const infoBtn = document.querySelector('.infoBtn');
const nextBtn = document.querySelector('.nextBtn');
const testContainer = document.querySelector('.containerTest');
const loginContainer = document.querySelector('.containerLogin');
const quoteInfo = document.querySelector('.quoteInfo')
const userDetails = document.querySelector('.userDetails');

let started = false;
let timerInterval;
let wpmInterval;
let textLength;
let carStopped = false;
let carStoppedIndex = 0;
let responseJSON;
let next;

const getAndRenderNewText = async function() {
    try {
        // Getting text
        const response = await fetch(API_URL);
        responseJSON = await response.json();
        const text = responseJSON.content;
        
        //Rendering text
        textContainerGiven.innerHTML = '';
        text.split('').forEach((element) => {
            const newSpan = document.createElement('span');
            newSpan.innerText = element;
            textContainerGiven.appendChild(newSpan);
        })
        
        //Make timer zero
        timer.innerText = '0';

        textLength = text.length; //To be used by handleCar

        //Revert car to original position
        carImg.style.marginLeft = 0 + "%";

        //Hide the buttons
        infoBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');

        //Clear written text
        textContainerWritten.value = '';

        //Clear quote info
        quoteInfo.innerHTML = '';

    }
    catch(err) {
        console.log("ERROR: ")
        console.log(err);
    }
}

const handleCar = function(inputLength) {
    let travelled;
    if(carStopped) {
        travelled = ((carStoppedIndex+1)/textLength)*90;
    }
    else {
        travelled = (inputLength/textLength)*90;
    }

    carImg.style.marginLeft = travelled + "%";
}

const checkInput = function() {
    if(!started) {
        started = true;
        //Start timer
        timerInterval = setInterval(()=>{
            const timerValue = Number(timer.innerText);
            timer.innerText = String(timerValue + 1); 
        }, 1000)

        wpmInterval = setInterval(calculateAndRenderWPM, 2000)

    }

    const allSpans = textContainerGiven.querySelectorAll('span');
    const currentInput = textContainerWritten.value;
    let correctSoFar = true;
    allSpans.forEach((theSpan, index) => {
        if(currentInput[index] == null) {
            theSpan.classList.remove('correct');
            theSpan.classList.remove('wrong');
            correctSoFar = false;
        }
        else if(currentInput[index] === theSpan.innerText) {
            if(correctSoFar) {
                theSpan.classList.remove('wrong');
                theSpan.classList.add('correct');
                carStopped = false;
            }
            else {
                theSpan.classList.remove('correct');
                theSpan.classList.add('wrong');
            }
        }
        else {
            theSpan.classList.remove('correct');
            theSpan.classList.add('wrong');
            correctSoFar = false;

            //Note first mistake index and stop the car here
            if(!carStopped) {
                carStoppedIndex = index;
                carStopped = true;
            }
        }
    })

    handleCar(currentInput.length);

    if(correctSoFar) {
        calculateAndRenderWPM();
        clearInterval(wpmInterval);

        started = false;
        clearInterval(timerInterval)

        infoBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }
}
textContainerWritten.addEventListener('input', checkInput);

const calculateAndRenderWPM = function() {
    const timerVal = Number(timer.innerText);
    const numberOfWords = textContainerWritten.value.split(' ').length;
    const wpm = Math.floor((numberOfWords/timerVal * 60));
    wpmDiv.innerText = wpm + ' WPM';
}

const showQuoteDetails = function() {
    const category = responseJSON.tags[0];
    const author = responseJSON.author;

    const html = `
                    <p class="author">Author: ${author}</p>
                    <p class="category">Category: ${category}</p>
                  `

    quoteInfo.innerHTML = html;

}

infoBtn.addEventListener('click', showQuoteDetails)

nextBtn.addEventListener('click', getAndRenderNewText)




////// IMPLEMENTING LOG-IN FUNCTIONALITY 
let loggedIn = false;

// Only when I am logged in, show the typing test container and render new text
if(loggedIn) {
    testContainer.classList.remove('hidden');
    getAndRenderNewText()
}
// Probably no need of above

let loggedUser; //This will store the name of the user logged in

//This function will check if entered details are correct or not
const checkDetails = function(event) {
    event.preventDefault() //To prevent a page reload upon submitting form

    const enteredName = nameInput.value;
    const enteredPassword = passwordInput.value;
    let foundUser = false;
    loginData.forEach((user) => {
        if(enteredName === user.name && enteredPassword === user.password) {
            foundUser = true;
        }
    })
    if(!foundUser) {
       console.log("No such user");
       return;
    }

    // Reaching here means input fields match a user
    loggedUser = enteredName;
    
    //Hide the login container
    loginContainer.classList.add('hidden');

    //Show the typing test container
    testContainer.classList.remove('hidden');

    //Depending upon which user has logged in, details about user will be shown
    
    //Calcualte this user's all time average WPM
    //Load from file the user's WPMs, and then take average
    //In checkInput function, when the user correctly types the entire thing,
    //add that WPM value to their file 
    const allTimeAverageWPM = 105;
    
    userDetails.innerHTML = `
        <p class="userName">Name: ${loggedUser}</p>
        <p class="allTimeAverage">All time average: ${allTimeAverageWPM} WPM</p>
    `;

    //Get and render new text
    getAndRenderNewText() 

    
}
const loginForm = document.querySelector('.loginForm');
const nameInput = document.getElementById('name')
const passwordInput = document.getElementById('password')

loginForm.addEventListener('submit', checkDetails)


//Let me put some raw login data here. Later, I'll replace it with a file read
//I'll come back to file read when I finish learning nodeJS
const loginData = [
    {
        name: "Rohan",
        password: "12345"
    },
    {
        name: "Sandeep",
        password: "11111"
    },
    {
        name: "Shyamal",
        password: "23456"
    }
]

