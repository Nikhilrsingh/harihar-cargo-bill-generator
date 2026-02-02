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


// submit 

function submitBill(){

let billNo = billno.value.trim();

if(!billNo,!date.value,!party.value,!from.value,!to.value,!amount.value){
  alert("Please enter all fields");
  return;
}

// Check duplicate submit
let submittedBills = JSON.parse(localStorage.getItem("submittedBills")) || [];

if(submittedBills.includes(billNo)){
  alert("This Bill Number is already submitted!");
  return;
}

// Prepare data row
let row = {
  Date: formatDateDMY(date.value),
  BillNo: billNo,
  PartyName: party.value,
  From: from.value,
  To: to.value,
  Amount: amount.value
};

// Save to Excel
saveToExcel(row);

// Lock bill number
submittedBills.push(billNo);
localStorage.setItem("submittedBills", JSON.stringify(submittedBills));

alert("Bill submitted successfully ✅");

}

// Excel

async function saveToExcel(newRow){

// Ask file location first time only
if(!excelFileHandle){

excelFileHandle = await window.showSaveFilePicker({
  suggestedName: "BillRecords.xlsx",
  types: [{
    description: "Excel File",
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    }
  }]
});

}

// Load previous data (from memory)
let existingData = JSON.parse(localStorage.getItem("excelData")) || [];

// Add new row
existingData.push(newRow);

// Save memory copy
localStorage.setItem("excelData", JSON.stringify(existingData));

// Create Excel
let worksheet = XLSX.utils.json_to_sheet(existingData);
let workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");

// Convert to buffer
let excelBuffer = XLSX.write(workbook, {bookType:"xlsx", type:"array"});

// Write to SAME file
let writable = await excelFileHandle.createWritable();
await writable.write(excelBuffer);
await writable.close();

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