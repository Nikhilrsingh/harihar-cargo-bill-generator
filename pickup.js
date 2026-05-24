function addMoreCar(){

let container = document.getElementById("carsContainer");

let totalCars =
document.querySelectorAll(".car-block").length + 1;

let block = document.createElement("div");

block.classList.add("car-block");

block.innerHTML = `

<h3>🚗 Car ${totalCars}</h3>

<input type="text" class="carname" placeholder="Car Name">

<input type="text" class="carno" placeholder="Car No">

<input type="text" class="carvalue" placeholder="Car Value">

<input type="text" class="packer" placeholder="Packer Name">

<input type="text" class="from" placeholder="From">

<input type="text" class="to" placeholder="To">

<div class="delete-icon" onclick="deleteCar(this)">
❌
</div>

`;

container.appendChild(block);

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

document.querySelectorAll(".car-block").forEach(block=>{

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

`🚗 Car ${carDetails.length + 1}

Car Name: ${carname}

Car No: ${carno}

Car Value: ${carvalue}

Packer: ${packer}

From: ${from}

To: ${to}

------------------------`

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
carDetails.join(" || ")

};

// 🔴 PASTE YOUR GOOGLE WEB APP URL HERE
let url = "https://script.google.com/macros/s/AKfycbwe3QH_UHcDDWyPzdFtVc8VtrjOVUQvCK_IYzfvV6JpRMd8uU4P-pAXsqX8LWuHLQVYvw/exec";

// SEND DATA
fetch(url,{
method:"POST",
mode:"no-cors",
body: JSON.stringify(data)
});

// SUCCESS MESSAGE
setTimeout(()=>{

alert("✅ Pickup Entry Saved");

},800);

}