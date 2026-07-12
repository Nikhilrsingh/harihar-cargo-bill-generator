const ids=["transport","packing","loading","unloading","storage","other"];
ids.forEach(id=>{
document.getElementById(id).addEventListener("input",update);
});

document.getElementById("company").addEventListener("input",()=>companyView.innerText=company.value);
document.getElementById("from").addEventListener("input",()=>fromView.innerText=from.value);
document.getElementById("to").addEventListener("input",()=>toView.innerText=to.value);
document.getElementById("date").addEventListener("input",()=>{
let d=new Date(date.value);
dateView.innerText=d.toLocaleDateString("en-GB");
});

document.getElementById("quantity").addEventListener("input",()=>{
quantityView.innerText=quantity.value;
});

function update(){
let t1=+transport.value||0;
let t2=+packing.value||0;
let t3=+loading.value||0;
let t4=+unloading.value||0;
let t5=+storage.value||0;
let t6=+other.value||0;

document.getElementById("t1").innerText=t1||"-";
document.getElementById("t2").innerText=t2||"-";
document.getElementById("t3").innerText=t3||"-";
document.getElementById("t4").innerText=t4||"-";
document.getElementById("t5").innerText=t5||"-";
document.getElementById("t6").innerText=t6||"-";

let total=t1+t2+t3+t4+t5+t6;
document.getElementById("total").innerText=total;
}

const { jsPDF } = window.jspdf;

/* ===== ENABLE DESKTOP MODE ===== */
function enablePDFMode(){
document.body.classList.add("pdf-mode");
}

function disablePDFMode(){
document.body.classList.remove("pdf-mode");
}

/* ===== PRINT ===== */
function printQuotation(){

enablePDFMode();

setTimeout(()=>{
window.print();
disablePDFMode();
},500);

}

/* ===== DOWNLOAD PDF ===== */
async function downloadPDF(){

const { jsPDF } = window.jspdf;

let element = document.querySelector(".page");

/* force desktop layout */
document.body.classList.add("pdf-mode");

const canvas = await html2canvas(element,{
scale:3,
useCORS:true,
allowTaint:true
});

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF('p','mm','a4');

const imgWidth = 210;
const imgHeight = canvas.height * imgWidth / canvas.width;

pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight);

/* FORCE DIRECT DOWNLOAD */
let fileName = document.getElementById("pdfName")?.value || "Quotation";

pdf.save(fileName + ".pdf");

document.body.classList.remove("pdf-mode");
}

/* ===== SHARE ===== */
function shareWhatsApp(){

enablePDFMode();

setTimeout(()=>{

let element=document.querySelector(".page");

html2canvas(element,{scale:3,useCORS:true}).then(canvas=>{

let imgData=canvas.toDataURL("image/png");

let pdf=new jsPDF('p','mm','a4');
let imgWidth=210;
let imgHeight=(canvas.height * imgWidth)/canvas.width;

pdf.addImage(imgData,'PNG',0,0,imgWidth,imgHeight);

let blob=pdf.output("blob");
let file=new File([blob],"Quotation.pdf",{type:"application/pdf"});

if(navigator.share){
navigator.share({
title:"Quotation",
text:"Transport quotation",
files:[file]
});
}else{
alert("Sharing not supported");
}

disablePDFMode();

});

},400);

}

function resetForm(){
location.reload();
}

update();