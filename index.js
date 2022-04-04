const API_URL = "https://api.quotable.io/random";

const textContainerGiven = document.querySelector('.text_container__given')
const textContainerWritten = document.querySelector('.text_container__written')
const timer = document.querySelector('.timer');
const wpmDiv = document.querySelector('.wpm')
const carImg = document.querySelector('.carImg');

let started = false;
let timerInterval;
let wpmInterval;
let textLength;
let carStopped = false;
let carStoppedIndex = 0;

const getAndRenderNewText = async function() {
    try {
        // Getting text
        const response = await fetch(API_URL);
        const responseJSON = await response.json();
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

    }
    catch(err) {
        console.log("ERROR: ")
        console.log(err);
    }
}

getAndRenderNewText();

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

        textContainerWritten.value = '';
        started = false;
        clearInterval(timerInterval)
        getAndRenderNewText();
    }
}
textContainerWritten.addEventListener('input', checkInput);

const calculateAndRenderWPM = function() {
    const timerVal = Number(timer.innerText);
    const numberOfWords = textContainerWritten.value.split(' ').length;
    const wpm = (numberOfWords/timerVal * 60);
    wpmDiv.innerText = wpm + ' WPM';
}
