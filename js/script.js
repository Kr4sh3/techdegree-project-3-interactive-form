//Focus first text input on screen
document.querySelector('input[type="text"]').focus();

//Hide other job role text field, show only when the other job role option is selected
const otherJobTextField = document.querySelector('#other-job-role');
otherJobTextField.hidden = true;
document.querySelector('#title').addEventListener('change', (e) => otherJobTextField.hidden = e.target.value !== "other");

/*
Hides color select until a design is selected, selects a valid color when a design is chosen and hides invalid options
Instructions say to hide the select element, but I hid the div that contains both it and the label because I didnt like the "Color:" text still showing before you selected an option
*/
const tShirtDiv = document.querySelector('#shirt-colors');
tShirtDiv.hidden = true;
const designSelect = document.querySelector("#design");
designSelect.addEventListener('change', (e) => {
    tShirtDiv.hidden = false;
    const tShirtSelect = tShirtDiv.querySelector('#color');
    const colors = tShirtSelect.querySelectorAll("option[value]");
    const availableColors = Array.from(colors).filter((color) => color.dataset.theme === designSelect.value);
    tShirtSelect.value = availableColors[0].value;
    colors.forEach((color) => {
        color.hidden = !availableColors.includes(color);
        color.disabled = !availableColors.includes(color);
    });
});

//Changes the text content of the Activities Cost element to match the sum of all activity options
const activitiesFS = document.querySelector('#activities');
const activities = activitiesFS.querySelectorAll('input[data-cost]');
const total = document.querySelector('#activities-cost');
activitiesFS.addEventListener('change', (e) => {
    let cost = 0;
    activities.forEach((activity) => {
        //Cost
        if (activity.checked === true)
            cost += parseInt(activity.dataset.cost);
        //Conflicting time check
        if (e.target.dataset.dayAndTime != null && e.target.dataset.dayAndTime === activity.dataset.dayAndTime && e.target != activity) {
            if (e.target.checked)
                activity.disabled = true;
            else
                activity.disabled = false;
        }
    });
    total.textContent = `Total: $${cost}`;
});

//Hides payment divs based on what the currently selected payment method is, and defaults page to credit card method
const paySelect = document.querySelector('#payment');
paySelect.addEventListener('change', (e) => {
    const paymentMethods = ['credit-card', 'paypal', 'bitcoin'];
    let paymentDivs = [];
    paymentMethods.forEach((payment) => paymentDivs.push(document.querySelector(`#${payment}`)));
    paymentDivs.forEach((paymentDiv) => paymentDiv.hidden = paySelect.value !== paymentDiv.id);
});
paySelect.value = 'credit-card';
document.querySelector('#bitcoin').hidden = true;
document.querySelector('#paypal').hidden = true;

//Form Validation
const form = document.querySelector('form');
const ccNum = document.querySelector('#cc-num'); //Used for real time validation
form.addEventListener('submit', (e) => {
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const activitiesBox = document.querySelector('#activities-box')
    const zip = document.querySelector('#zip');
    const cvv = document.querySelector('#cvv');

    function validateInput(input, validationFunc, hint, hintText = '') {
        if (validationFunc(input)) {
            setValid(input, hint, true, hintText);
        } else {
            setValid(input, hint, false, hintText);
            e.preventDefault();
        }
    }

    let nameHint;
    name.value === '' ? nameHint = 'Name field cannot be blank' : nameHint = 'Name can only contain letters';
    validateInput(name, validateName, document.querySelector('#name-hint'), nameHint);
    let emailHint;
    email.value === '' ? emailHint = 'Email field cannot be blank' : emailHint = 'Email address must be formatted correctly';
    validateInput(email, validateEmail, document.querySelector('#email-hint'), emailHint);
    validateInput(activitiesBox, validateActivities, document.querySelector('#activities-hint'));

    //If not using credit card, ignore the rest of validation
    if (paySelect.value !== 'credit-card')
        return;

    validateInput(ccNum, validateCCNum, document.querySelector('#cc-hint'));
    validateInput(zip, validateZip, document.querySelector('#zip-hint'));
    validateInput(cvv, validateCVV, document.querySelector('#cvv-hint'));
});

//Realtime CCNumber Validation
ccNum.addEventListener('keyup', (e) => {
    if (validateCCNum(ccNum)) {
        setValid(ccNum, document.querySelector('#cc-hint'), true);
    }
    else {
        setValid(ccNum, document.querySelector('#cc-hint'), false);
    }
    const reformattedNumberArray = reformatNumber(ccNum.value).match(/\d{1,4}/g);
    if (reformattedNumberArray != null)
        ccNum.value = reformattedNumberArray.join('-');
    else
        ccNum.value = '';
});

//Validation Helper Functions
function setValid(input, hint, valid, hintText = '') {
    if (hintText !== '')
        hint.textContent = hintText;
    if (valid) {
        input.parentNode.classList.add('valid');
        input.parentNode.classList.remove('not-valid');
        hint.style.display = 'none';
    } else {
        input.parentNode.classList.remove('valid');
        input.parentNode.classList.add('not-valid');
        hint.style.display = 'block';
    }
}

function reformatNumber(num) {
    return num.replace(/([\D])/g, '');
}

function validateName(name) {
    return /^[a-zA-Z]+[a-zA-Z\s]*$/.test(name.value);
}

function validateEmail(email) {
    return /^\w+@\w+\.\w+$/.test(email.value);
}

function validateActivities(activitiesBox) {
    const activities = activitiesBox.querySelectorAll('input[type="checkbox"]');
    let oneSelected = false;
    activities.forEach((activity) => { if (activity.checked) oneSelected = true });
    return oneSelected;
}

function validateCCNum(ccNum) {
    return /(^\d{13,16}$)/.test(reformatNumber(ccNum.value));
}

function validateZip(zip) {
    return /^\d{5}$/.test(reformatNumber(zip.value));
}

function validateCVV(cvv) {
    return /^\d{3}$/.test(reformatNumber(cvv.value));
}

//Adds visible focus indicator to checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('focus', (e) => {
        e.target.parentNode.classList.add('focus');
    });
    checkbox.addEventListener('blur', (e) => {
        e.target.parentNode.classList.remove('focus');
    });
});

