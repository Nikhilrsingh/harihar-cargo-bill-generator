let excelFileHandle = null;

let historyStack=[];

// LIVE UPDATE

document.querySelectorAll(".form input").forEach(input=>{
input.addEventListener("input",()=>{
saveState();
updateBill();
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

let fileName = prompt("Enter PDF name:", "harihar-bill");

if(!fileName) return;

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

  let fileName = prompt("Enter PDF name:", "harihar-bill");
  if(!fileName) return;

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

let fileName = prompt("Enter PDF file name:", "harihar-bill");

if(!fileName) return; // cancel if empty

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

window.onload = function(){

document.querySelectorAll(".tools select").forEach(select=>{
  applySize(select);
});

document.querySelectorAll(".tools input[type=color]").forEach(color=>{
  applyColor(color);
});

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

let url = "https://script.google.com/macros/s/AKfycbyPMOTKkLtBln0M4YexDvczafMHNlnuUrp81ExMOqE1QIA1LKPzpS4RKyFZtSSjiMhuIw/exec";

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