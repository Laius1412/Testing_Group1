
function mainAdmin() {
  const selectUL = document.getElementById("admin-tab-select");
  const displayUL = document.getElementById("admin-tab-display");
  if (!selectUL || !displayUL) {
    return;
  }
  
  const selectTabs = <NodeListOf<HTMLLIElement>>selectUL.querySelectorAll("li:not(.sub-tab-select > li)");
  console.log(selectTabs);

  const displayTab = <NodeListOf<HTMLLIElement>>displayUL.querySelectorAll(".js-tab-display");
  const subUL = <NodeListOf<HTMLUListElement>> selectUL.querySelectorAll(".sub-tab-select");

  selectTabs.forEach((select, selectId) => {
    const subList = <HTMLUListElement> select.querySelector(".sub-tab-select");

    select.addEventListener("click", (event) => {
      subUL.forEach((sub)=>{sub.style.display = "none";});
      try {
        subList.style.display = "block";
      } catch (error) {
        
      }

      displayTab.forEach((display, displayId) => {
        display.style.display = (selectId === displayId) ? "block" : "none";
      })
    })
  })

}

mainAdmin();
