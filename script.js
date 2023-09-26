const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".button-container"); 
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 8;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max-min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateNumber() {
    return getRndInteger(0, 9);
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123))
}

function generateSymbol() {
    const index = getRndInteger(0, symbol.length);

    return symbol.charAt(index);
}

function stregnthCalc() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber||hasSymbol) && passwordLength >= 10){
        setIndicator("#0f0");
    }
    else if(
        (hasUpper || hasLower) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 8
    ){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => { 
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckboxChange() {

    checkCount = 0;

    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange());
})

function shufflePassword(password){
    for (let i = password.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = password[i];
        password[i] = password[j];
        password[j] = k;
    }

    let str = "";
    password.forEach( el => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {

    handleCheckboxChange();

    if(checkCount == 0) return 0;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let index = getRndInteger(0, funcArr.length);

        password += funcArr[index]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    stregnthCalc();
})