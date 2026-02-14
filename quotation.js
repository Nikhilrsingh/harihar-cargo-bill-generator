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

async function downloadQuotationPDF(){

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

  // 🔥 DIRECT DOWNLOAD (mobile + desktop same)
  pdf.save(fileName + ".pdf");
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

  const blob = pdf.output("blob");
  const file = new File([blob], fileName+".pdf", {type:"application/pdf"});

  // 🔥 MOBILE SHARE LIKE DESKTOP
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: fileName,
      files: [file]
    });
  } else {
    alert("Open in mobile Chrome for share");
  }
}



function printQuotation(){

  const printContent = document.querySelector(".page").outerHTML;

  const win = window.open('', '', 'width=900,height=900');

  win.document.write(`
    <html>
    <head>
    <title>Print</title>
    <style>
      body{margin:0;padding:0;background:white;}
      .page{
        width:210mm;
        min-height:297mm;
        margin:auto;
      }
    </style>
    </head>
    <body>
      ${printContent}
    </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
  win.close();
}

function resetForm(){
location.reload();
}

update();