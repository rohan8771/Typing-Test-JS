const API_URL = "https://api.quotable.io/random";

const textContainerGiven = document.querySelector('.text_container__given')
const textContainerWritten = document.querySelector('.text_container__written')

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
    }
    catch(err) {
        console.log("ERROR: ")
        console.log(err);
    }
}

getAndRenderNewText();

const checkInput = function() {
    const allSpans = textContainerGiven.querySelectorAll('span');
    const currentInput = textContainerWritten.value;
    let completelyCorrect = true;
    allSpans.forEach((theSpan, index) => {
        if(currentInput[index] == null) {
            theSpan.classList.remove('correct');
            theSpan.classList.remove('wrong');
            completelyCorrect = false;
        }
        else if(currentInput[index] === theSpan.innerText) {
            theSpan.classList.remove('wrong');
            theSpan.classList.add('correct');
        }
        else {
            theSpan.classList.remove('correct');
            theSpan.classList.add('wrong');
            completelyCorrect = false;
        }
    })
    if(completelyCorrect) {
        getAndRenderNewText();
        textContainerWritten.value = '';
    }
}
textContainerWritten.addEventListener('input', checkInput);