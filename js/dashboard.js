const currentDate=document.getElementById("currentDate");

const options={
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
};

currentDate.textContent=new Date().toLocaleDateString("en-IN",options);