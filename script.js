const InputSlider = document.querySelector("[data-lengthSlider]");
const LengthDisplay = document.querySelector("[data-lengthNumber]");

const PasswordDisplay = document.querySelector("[data-passwordDisplay]");
const CopyButton = document.querySelector("[data-copy]");
const CopyMessage = document.querySelector("[data-copyMsg]");
const UpperCase = document.querySelector("#uppercase");
const LowerCase = document.querySelector("#lowercase");
const Numbers = document.querySelector("#numbers");
const Symbols = document.querySelector("#Symbols");
const Indicator = document.querySelector("[data-indicator]");
const GenerateButton = document.querySelector(".generate-Button");
const AllCheckBox = document.querySelectorAll("input[type=checkbox");
const SymbolString = '!@#$%^&*?/|~';

let Password = "";
let PasswordLength = 10;
let CheckCount = 1;
handleSlider();
// set strength circle color to grey
SetIndicator("#ccc");

// Functions
function handleSlider() {
    InputSlider.value = PasswordLength;
    LengthDisplay.innerText = PasswordLength;
    const min = InputSlider.min;
    const max = InputSlider.max;
    InputSlider.style.backgroundSize = ((PasswordLength - min)*100/ (max - min)) + "%100%"

}

function SetIndicator(color){
    Indicator.style.backgroundColor = color;
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    
}

function GetRandomInteger(min, max){
    return Math.floor( Math.random()*(max - min)) + min;
}

function GenerateNumber() {
    return GetRandomInteger(0,9);
}

function GenerateLowerCase(){
   return String.fromCharCode (GetRandomInteger(97,123));
}

function GenerateUpperCase(){
    return String.fromCharCode (GetRandomInteger(65,91));
} 

function GenerateSymbols(){
    const RandomNumber = GetRandomInteger(0, SymbolString.length);
    return SymbolString.charAt(RandomNumber);
}

function CalStrength(){
    let hasUpper =false;
    let hasLower =false;
    let hasNum =false;
    let hasSym =false;
    if(UpperCase.checked) hasUpper = true;
    if(LowerCase.checked) hasLower = true;
    if(Symbols.checked) hasSym = true;
    if(Numbers.checked) hasNum = true;

    if(hasUpper && hasLower && (hasSym || hasNum) && PasswordLength >=8){
        SetIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        PasswordLength >=6
    ){
        SetIndicator("#ff0");
    }
    else {
        SetIndicator("#f00");
    }
}
//async function is used to wait
async function CopyContent(){
    try{
        await navigator.clipboard.writeText(PasswordDisplay.value);
        CopyMessage.innerText = "Copied";
    }
    catch(e){
        CopyMessage.innerText = "Failed"; 
    }
    // to remove copied msg visible
    CopyMessage.classList.add("active");
    setTimeout(() => {
        CopyMessage.classList.remove("active");
    }, 2000 );   
}

function ShufflePassword(array){
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    CheckCount = 0;
    AllCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        CheckCount++;
    });
    //special condition
    if(PasswordLength < CheckCount){
        PasswordLength = CheckCount;
    }
}


// Event Listners
InputSlider.addEventListener('input', (e) => {
    PasswordLength = e.target.value;
    handleSlider();
}
)

CopyButton.addEventListener('click', () => {
    if(PasswordDisplay.value){
     CopyContent();
    }
})

AllCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
});

GenerateButton.addEventListener('click', () => {
    //none of the checkbox are selected
    if(CheckCount <=0) return;

    if(PasswordLength< CheckCount){
        PasswordLength = CheckCount;
        handleSlider();
    }
    console.log("Starting the Journey");
    //remove old password
    Password = "";


    let FuncArr = [];
    if(UpperCase.checked)
         FuncArr.push(GenerateUpperCase);

    if(LowerCase.checked)
         FuncArr.push(GenerateLowerCase);

    if(Numbers.checked)
         FuncArr.push(GenerateNumber);

    if(Symbols.checked)
        FuncArr.push(GenerateSymbols)
    
    //compulsary addition

    for(let i=0; i<FuncArr.length; i++){
        Password += FuncArr[i]();
    }
    console.log("compulsary addition done");

    //remaining addition
    for(let i=0; i<PasswordLength-FuncArr.length; i++){
        let RandomIndex = GetRandomInteger(0, FuncArr.length-1);
        console.log("RandomIndex" + RandomIndex)
        Password += FuncArr[RandomIndex]();
    }


    console.log("Remaining addition done");
    //shuffling of password
    Password = ShufflePassword(Array.from(Password));
    console.log("Shuffling Done");
    //displaying the password
    PasswordDisplay.value = Password;
    console.log("Displaying Done");
    //calulating strength
    CalStrength();

});

