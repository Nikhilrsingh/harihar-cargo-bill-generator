// 🔴 PASTE YOUR GOOGLE WEB APP URL HERE
let url = "https://script.google.com/macros/s/AKfycbwe3QH_UHcDDWyPzdFtVc8VtrjOVUQvCK_IYzfvV6JpRMd8uU4P-pAXsqX8LWuHLQVYvw/exec";

let selectedEntryId = "";


function addMoreCar(){

const carsContainer =
document.getElementById("carsContainer");

const carCount =
document.querySelectorAll(".car-block").length + 1;

const div =
document.createElement("div");

div.classList.add("car-block");

div.innerHTML = `

<h3>🚗 Car ${carCount} Details</h3>

<div class="input-box">

<input type="text" class="carname" required>

<label>Car Name</label>

<div class="suggestions carSuggestions"></div>

</div>

<div class="input-box">

<input type="text" class="carno" required>

<label>Car Number</label>

</div>

<div class="input-box">

<input type="text" class="carvalue" required>

<label>Car Value</label>

</div>

<div class="input-box">

<input type="text" class="packer" required>

<label>Packer Name</label>

</div>

<div class="input-box">

<input type="text" class="partyname" required>

<label>Party Name</label>

</div>

<div class="input-box">

<input type="text" class="from" required>

<label>From</label>

<div class="suggestions fromSuggestions"></div>

</div>

<div class="input-box">

<input type="text" class="to" required>

<label>To</label>

<div class="suggestions toSuggestions"></div>

</div>

<div class="input-box">

<input type="text" class="pincode" required>

<label>Pincode</label>

</div>

<div class="delete-icon" onclick="deleteCar(this)">
❌
</div>

`;

carsContainer.appendChild(div);

setupSuggestions();

}

function deleteCar(icon){

let totalBlocks =
document.querySelectorAll(".car-block").length;

if(totalBlocks === 1){
alert("At least one car block required");
return;
}

icon.parentElement.remove();

updateCarNumbers();

}

function updateCarNumbers(){

let blocks = document.querySelectorAll(".car-block");

blocks.forEach((block,index)=>{

block.querySelector("h3").innerText =
"🚗 Car " + (index + 1);

});

}

function savePickupData(){

// FORMAT DATE
let rawDate = document.getElementById("date").value;

let formattedDate = "";

if(rawDate){

let d = new Date(rawDate);

let day = String(d.getDate()).padStart(2,"0");
let month = String(d.getMonth()+1).padStart(2,"0");
let year = d.getFullYear();

formattedDate = day + "/" + month + "/" + year;

}

// CAR DETAILS ARRAY
let carDetails = [];

document.querySelectorAll("#carsContainer .car-block").forEach(block=>{

let carname =
block.querySelector(".carname").value || "-";

let carno =
block.querySelector(".carno").value || "-";

let carvalue =
block.querySelector(".carvalue").value || "-";

let packer =
block.querySelector(".packer").value || "-";

let partyname =
block.querySelector(".partyname").value || "-";

let from =
block.querySelector(".from").value || "-";

let to =
block.querySelector(".to").value || "-";

let pincode =
block.querySelector(".pincode").value || "-";

// SAVE EACH CAR BLOCK
carDetails.push(

`🚗 CAR ${carDetails.length + 1}

Car Name : ${carname}            ||        Car No : ${carno}

Party Name : ${partyname}            ||        Packer : ${packer}

From : ${from}            ||        To : ${to}

Car Value : ${carvalue}            ||        Pincode : ${pincode}


`

);

});

// FINAL DATA OBJECT
let data = {

date: formattedDate,

trailer:
document.getElementById("trailer").value,

transport:
document.getElementById("transport").value,

mobile:
document.getElementById("mobile").value,

cars:
carDetails.join("")

};

// SEND DATA
fetch(url,{
method:"POST",
mode:"no-cors",
body: JSON.stringify(data)
});

// SUCCESS MESSAGE
setTimeout(()=>{

alert(
"✅ Pickup Entry Saved\n\n" +
"Entry ID: " + data.entryId
);

},800);

}



