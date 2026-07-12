const url =
"https://script.google.com/macros/s/AKfycbw6LK7wtkjcu8RMt7sw43h0z13cmThISJCJ8pVkO-0uFDz_kB4xGXt8LD_DdqapnTxc/exec";

let searchedLR = "";

function fillBilty(){

document.getElementById("outConsignor").innerText =
document.getElementById("inConsignor").value;

document.getElementById("outConsignorAddr").innerText =
document.getElementById("inConsignorAddr").value;


document.getElementById("outConsignee").innerText =
document.getElementById("inConsignee").value;

document.getElementById("outConsigneeAddr").innerText =
document.getElementById("inConsigneeAddr").value;

document.getElementById("outLR").innerText =
document.getElementById("inLR").value;

let rawDate = document.getElementById("inDate").value;

if(rawDate){

let d = new Date(rawDate);

let day = String(d.getDate()).padStart(2,"0");
let month = String(d.getMonth()+1).padStart(2,"0");
let year = d.getFullYear();

document.getElementById("outDate").innerText =
day + "/" + month + "/" + year;

}

document.getElementById("outFrom").innerText =
document.getElementById("inFrom").value;

document.getElementById("outTo").innerText =
document.getElementById("inTo").value;

document.getElementById("outDesc").innerText =
document.getElementById("inDesc").value;

document.getElementById("outVin").innerText =
document.getElementById("inVin").value;

document.getElementById("outLorry").innerText =
document.getElementById("inLorry").value;

document.getElementById("outGoodsValue").innerText =
document.getElementById("inGoodsValue").value;

document.getElementById("outPkg").innerText =
document.getElementById("inPkg").value;

document.getElementById("outConsignorSign").innerText =
document.getElementById("inConsignorSign").value;

updatePdfName();
}

function updatePdfName(){

const consignor =
document.getElementById("inConsignor").value.trim();

const lr =
document.getElementById("inLR").value.trim();

const from =
document.getElementById("inFrom").value.trim();

const to =
document.getElementById("inTo").value.trim();

const pdfField =
document.getElementById("inPdfName");

if(
consignor &&
lr &&
from &&
to
){

pdfField.value =
`${consignor} LR_${lr} ${from} to ${to}`;

}

}

/* ============================= */
/* ACTION FUNCTIONS */
/* ============================= */

function printBilty() {
  window.print();
}

/* Simple PDF download (browser print save as PDF) */
function downloadPDF() {
  window.print();
}

/* Share PDF (Mobile Supported) */
async function sharePDF() {

  if (!navigator.share) {
    alert("Sharing not supported on this browser");
    return;
  }

  try {
    await navigator.share({
      title: "Harihar Cargo Bilty",
      text: "Bilty Generated",
      url: window.location.href
    });
  } catch (err) {
    console.log(err);
  }

}

/* Reset Inputs + Preview */

function resetBilty() {

  if (!confirm("Reset Bilty Form?")) return;

  document.querySelectorAll(".input-panel input").forEach(i => i.value = "");

  fillBilty();
}




function getBiltyFileName(){

  let name = document.getElementById("inPdfName").value.trim();

  if(name === ""){
    name = "Harihar_Bilty";
  }

  return name.replace(/[^a-z0-9]/gi,"_");
}

function printBilty(){

  window.print();

}

async function downloadBiltyPDF(){

  const bilty = document.querySelector(".page");

  const fileName = getBiltyFileName();

  const canvas = await html2canvas(bilty,{
    scale:2,
    useCORS:true
  });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF("landscape","mm","a4");

  pdf.addImage(imgData,"PNG",0,0,297,210);

  pdf.save(fileName + ".pdf");

}

async function shareBilty(){

  if(!navigator.canShare){
    alert("Sharing not supported on this device");
    return;
  }

  // SAVE BILTY FIRST

let rawDate =
document.getElementById("inDate").value;

let formattedDate = "";

if(rawDate){

let d = new Date(rawDate);

let day =
String(d.getDate()).padStart(2,"0");

let month =
String(d.getMonth()+1).padStart(2,"0");

let year =
d.getFullYear();

formattedDate =
day + "/" + month + "/" + year;

}

const saveData = {

lr:
document.getElementById("inLR").value,

date:formattedDate,

consignor:
document.getElementById("inConsignor").value,

consignorAddr:
document.getElementById("inConsignorAddr").value,

consignee:
document.getElementById("inConsignee").value,

consigneeAddr:
document.getElementById("inConsigneeAddr").value,

from:
document.getElementById("inFrom").value,

to:
document.getElementById("inTo").value,

pkg:
document.getElementById("inPkg").value,

desc:
document.getElementById("inDesc").value,

vin:
document.getElementById("inVin").value,

lorry:
document.getElementById("inLorry").value,

goodsValue:
document.getElementById("inGoodsValue").value,

sign:
document.getElementById("inConsignorSign").value

};

if(searchedLR !== ""){

saveData.action = "update";

saveData.oldLR =
searchedLR;

saveData.newLR =
document.getElementById("inLR").value;

}

const saveResponse =
await fetch(url,{
method:"POST",
body:JSON.stringify(saveData)
});

const saveResult =
await saveResponse.json();

console.log(saveData);
console.log(saveResult);

if(!saveResult.success){

alert("❌ LR No Already Exists");

return;

}

  const bilty = document.querySelector(".page");

  const fileName = getBiltyFileName();

  const canvas = await html2canvas(bilty,{
    scale:2,
    useCORS:true
  });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF("landscape","mm","a4");

  pdf.addImage(imgData,"PNG",0,0,297,210);

  const blob = pdf.output("blob");

  const file = new File([blob], fileName + ".pdf", {
    type:"application/pdf"
  });

  try{

await navigator.share({
files:[file],
title:fileName,
text:"Harihar Cargo Bilty"
});

alert("✅ Bilty Saved & Shared");

await resetBilty();

searchedLR = "";

}catch(err){

console.log(err);

}
}

