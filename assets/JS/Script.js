// // =====================================================
// //  PAYMENT SCHEDULE - beginner version (let + function)
// //  Read from top to bottom. Each function has one job.
// // =====================================================

// // Month names, used to show dates like 6-Nov-26
// let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
//                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// // -----------------------------------------------------
// // SMALL HELPER: get an element from the page by its id
// // -----------------------------------------------------
// function getEl(id) {
//   return document.getElementById(id);
// }


// // -----------------------------------------------------
// // PART 1: LOGIN / LOGOUT
// // (Demo only: the password is checked in the browser,
// //  so this is not real security.)
// // -----------------------------------------------------
// function login() {
//   let username = getEl("user").value.trim();
//   let password = getEl("pass").value;

//   // Change the username and password here
//   if (username === "admin" && password === "1234") {
//     getEl("loginPage").classList.add("hidden");      // hide login page
//     getEl("appPage").classList.remove("hidden");     // show app page
//     getEl("loginErr").textContent = "";
//   } else {
//     getEl("loginErr").textContent = "Wrong username or password";
//   }
// }

// // Press Enter in the password box = click Login
// function checkEnter(event) {
//   if (event.key === "Enter") {
//     login();
//   }
// }

// function logout() {
//   getEl("appPage").classList.add("hidden");
//   getEl("loginPage").classList.remove("hidden");
//   getEl("pass").value = "";
//   getEl("result").classList.add("hidden");
// }


// // -----------------------------------------------------
// // PART 2: DATE AND NUMBER HELPERS
// // -----------------------------------------------------

// // Add months to a date (from your code, with one fix)
// function addMonths(date, months) {
//   let newDate = new Date(date.getFullYear(), date.getMonth() + months, date.getDate());

//   // Problem: 31 Jan + 1 month becomes 3 Mar (Feb has no 31).
//   // Fix: if the day changed, go back to the last day of the month before.
//   if (newDate.getDate() !== date.getDate()) {
//     newDate.setDate(0);
//   }
//   return newDate;
// }

// // Turn a date into text like 6-Nov-26
// function formatDate(date) {
//   let day = date.getDate();
//   let month = monthNames[date.getMonth()];
//   let year = String(date.getFullYear()).slice(-2);   // 2026 -> "26"
//   return day + "-" + month + "-" + year;
// }

// // Round to 2 decimals: 178.5714 -> 178.57
// function round2(number) {
//   return Math.round(number * 100) / 100;
// }

// // Show a number as text: 196 -> "196", 18.7 -> "18.70"
// function money(number) {
//   let text = round2(number).toFixed(2);
//   if (text.endsWith(".00")) {
//     text = text.slice(0, -3);      // remove ".00"
//   }
//   return text;
// }

// // One small info box at the top of the result
// function infoBox(label, value) {
//   return "<div><small>" + label + "</small><b>" + value + "</b></div>";
// }


// // -----------------------------------------------------
// // PART 3: CALCULATE AND BUILD THE TABLE
// // -----------------------------------------------------
// function calculate() {

//   // Step 1: read what the user typed
//   let product  = getEl("product").value;
//   let price    = Number(getEl("price").value);
//   let months   = Number(getEl("duration").value);
//   let rate     = Number(getEl("rate").value);
//   let down     = Number(getEl("down").value);
//   let dateText = getEl("date").value;               // looks like "2026-10-06"

//   // Step 2: check the input is OK
//   if (price <= 0 || months < 1 || getEl("rate").value === "" || dateText === "") {
//     getEl("calcErr").textContent = "Please fill in Price, Duration, Interest and Date.";
//     return;                                          // stop here
//   }
//   getEl("calcErr").textContent = "";

//   // Step 3: turn the date text into a real Date
//   let parts = dateText.split("-");                   // ["2026", "10", "06"]
//   let startDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

//   // Step 4: do the maths
//   let amount = price - down;                         // money to pay in installments
//   let principalEach = amount / months;               // 1250 / 7 = 178.5714
//   let interestEach = amount * rate / 100;            // 1250 x 1.5% = 18.75

//   // Rows 2,3,4... use whole numbers (rounded down): 178 and 18
//   let smallPrincipal = Math.floor(principalEach);
//   let smallInterest = Math.floor(interestEach);