function searchEntry(){

let id =
document.getElementById("searchId").value.trim();

if(id === ""){

document.getElementById(
"searchResult"
).innerHTML = `
<div class="car-block">
<h3>❌ Please Enter Entry ID</h3>
</div>
`;

return;

}

fetch(
url + "?id=" + encodeURIComponent(id)
)
.then(res => res.json())
.then(data => {
  if(!data.found){

document.getElementById(
"searchResult"
).innerHTML = `
<div class="car-block">
<h3>❌ Entry Not Found</h3>
</div>
`;

return;

}

  selectedEntryId = data.entryId;

  document.getElementById("date").value =
convertDateForInput(data.date);

  document.getElementById("trailer").value =
data.trailer;

document.getElementById("transport").value =
data.transport;

document.getElementById("mobile").value =
data.mobile;

document.getElementById("carsContainer").innerHTML = "";

let cars =
data.cars.split("🚗 CAR");

let validCars =
cars.filter(car => car.trim() !== "");

validCars.forEach(car=>{

addMoreCar();

});

let blocks =
document.querySelectorAll(".car-block");

validCars.forEach((car,index)=>{

if(car.trim() === "") return;

let block = blocks[index];

if(!block) return;

let carName =
(car.match(/Car Name\s*:\s*(.*?)\s*\|\|\s*Car No\s*:/)||[])[1] || "( - )";

let carNo =
(car.match(/Car No\s*:\s*(.*?)(\n|$)/)||[])[1] || "( - )";

let partyname =
(car.match(/Party Name\s*:\s*(.*?)\s*\|\|\s*Packer\s*:/)||[])[1] || "( - )";

let packer =
(car.match(/Packer\s*:\s*(.*?)(\n|$)/)||[])[1] || "( - )";

let from =
(car.match(/From\s*:\s*(.*?)\s*\|\|\s*To\s*:/)||[])[1] || "( - )";

let to =
(car.match(/To\s*:\s*(.*?)(\n|$)/)||[])[1] || "( - )";

let carValue =
(car.match(/Car Value\s*:\s*(.*?)\s*\|\|\s*Pincode\s*:/)||[])[1] || "( - )";

let pincode =
(car.match(/Pincode\s*:\s*(.*?)(\n|$)/)||[])[1] || "( - )";

block.querySelector(".carname").value =
carName.trim();

block.querySelector(".carno").value =
carNo.trim();

block.querySelector(".carvalue").value =
carValue.trim();

block.querySelector(".packer").value =
packer.trim();

block.querySelector(".partyname").value =
partyname ? partyname.trim() : "( - )";

block.querySelector(".from").value =
from.trim();

block.querySelector(".to").value =
to.trim();

block.querySelector(".pincode").value =
pincode ? pincode.trim() : "( - )";

});

updateCarNumbers();

document.getElementById(
"searchResult"
).innerHTML = `

<div class="search-card">

<h3>✅ Entry Found</h3>

<div class="top-info">

<div class="top-item">

🆔

<div>

<span>Entry ID</span>

<b>${data.entryId}</b>

</div>

</div>

<div class="top-item">

📅

<div>

<span>Date</span>

<b>${data.date}</b>

</div>

</div>

<div class="top-item">

🚛

<div>

<span>Trailer</span>

<b>${data.trailer}</b>

</div>

</div>

<div class="top-item">

🏢

<div>

<span>Transport</span>

<b>${data.transport}</b>

</div>

</div>

<div class="top-item">

📞

<div>

<span>Mobile</span>

<b>${data.mobile}</b>

</div>

</div>

</div>

<div class="cars-output">

<pre>

${data.cars.replaceAll("||","\n")}

</pre>

</div>

</div>

`;

});

}

