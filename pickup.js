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
  <input type="text" class="from" required>
  <label>From</label>
</div>

<div class="input-box">
  <input type="text" class="to" required>
  <label>To</label>
</div>

<div class="delete-icon" onclick="deleteCar(this)">
❌
</div>

`;

carsContainer.appendChild(div);

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
block.querySelector(".carname").value;

let carno =
block.querySelector(".carno").value;

let carvalue =
block.querySelector(".carvalue").value;

let packer =
block.querySelector(".packer").value;

let from =
block.querySelector(".from").value;

let to =
block.querySelector(".to").value;

// SAVE EACH CAR BLOCK
carDetails.push(

`🚗 CAR ${carDetails.length + 1}

Car Name : ${carname}        ||        Packer : ${packer}

Car No : ${carno}            ||        From : ${from}

Car Value : ${carvalue}      ||        To : ${to}


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
(car.match(/Car Name\s*:\s*(.*?)\s*\|\|/)||[])[1] || "";

let packer =
(car.match(/Packer\s*:\s*(.*)/)||[])[1] || "";

let carNo =
(car.match(/Car No\s*:\s*(.*?)\s*\|\|/)||[])[1] || "";

let from =
(car.match(/From\s*:\s*(.*)/)||[])[1] || "";

let carValue =
(car.match(/Car Value\s*:\s*(.*?)\s*\|\|/)||[])[1] || "";

let to =
(car.match(/To\s*:\s*(.*)/)||[])[1] || "";

block.querySelector(".carname").value =
carName.trim();

block.querySelector(".carno").value =
carNo.trim();

block.querySelector(".carvalue").value =
carValue.trim();

block.querySelector(".packer").value =
packer.trim();

block.querySelector(".from").value =
from.trim();

block.querySelector(".to").value =
to.trim();

});

updateCarNumbers();

document.getElementById(
"searchResult"
).innerHTML = `

<div class="car-block">

<h3>✅ Entry Found</h3>

<p><b>Entry ID:</b> ${data.entryId}</p>
<p><b>Date:</b> ${data.date}</p>
<p><b>Trailer:</b> ${data.trailer}</p>
<p><b>Transport:</b> ${data.transport}</p>
<p><b>Mobile:</b> ${data.mobile}</p>

<pre>${data.cars}</pre>

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
block.querySelector(".carname").value;

let carno =
block.querySelector(".carno").value;

let carvalue =
block.querySelector(".carvalue").value;

let packer =
block.querySelector(".packer").value;

let from =
block.querySelector(".from").value;

let to =
block.querySelector(".to").value;

carDetails.push(

`🚗 CAR ${carDetails.length + 1}

Car Name : ${carname}        ||        Packer : ${packer}

Car No : ${carno}            ||        From : ${from}

Car Value : ${carvalue}      ||        To : ${to}

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