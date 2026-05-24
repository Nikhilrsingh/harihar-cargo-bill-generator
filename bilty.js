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

  }catch(err){
    console.log(err);
  }
}

function resetBilty(){

  document.querySelectorAll(".input-panel input").forEach(input=>{
    input.value="";
  });

  fillBilty();
}