function convertDateForInput(dateString){

let parts = dateString.split("/");

return `${parts[2]}-${parts[1]}-${parts[0]}`;

}



function updateEntry(){

if(selectedEntryId === ""){

alert("Please search an Entry ID first");

return;

}

let rawDate =
document.getElementById("date").value;

let formattedDate = "";

if(rawDate){

let d = new Date(rawDate);

let day = String(d.getDate()).padStart(2,"0");
let month = String(d.getMonth()+1).padStart(2,"0");
let year = d.getFullYear();

formattedDate =
day + "/" + month + "/" + year;

}

let carDetails = [];

document.querySelectorAll("#carsContainer .car-block").forEach(block=>{

let carname =
block.querySelector(".carname").value || "-";

let carno =
block.querySelector(".carno").value || "-";

let carvalue =
block.querySelector(".carvalue").value || "-";

let packer =
block.querySelector(".packer").value || "-";

let partyname =
block.querySelector(".partyname").value || "-";

let from =
block.querySelector(".from").value || "-";

let to =
block.querySelector(".to").value || "-";

let pincode =
block.querySelector(".pincode").value || "-";

carDetails.push(

`🚗 CAR ${carDetails.length + 1}

Car Name : ${carname}            ||        Car No : ${carno}

Party Name : ${partyname}            ||        Packer : ${packer}

From : ${from}            ||        To : ${to}

Car Value : ${carvalue}            ||        Pincode : ${pincode}


`

);

});

let updateData = {

action:"update",

entryId:selectedEntryId,

date:formattedDate,

trailer:
document.getElementById("trailer").value,

transport:
document.getElementById("transport").value,

mobile:
document.getElementById("mobile").value,

cars:
carDetails.join("")

};

fetch(url,{
method:"POST",
body:JSON.stringify(updateData)
})
.then(res=>res.json())
.then(data=>{

if(data.success){

alert("✅ Entry Updated");

}else{

alert("❌ Entry Not Found");

}

});

}


const allCars = [

"Maruti Alto",

"Maruti S-Presso",

"Maruti WagonR",

"Maruti Celerio",

"Maruti Swift",

"Maruti Baleno",

"Maruti Dzire",

"Maruti Brezza",

"Maruti Fronx",

"Maruti Ertiga",

"Maruti XL6",

"Maruti Jimny",

"Hyundai Grand i10",

"Hyundai i20",

"Hyundai Exter",

"Hyundai Venue",

"Hyundai Creta",

"Hyundai Alcazar",

"Hyundai Verna",

"Tata Tiago",

"Tata Tigor",

"Tata Altroz",

"Tata Punch",

"Tata Nexon",

"Tata Curvv",

"Tata Harrier",

"Tata Safari",

"Mahindra Bolero",

"Mahindra Bolero Neo",

"Mahindra Thar",

"Mahindra XUV 3XO",

"Mahindra XUV700",

"Mahindra Scorpio N",

"Mahindra Scorpio Classic",

"Kia Sonet",

"Kia Seltos",

"Kia Carens",

"Kia Syros",

"Honda Amaze",

"Honda City",

"Honda Elevate",

"Toyota Glanza",

"Toyota Taisor",

"Toyota Rumion",

"Toyota Innova Hycross",

"Toyota Fortuner",

"Renault Kwid",

"Renault Kiger",

"Nissan Magnite",

"Volkswagen Virtus",

"Volkswagen Taigun",

"Skoda Slavia",

"Skoda Kushaq",

"MG Astor",

"MG Hector",

"MG Windsor EV",

"BYD Atto 3",

"BYD Seal"

];

