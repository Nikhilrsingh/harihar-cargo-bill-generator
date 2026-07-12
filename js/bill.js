window.addEventListener("beforeunload", function (e) {

  const hasData =
    party.value ||
    billno.value ||
    amount.value;

  if (hasData) {

    e.preventDefault();
    e.returnValue = "";

  }

});


let searchedBill = "";

let excelFileHandle = null;

let historyStack = [];

let isEditMode = false;

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbxvnEGpw4fwJNRq9SBJMo-S_5sizSDSUevprradc6waUQqoLR_HN8Uwrm45eBlLTncj/exec";

// LIVE UPDATE

document.querySelectorAll(".form input").forEach(input=>{
input.addEventListener("input",()=>{
saveState();
updateBill();
updatePdfName();
});
});

function updateBill(){

pParty.innerText=party.value;
pAddress.innerText=address.value;
pBill.innerText=billno.value;
pDate.innerText = formatDateDMY(date.value);
pDatee.innerText = formatDateDMY(Datee.value);
pLR.innerText=lrno.value;
pInvoice.innerText=invoice.value;
pVehicle.innerText=vehicle.value;
pFrom.innerText=from.value;
pTo.innerText=to.value;

pAmount.innerText=amount.value;
pTotal.innerText=amount.value;
pWords.innerText=numberToWords(amount.value);

}

// SAVE STATE

function saveState(){
let data={};
document.querySelectorAll(".form input").forEach(i=>{
data[i.id]=i.value;
});
historyStack.push(data);
}

// RESET

function resetData(){

document.querySelectorAll(".form input").forEach(i=>i.value="");
updateBill();

}


// Share

async function sharePDFWhatsApp(){

let bill = document.getElementById("bill");

// Show loading indicator (optional)
console.log("Generating PDF...");

let canvas = await html2canvas(bill, { scale: 2 });

const { jsPDF } = window.jspdf;

let pdf = new jsPDF("p", "mm", "a4");

let imgData = canvas.toDataURL("image/jpeg", 0.9);

pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

let blob = pdf.output("blob");

let file = new File([blob], fileName + ".pdf", {
  type: "application/pdf"
});

// 🚀 UNIVERSAL SHARE (NO canShare CHECK)

if(navigator.share){

try{

await navigator.share({
  title: "Harihar Bill",
  files: [file]
});

}catch(err){
console.log("Share cancelled or failed");
}

}else{

alert("Sharing not supported on this browser");

}

}

// WhatsApp

async function shareToWhatsApp(){

  let fileName =
document
.getElementById("pdfFileName")
.value
.trim();

if(!fileName){

fileName = "Harihar-Bill";

}

  const bill = document.getElementById("bill");

  try{

    // Create PDF fast
    const canvas = await html2canvas(bill, { scale: 1.5 });

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const imgData = canvas.toDataURL("image/jpeg", 0.85);

    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

    const pdfBlob = pdf.output("blob");

    const pdfFile = new File(
      [pdfBlob],
      fileName + ".pdf",
      { type: "application/pdf" }
    );

    // WhatsApp-compatible native share
    if (navigator.share) {

      await navigator.share({
        title: "Invoice PDF",
        files: [pdfFile]
      });

    } else {

      alert("WhatsApp file sharing not supported on this browser");

    }

  }catch(err){

    alert("Sharing failed or cancelled");

  }

}


// PDF DOWNLOAD FIX

function downloadPDF(){

  let fileName =
document
.getElementById("pdfFileName")
.value
.trim();

if(!fileName){

fileName = "Harihar-Bill";

}

html2canvas(document.querySelector("#bill")).then(canvas=>{

const { jsPDF } = window.jspdf;

let pdf = new jsPDF("p","mm","a4");

let img = canvas.toDataURL("image/png");

pdf.addImage(img,"PNG",0,0,210,297);
pdf.save(fileName + ".pdf");

});

}

// DOC DOWNLOAD FIX


// NUMBER TO WORDS

