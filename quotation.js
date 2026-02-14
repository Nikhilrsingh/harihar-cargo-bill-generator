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

function printQuotation(){
window.print();
}

function downloadQuotationPDF(){

  const element = document.querySelector(".page");

  let fileName = "Quotation";
  const nameInput = document.getElementById("pdfName");
  if(nameInput && nameInput.value.trim() !== ""){
    fileName = nameInput.value.trim();
  }

  html2canvas(element,{
    scale:3,
    useCORS:true,
    scrollY: -window.scrollY
  }).then(canvas=>{

    const imgData = canvas.toDataURL("image/jpeg",1.0);
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p","mm","a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let position = 0;

    // 🔥 If height exceeds page → fit correctly
    if(imgHeight > pageHeight){
      pdf.addImage(imgData,"JPEG",0,0,pageWidth,pageHeight);
    }else{
      pdf.addImage(imgData,"JPEG",0,0,imgWidth,imgHeight);
    }

    pdf.save(fileName + ".pdf");
  });
}

async function shareQuotation(){

  const element = document.querySelector(".page");

  let fileName = "Quotation";
  const nameInput = document.getElementById("pdfName");
  if(nameInput && nameInput.value.trim() !== ""){
    fileName = nameInput.value.trim();
  }

  const canvas = await html2canvas(element,{
    scale:3,
    useCORS:true,
    scrollY:-window.scrollY
  });

  const imgData = canvas.toDataURL("image/jpeg",1.0);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p","mm","a4");

  const pageWidth = 210;
  const imgWidth = pageWidth;
  const imgHeight = canvas.height * imgWidth / canvas.width;

  pdf.addImage(imgData,"JPEG",0,0,imgWidth,imgHeight);

  // convert to blob
  const blob = pdf.output("blob");
  const file = new File([blob], fileName+".pdf", {type:"application/pdf"});

  // 🔥 MOBILE SHARE SUPPORT CHECK
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: fileName,
      text: "Quotation PDF",
      files: [file]
    });
  } 
  else {
    alert("Sharing not supported on this device.\nUse mobile Chrome.");
  }
}

function resetForm(){
location.reload();
}

update();