const cities = [

"Nagpur",

"Pune",

"Mumbai",

"Nashik",

"Aurangabad",

"Kolhapur",

"Solapur",

"Amravati",

"Akola",

"Jalgaon",

"Raipur",

"Bilaspur",

"Durg",

"Bhilai",

"Jagdalpur",

"Indore",

"Bhopal",

"Jabalpur",

"Gwalior",

"Ujjain",

"Delhi",

"Gurgaon",

"Faridabad",

"Noida",

"Ghaziabad",

"Jaipur",

"Udaipur",

"Kota",

"Jodhpur",

"Ahmedabad",

"Surat",

"Vadodara",

"Rajkot",

"Gandhinagar",

"Hyderabad",

"Warangal",

"Bengaluru",

"Mysuru",

"Chennai",

"Coimbatore",

"Madurai",

"Kochi",

"Thiruvananthapuram",

"Goa",

"Kolkata",

"Bhubaneswar",

"Lucknow",

"Kanpur",

"Varanasi",

"Prayagraj",

"Chandigarh",

"Ludhiana",

"Amritsar"

];

const cityPincode = {

"Nagpur":"440001",

"Pune":"411001",

"Mumbai":"400001",

"Nashik":"422001",

"Aurangabad":"431001",

"Kolhapur":"416003",

"Solapur":"413001",

"Amravati":"444601",

"Akola":"444001",

"Jalgaon":"425001",

"Raipur":"492001",

"Bilaspur":"495001",

"Durg":"491001",

"Bhilai":"490006",

"Jagdalpur":"494001",

"Indore":"452001",

"Bhopal":"462001",

"Jabalpur":"482001",

"Gwalior":"474001",

"Ujjain":"456001",

"Delhi":"110001",

"Gurgaon":"122001",

"Faridabad":"121001",

"Noida":"201301",

"Ghaziabad":"201001",

"Jaipur":"302001",

"Udaipur":"313001",

"Kota":"324001",

"Jodhpur":"342001",

"Ahmedabad":"380001",

"Surat":"395003",

"Vadodara":"390001",

"Rajkot":"360001",

"Gandhinagar":"382010",

"Hyderabad":"500001",

"Warangal":"506002",

"Bengaluru":"560001",

"Mysuru":"570001",

"Chennai":"600001",

"Coimbatore":"641001",

"Madurai":"625001",

"Kochi":"682011",

"Thiruvananthapuram":"695001",

"Goa":"403001",

"Kolkata":"700001",

"Bhubaneswar":"751001",

"Lucknow":"226001",

"Kanpur":"208001",

"Varanasi":"221001",

"Prayagraj":"211001",

"Chandigarh":"160001",

"Ludhiana":"141001",

"Amritsar":"143001"

};

function setupSuggestions(){

document.querySelectorAll(".car-block")
.forEach(block=>{

connectSuggestion(

block,

".carname",

".carSuggestions",

allCars

);

connectSuggestion(

block,

".from",

".fromSuggestions",

cities

);

connectSuggestion(

block,

".to",

".toSuggestions",

cities

);

});

}


function connectSuggestion(

block,

inputClass,

boxClass,

data

){

const input =
block.querySelector(inputClass);

const box =
block.querySelector(boxClass);

if(!input || !box) return;

input.oninput = function(){

const value =
this.value.toLowerCase().trim();

if(value === ""){

box.innerHTML = "";

box.style.display = "none";

return;

}

const matches =
data.filter(item=>

item.toLowerCase()
.includes(value)

);

box.innerHTML = "";

matches.slice(0,3)
.forEach(item=>{

const div =
document.createElement("div");

div.className =
"suggestion-item";

div.innerText =
item;

div.onclick = ()=>{

input.value =
item;

box.style.display =
"none";

if(
input.classList.contains("to")
){

const pincodeInput =
block.querySelector(".pincode");

if(
cityPincode[item]
){

pincodeInput.value =
cityPincode[item];

}

}

};

box.appendChild(div);

});

box.style.display =
matches.length
? "block"
: "none";

};

}

setupSuggestions();