function numberToWords(num){

num=parseInt(num);
if(isNaN(num)) return "";

let ones=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
let tens=["","Ten","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
let teens=["Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];

function part(n){

let s="";
if(n>=100){
s+=ones[Math.floor(n/100)]+" Hundred ";
n%=100;
}

if(n>=11 && n<=19){
s+=teens[n-11]+" ";
}
else{
if(n>=10){
s+=tens[Math.floor(n/10)]+" ";
n%=10;
}
if(n>0) s+=ones[n]+" ";
}

return s;
}

let res="";

if(num>=10000000){res+=part(Math.floor(num/10000000))+"Crore "; num%=10000000;}
if(num>=100000){res+=part(Math.floor(num/100000))+"Lakh "; num%=100000;}
if(num>=1000){res+=part(Math.floor(num/1000))+"Thousand "; num%=1000;}
if(num>0){res+=part(num);}

return res.trim()+" Only";

}

/* ================= SIZE CONTROL ================= */

function applySize(el){

// Find input inside same input-box
let inputBox = el.closest(".input-box");
let input = inputBox.querySelector("input");

// Target preview span
let targetId = input.getAttribute("data-target");

// Selected size
let size = el.value;

// Apply size to main field
document.getElementById(targetId).style.fontSize = size;

// AUTO SYNC FOR AMOUNT
if(targetId === "pAmount"){

  document.getElementById("pTotal").style.fontSize = size;
  document.getElementById("pWords").style.fontSize = size;

}

}


/* ================= COLOR CONTROL ================= */

function applyColor(el){

// Find input inside same input-box
let inputBox = el.closest(".input-box");
let input = inputBox.querySelector("input");

// Target preview span
let targetId = input.getAttribute("data-target");

// Selected color
let color = el.value;

// Apply color to main field
document.getElementById(targetId).style.color = color;

// AUTO SYNC FOR AMOUNT
if(targetId === "pAmount"){

  document.getElementById("pTotal").style.color = color;
  document.getElementById("pWords").style.color = color;

}

}

function formatDateDMY(dateStr){

if(!dateStr) return "";

let parts = dateStr.split("-");
return parts[2] + "/" + parts[1] + "/" + parts[0];

}

function exportAction(callback) {

  // lock scrolling
  document.body.style.overflow = "hidden";

  // enable export layout
  document.body.classList.add("export-mode");

  // wait for layout reflow
  setTimeout(() => {

    callback();

    // restore UI
    setTimeout(() => {
      document.body.classList.remove("export-mode");
      document.body.style.overflow = "";
    }, 1500);

  }, 400);
}

window.onload = async function(){

document.querySelectorAll(".tools select").forEach(select=>{
  applySize(select);
});

document.querySelectorAll(".tools input[type=color]").forEach(color=>{
  applyColor(color);
});

try{

const response =
await fetch(
"https://script.google.com/macros/s/AKfycbxvnEGpw4fwJNRq9SBJMo-S_5sizSDSUevprradc6waUQqoLR_HN8Uwrm45eBlLTncj/exec?action=nextBill"
);

const data =
await response.json();

document.getElementById("billno").value =
data.bill;

updateBill();

loadRecentBills();

}catch(err){

console.log(err);

}

};


// excel sheet function

function saveBillToSheet(){
  
let rawDate = document.getElementById("date").value;
let formattedDate = "";

if(rawDate){
let d = new Date(rawDate);
let day = String(d.getDate()).padStart(2,"0");
let month = String(d.getMonth()+1).padStart(2,"0");
let year = d.getFullYear();
formattedDate = day + "/" + month + "/" + year;
}

let data = {
billdate: formattedDate,
billno: document.getElementById("billno").value,
party: document.getElementById("party").value,
from: document.getElementById("from").value,
to: document.getElementById("to").value,
vehicle: document.getElementById("vehicle").value,
lr: document.getElementById("lrno").value,
invoice: document.getElementById("invoice").value,
amount: document.getElementById("amount").value
};

let url = "https://script.google.com/macros/s/AKfycbxvnEGpw4fwJNRq9SBJMo-S_5sizSDSUevprradc6waUQqoLR_HN8Uwrm45eBlLTncj/exec";

fetch(url,{
method:"POST",
mode:"no-cors",
body: JSON.stringify(data)
});

// simple mobile-safe message
setTimeout(()=>{
alert("✅ Saved to Excel");
},800);

}


document
.getElementById("searchBtn")
.addEventListener(
"click",
searchBill
);

async function searchBill(){

const billNo =
document
.getElementById("searchBill")
.value
.trim();

if(!billNo){

alert("Enter Bill Number");

return;

}

try{

const response =
await fetch(
SCRIPT_URL +
"?action=searchBill&billno=" +
encodeURIComponent(billNo)
);

const data =
await response.json();

if(!data){

alert("Bill Not Found");

return;

}

isEditMode = true;

billno.value = data.billno || "";
party.value = data.party || "";
address.value = data.address || "";

lrno.value = data.lr || "";
invoice.value = data.invoice || "";
vehicle.value = data.vehicle || "";

from.value = data.from || "";
to.value = data.to || "";
amount.value = data.amount || "";

updateBill();
updatePdfName();

alert("Bill Loaded");

}catch(err){

console.error(err);

alert("Search Failed");

}

}


document
.getElementById("saveShareBtn")
.addEventListener(
"click",
saveAndShare
);

async function saveAndShare(){

try{

if(isEditMode){

await updateExistingBill();

}else{

await saveNewBill();

}

setTimeout(async ()=>{

await sharePDFWhatsApp();

},100);

}catch(err){

console.error(err);

alert("Error");

}

}


async function saveNewBill(){

let data = {

billno: billno.value,

billdate: date.value,

party: party.value,

address: address.value,

lr: lrno.value,

lrdate: Datee.value,

invoice: invoice.value,

vehicle: vehicle.value,

from: from.value,

to: to.value,

amount: amount.value

};

const response =
await fetch(
SCRIPT_URL,
{
method:"POST",
body:JSON.stringify(data)
}
);

const result =
await response.json();

if(result.status==="duplicate"){

alert("Duplicate Bill Number");

return;

}

alert("Saved Successfully");

}


async function updateExistingBill(){

let data = {

action:"update",

billno: billno.value,

billdate: date.value,

party: party.value,

address: address.value,

lr: lrno.value,

lrdate: Datee.value,

invoice: invoice.value,

vehicle: vehicle.value,

from: from.value,

to: to.value,

amount: amount.value

};

await fetch(
SCRIPT_URL,
{
method:"POST",
body:JSON.stringify(data)
}
);

alert("Bill Updated");

}


async function loadRecentBills(){

try{

const response =
await fetch(
SCRIPT_URL +
"?action=recentBills"
);

const data =
await response.json();

const box =
document.getElementById(
"historyList"
);

box.innerHTML = "";

data.forEach(row=>{

const div =
document.createElement("div");

div.className =
"history-item";

div.innerHTML =
`
Bill: ${row[1]}
&nbsp;&nbsp;
${row[2]}
&nbsp;&nbsp;
₹${row[8]}
`;

div.onclick = ()=>{

document
.getElementById(
"searchBill"
)
.value = row[1];

searchBill();

};

box.appendChild(div);

});

}catch(err){

console.log(err);

}

}


function updatePdfName(){

const bill =
billno.value.trim();

const partyName =
party.value.trim();

const fromPlace =
from.value.trim();

const toPlace =
to.value.trim();

const clean = (text) =>
text
.replace(/[^a-zA-Z0-9 ]/g,"")
.replace(/\s+/g,"-");

document
.getElementById("pdfFileName")
.value =
`Bill No:-${bill}_${clean(partyName)}_${clean(fromPlace)}_To_${clean(toPlace)}`;

}


function reloadPage(){
  
location.reload();

}