//   // Row 1 shows the exact numbers and also pays the leftover cents
//   let firstPrincipal = round2(principalEach);        // 178.57
//   let firstInterest = round2(interestEach);          // 18.75
//   let extraPrincipal = round2((months - 1) * (firstPrincipal - smallPrincipal));   // 3.42
//   let extraInterest = round2((months - 1) * (firstInterest - smallInterest));      // 4.5

//   // Step 5: build the table rows with a loop
//   let rowsHtml = "";

//   for (let i = 1; i <= months; i++) {
//     let payDate = formatDate(addMonths(startDate, i));

//     if (i === 1) {
//       // First row: red date, and total includes the extra cents
//       let firstTotal = firstPrincipal + firstInterest + extraPrincipal + extraInterest;
//       rowsHtml += "<tr><td>1</td><td class='red'>" + payDate + "</td><td>" +
//                   money(firstPrincipal) + "</td><td>" + money(firstInterest) +
//                   "</td><td>" + money(firstTotal) + "</td></tr>";
//     } else {
//       rowsHtml += "<tr><td>" + i + "</td><td>" + payDate + "</td><td>" +
//                   smallPrincipal + "</td><td>" + smallInterest +
//                   "</td><td>" + (smallPrincipal + smallInterest) + "</td></tr>";
//     }
//   }
//   getEl("rows").innerHTML = rowsHtml;

//   // Step 6: info boxes at the top
//   getEl("info").innerHTML =
//     infoBox("Product", product.replace(/</g, "&lt;")) +
//     infoBox("Price", money(price)) +
//     infoBox("Duration", months + " months") +
//     infoBox("Interest", rate + "% / month") +
//     infoBox("Principal", money(down)) +
//     infoBox("Start Date", formatDate(startDate));

//   // Step 7: total row at the bottom
//   let totalPrincipal = firstPrincipal + extraPrincipal + smallPrincipal * (months - 1);
//   let totalInterest = firstInterest + extraInterest + smallInterest * (months - 1);
//   getEl("foot").innerHTML = "<tr><td colspan='2'>TOTAL</td><td>" + money(totalPrincipal) +
//                             "</td><td>" + money(totalInterest) + "</td><td>" +
//                             money(totalPrincipal + totalInterest) + "</td></tr>";

//   // Step 8: small notes, then show the result card
//   getEl("printed").textContent = "Printed: " + formatDate(new Date());
//   getEl("show").textContent = "Rounding adjustment included in payment 1 — principal: " +
//                               money(extraPrincipal) + ", interest: " + money(extraInterest);
//   getEl("result").classList.remove("hidden");
// }

// ===============================
// Payment Schedule - class style
// ===============================
let monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// get the elements (same way as: let txt = document.getElementById('name'))
let loginPage  = document.getElementById('loginPage');
let appPage    = document.getElementById('appPage');
let txtUser    = document.getElementById('user');
let txtPass    = document.getElementById('pass');
let loginErr   = document.getElementById('loginErr');
let btnLogin   = document.getElementById('loginBtn');
let btnLogout  = document.getElementById('logoutBtn');
let btnCalc    = document.getElementById('calcBtn');
let calcErr    = document.getElementById('calcErr');

let txtProduct  = document.getElementById('product');
let txtPrice    = document.getElementById('price');
let txtDuration = document.getElementById('duration');
let txtRate     = document.getElementById('rate');
let txtDown     = document.getElementById('down');
let txtDate     = document.getElementById('date');

let resultCard = document.getElementById('result');
let info       = document.getElementById('info');
let rows       = document.getElementById('rows');
let foot       = document.getElementById('foot');
let printed    = document.getElementById('printed');
let note       = document.getElementById('show');

btnLogin.addEventListener("click", Login);
btnLogout.addEventListener("click", Logout);
btnCalc.addEventListener("click", Calculate);
txtPass.addEventListener("keydown", PassKey);