function shareEntry(){

if(selectedEntryId === ""){

alert(
"Search an entry first"
);

return;

}

const popup =

document.getElementById(
"sharePopup"
);

const list =

document.getElementById(
"shareCarsList"
);

list.innerHTML = "";

document
.querySelectorAll(".car-block")
.forEach((block,index)=>{

const carName =

block.querySelector(".carname")
.value || "-";

list.innerHTML +=

`

<div class="share-item">

<label>

<input

type="checkbox"

class="shareSelection"

value="${index}"

checked>

🚗 Car ${index+1}

(${carName})

</label>

</div>

`;

});

popup.style.display =
"flex";

}


function closeSharePopup(){

document.getElementById(
"sharePopup"
).style.display = "none";

}



function copySelectedCars(){

let message =

`🚚 HARIHAR CARGO CARRIERS

🆔 Entry ID : ${selectedEntryId}

📅 Date : ${document.getElementById("date")
.value
.split("-")
.reverse()
.join("-")}

🚛 Trailer : ${document.getElementById("trailer").value}

🏢 Transport : ${document.getElementById("transport").value}

📞 Mobile : ${document.getElementById("mobile").value}

━━━━━━━━━━━━━━

`;

const selectedCars =

document.querySelectorAll(
".shareSelection:checked"
);

if(
selectedCars.length === 0
){

alert(
"Select at least 1 car"
);

return;

}


selectedCars.forEach(item=>{

const index =
item.value;

const block =

document.querySelectorAll(
".car-block"
)[index];

message +=

`🚗 CAR ${Number(index)+1}

Car Name : ${block.querySelector(".carname").value}

Car No : ${block.querySelector(".carno").value}

Party Name : ${block.querySelector(".partyname").value}

Packer : ${block.querySelector(".packer").value}

From : ${block.querySelector(".from").value}

To : ${block.querySelector(".to").value}

Car Value : ${block.querySelector(".carvalue").value}

Pincode : ${block.querySelector(".pincode").value}

━━━━━━━━━━━━━━

`;

});


if(navigator.share){

navigator.share({

text:message

});

}else{

navigator.clipboard
.writeText(message);

alert(
"✅ Copied"
);

}

closeSharePopup();

}


function shareSelectedCars(){

let message =

`🚚 HARIHAR CARGO CARRIERS

🆔 Entry ID : ${selectedEntryId}

📅 Date : ${document.getElementById("date")
.value
.split("-")
.reverse()
.join("-")}

🚛 Trailer : ${document.getElementById("trailer").value}

🏢 Transport : ${document.getElementById("transport").value}

📞 Mobile : ${document.getElementById("mobile").value}

━━━━━━━━━━━━━━

`;

const selectedCars =

document.querySelectorAll(
".shareSelection:checked"
);

if(
selectedCars.length === 0
){

alert(
"Select at least 1 car"
);

return;

}

selectedCars.forEach(item=>{

const index =
item.value;

const block =

document.querySelectorAll(
".car-block"
)[index];

message +=

`🚗 CAR ${Number(index)+1}

Car Name : ${block.querySelector(".carname").value}

Car No : ${block.querySelector(".carno").value}

Party Name : ${block.querySelector(".partyname").value}

Packer : ${block.querySelector(".packer").value}

From : ${block.querySelector(".from").value}

To : ${block.querySelector(".to").value}

Car Value : ${block.querySelector(".carvalue").value}

Pincode : ${block.querySelector(".pincode").value}

━━━━━━━━━━━━━━

`;

});

window.open(

"https://wa.me/?text=" +

encodeURIComponent(message),

"_blank"

);

closeSharePopup();

}


