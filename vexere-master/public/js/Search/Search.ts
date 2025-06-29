const results = <NodeListOf<HTMLFormElement>> document.querySelectorAll(".js-ticket-form");

results.forEach(form=>{
  const infoTab = <HTMLDivElement> form.querySelector(".vexere-ticket-submit-info");
  const submitBtn = <HTMLButtonElement> form.querySelector(".js-vexere-info-action > button");


  submitBtn.addEventListener("click",()=>{
    const currDisplay = infoTab.style.display;
    infoTab.style.display = (currDisplay === "block") ? "none" : "block";
  })
  console.log(infoTab,submitBtn);
})