// ===============================
// Part 1: Login / Logout
// (demo only, the password is checked in the browser)
// ===============================
function Login(){
    if(txtUser.value == 'admin' && txtPass.value == '1234'){
        loginPage.classList.add('hidden');
        appPage.classList.remove('hidden');
        loginErr.innerText = '';
    }else{
        loginErr.innerText = 'Wrong username or password';
    }
}

function PassKey(e){
    if(e.key == 'Enter'){
        Login();
    }
}

function Logout(){
    appPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
    txtPass.value = '';
    resultCard.classList.add('hidden');
}

// ===============================
// Part 2: Helper functions
// ===============================

// add i months to a date text "DD-MM-YY"  (your code from class)
function fnMonth(start_dt, i){
    let [day, month, year] = start_dt.split("-").map(Number);
    let date = new Date(2000 + year, month - 1, day);
    date.setMonth(date.getMonth() + i);
    // fix: 31 Jan + 1 month = 3 Mar, so go back to the last day of Feb
    if(date.getDate() != day){
        date.setDate(0);
    }
    return date;
}

// date -> "6-Nov-26"
function fnFormat(date){
    return date.getDate() + "-" + monthName[date.getMonth()] + "-" + String(date.getFullYear()).slice(-2);
}

// 178.5714 -> 178.57
function Round2(x){
    return Number(x.toFixed(2));
}

// one small box at the top
function InfoBox(label, value){
    return `<div><small>${label}</small><b>${value}</b></div>`;
}

// ===============================
// Part 3: Calculate and show table
// ===============================
function Calculate(){
    let product  = txtProduct.value;
    let price    = Number(txtPrice.value);
    let n        = Number(txtDuration.value);   // month
    let interest = Number(txtRate.value);       // % per month
    let down     = Number(txtDown.value);
    let dt       = txtDate.value;               // DD-MM-YY

    if(price <= 0 || n < 1 || dt == ''){
        calcErr.innerText = 'Please fill in Price, Duration, Interest and Date.';
        return;
    }
    calcErr.innerText = '';

    let amt = price - down;          // money to pay in installments
    let mp  = amt / n;               // principal per month   1250/7 = 178.5714
    let mi  = amt * interest / 100;  // interest per month    1250*1.5% = 18.75
    let bp  = parseInt(mp);          // 178  (rows 2,3,4...)
    let bi  = parseInt(mi);          // 18

    // row 1 shows exact numbers and also pays the leftover cents
    let firstP = Round2(mp);                    // 178.57
    let firstI = Round2(mi);                    // 18.75
    let extraP = Round2((firstP - bp) * (n-1)); // 3.42
    let extraI = Round2((firstI - bi) * (n-1)); // 4.5

    let tbl = '';
    for(let i=1; i<=n; i++){
        let d = fnFormat(fnMonth(dt, i));
        if(i == 1){
            let t = Round2(firstP + firstI + extraP + extraI);
            tbl += `<tr>
                <td>${i}</td>
                <td class="red">${d}</td>
                <td>${firstP}</td>
                <td>${firstI}</td>
                <td>${t}</td>
            </tr>`;
        }else{
            tbl += `<tr>
                <td>${i}</td>
                <td>${d}</td>
                <td>${bp}</td>
                <td>${bi}</td>
                <td>${bp + bi}</td>
            </tr>`;
        }
    }
    rows.innerHTML = tbl;

    // info boxes
    info.innerHTML =
        InfoBox('Product', product.replace(/</g, '&lt;')) +
        InfoBox('Price', price) +
        InfoBox('Duration', `${n} months`) +
        InfoBox('Interest', `${interest}% / month`) +
        InfoBox('Principal', down) +
        InfoBox('Start Date', fnFormat(fnMonth(dt, 0)));

    // total row
    let totP = Round2(firstP + extraP + bp * (n-1));
    let totI = Round2(firstI + extraI + bi * (n-1));
    foot.innerHTML = `<tr>
        <td colspan="2">TOTAL</td>
        <td>${totP}</td>
        <td>${totI}</td>
        <td>${Round2(totP + totI)}</td>
    </tr>`;

    printed.innerText = `Printed: ${fnFormat(new Date())}`;
    note.innerText = `Rounding adjustment included in payment 1 - principal: ${extraP}, interest: ${extraI}`;
    resultCard.classList.remove('hidden');
}