function downloadPdf(){

const selectedCars =
document.querySelectorAll(
".shareSelection:checked"
);

if(
selectedCars.length===0
){

alert(
"Select at least one car"
);

return;

}

let html = `

<html>

<head>

<title>

${selectedEntryId}

</title>

<style>

@page{

size:A4 portrait;

margin:12mm;

}

body{

font-family:Arial,sans-serif;

background:#f5f5f5;

padding:20px;

color:#222;

}

.page{

width:850px;

margin:auto;

background:white;

padding:25px;

box-sizing:border-box;

}

.header{

background:linear-gradient(
135deg,
#c40000,
#ff5a5a
);

color:white;

padding:16px;

border-radius:18px;

text-align:center;

font-size:24px;

font-weight:700;

}

.subtitle{

text-align:center;

font-size:18px;

font-weight:700;

margin:15px 0 30px;

color:#555;

}

.top-details{

display:grid;

grid-template-columns:1fr 1fr;

gap:14px;

margin-bottom:30px;

}

.detail{

background:#f5f5f5;

padding:12px;

border-radius:12px;

font-size:15px;

font-weight:700;

}

.cars-container{

display:grid;

grid-template-columns:1fr 1fr;

gap:22px;

}

.car{

background:#fff;

border:2px solid #ececec;

border-radius:18px;

padding:16px;

box-shadow:0 3px 8px rgba(0,0,0,.08);

box-sizing:border-box;

break-inside:avoid;

page-break-inside:avoid;

min-height:230px;

}

.car:only-child{

grid-column:1/span 2;

}

.car-title{

font-size:18px;

font-weight:700;

color:#c40000;

margin-bottom:12px;

padding-bottom:8px;

border-bottom:2px solid #f0f0f0;

}

.car-line{

font-size:14px;

padding:7px 0;

font-weight:600;

}

.footer{

margin-top:30px;

text-align:center;

font-size:13px;

font-weight:700;

color:#666;

}

@media print{

body{

background:white;

padding:0;

}

.page{

width:850px;

padding:0;

}

.car{

break-inside:avoid;

page-break-inside:avoid;

}

}

</style>

</head>

<body>

<div class="page">

<div class="header">

🚚 HARIHAR CARGO CARRIERS

</div>

<div class="subtitle">

Vehicle Dispatch Report

</div>

<div class="top-details">

<div class="detail">

🆔 Entry ID : ${selectedEntryId}

</div>

<div class="detail">

📅 Date : ${
document.getElementById("date").value
.split("-")
.reverse()
.join("-")
}

</div>

<div class="detail">

🚛 Trailer : ${
document.getElementById("trailer").value
}

</div>

<div class="detail">

📞 Mobile : ${
document.getElementById("mobile").value
}

</div>

<div class="detail">

🏢 Transport : ${
document.getElementById("transport").value
}

</div>

</div>

<div class="cars-container">

`;

selectedCars.forEach(item=>{

const carIndex =
item.value;

const block =

document.querySelectorAll(
".car-block"
)[carIndex];

html += `

<div class="car">

<div class="car-title">

🚗 CAR ${Number(carIndex)+1}

</div>

<div class="car-line">

🚘 Car Name : ${
block.querySelector(".carname").value || "-"
}

</div>

<div class="car-line">

🔢 Car No : ${
block.querySelector(".carno").value || "-"
}

</div>

<div class="car-line">

👤 Party Name : ${
block.querySelector(".partyname").value || "-"
}

</div>

<div class="car-line">

📦 Packer Name : ${
block.querySelector(".packer").value || "-"
}

</div>

<div class="car-line">

📍 Route : ${
block.querySelector(".from").value || "-"
} ➜ ${
block.querySelector(".to").value || "-"
}

</div>

<div class="car-line">

📮 Pincode : ${
block.querySelector(".pincode").value || "-"
}

</div>

<div class="car-line">

💰 Car Value : ${
block.querySelector(".carvalue").value || "-"
}

</div>

</div>

`;

});

html += `

</div>

<div class="footer">

Generated by Harihar Cargo System

</div>

</div>

</body>

</html>

`;

const win =

window.open(
"",
"_blank"
);

win.document.write(
html
);

win.document.close();

setTimeout(()=>{

win.print();

},700);

closeSharePopup();

}