async function resetBilty(){

document.querySelectorAll(
".input-panel input"
).forEach(input=>{

if(input.id !== "inLR"){
input.value="";
}

});

fillBilty();

const response =
await fetch(
url + "?action=nextLR"
);

const data =
await response.json();

document.getElementById("inLR").value =
data.lr;

fillBilty();

}



window.onload = function(){

fetch(
url + "?action=nextLR"
)
.then(res=>res.json())
.then(data=>{

document.getElementById("inLR").value =
data.lr;

fillBilty();

});

}



async function saveBilty(){

let rawDate =
document.getElementById("inDate").value;

let formattedDate = "";

if(rawDate){

let d = new Date(rawDate);

let day =
String(d.getDate()).padStart(2,"0");

let month =
String(d.getMonth()+1).padStart(2,"0");

let year =
d.getFullYear();

formattedDate =
day + "/" + month + "/" + year;

}

const data = {

lr:
document.getElementById("inLR").value,

date:
formattedDate,

consignor:
document.getElementById("inConsignor").value,

consignorAddr:
document.getElementById("inConsignorAddr").value,

consignee:
document.getElementById("inConsignee").value,

consigneeAddr:
document.getElementById("inConsigneeAddr").value,

from:
document.getElementById("inFrom").value,

to:
document.getElementById("inTo").value,

pkg:
document.getElementById("inPkg").value,

desc:
document.getElementById("inDesc").value,

vin:
document.getElementById("inVin").value,

lorry:
document.getElementById("inLorry").value,

goodsValue:
document.getElementById("inGoodsValue").value,

sign:
document.getElementById("inConsignorSign").value

};

fetch(url,{
method:"POST",
body:JSON.stringify(data)
})
.then(res=>res.json())
.then(data=>{

if(data.success){

alert("✅ Bilty Saved");

}else{

alert("❌ LR No Already Exists");

}

});

}


function searchBilty(){

const lr =
document.getElementById("searchLR").value.trim();

if(lr === ""){

alert("Enter LR No");

return;

}

fetch(
url +
"?action=search&lr=" +
encodeURIComponent(lr)
)
.then(res=>res.json())
.then(data=>{
  console.log(data);

  searchedLR = data.lr;
if(!data.found){

alert("LR Not Found");

return;

}

document.getElementById("inLR").value =
data.lr;

if(data.date){

let d = new Date(data.date);

if(!isNaN(d)){

document.getElementById("inDate").value =
d.toISOString().split("T")[0];

}else{

document.getElementById("inDate").value = "";

}

}else{

document.getElementById("inDate").value = "";

}

document.getElementById("inConsignor").value =
data.consignor;

document.getElementById("inConsignorAddr").value =
data.consignorAddr;

document.getElementById("inConsignee").value =
data.consignee;

document.getElementById("inConsigneeAddr").value =
data.consigneeAddr;

document.getElementById("inFrom").value =
data.from;

document.getElementById("inTo").value =
data.to;

document.getElementById("inPkg").value =
data.pkg;

document.getElementById("inDesc").value =
data.desc;

document.getElementById("inVin").value =
data.vin;

document.getElementById("inLorry").value =
data.lorry;

document.getElementById("inGoodsValue").value =
data.goodsValue;

document.getElementById("inConsignorSign").value =
data.sign;

fillBilty();

alert("✅ Bilty Loaded");

});

}


function convertDateForInput(dateString){

let parts = dateString.split("/");

return `${parts[2]}-${parts[1]}-${parts[0]}`;

}

async function updateBilty(){

if(searchedLR === ""){

alert("Search LR First");

return;

}

let rawDate =
document.getElementById("inDate").value;

let formattedDate = "";

if(rawDate){

let d = new Date(rawDate);

let day =
String(d.getDate()).padStart(2,"0");

let month =
String(d.getMonth()+1).padStart(2,"0");

let year =
d.getFullYear();

formattedDate =
day + "/" + month + "/" + year;

}

const updateData = {

action:"update",

oldLR:searchedLR,

newLR:
document.getElementById("inLR").value,

date:formattedDate,

consignor:
document.getElementById("inConsignor").value,

consignorAddr:
document.getElementById("inConsignorAddr").value,

consignee:
document.getElementById("inConsignee").value,

consigneeAddr:
document.getElementById("inConsigneeAddr").value,

from:
document.getElementById("inFrom").value,

to:
document.getElementById("inTo").value,

pkg:
document.getElementById("inPkg").value,

desc:
document.getElementById("inDesc").value,

vin:
document.getElementById("inVin").value,

lorry:
document.getElementById("inLorry").value,

goodsValue:
document.getElementById("inGoodsValue").value,

sign:
document.getElementById("inConsignorSign").value

};

fetch(url,{
method:"POST",
body:JSON.stringify(updateData)
})
.then(res=>res.json())
.then(data=>{

if(data.success){

alert("✅ Bilty Updated");

}else{

alert("❌ Update Failed");

}

});

}

function reloadPage(){

location.reload();

}