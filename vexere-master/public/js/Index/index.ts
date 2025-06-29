function FilterList(msg: string, wrapper: HTMLDivElement) {
  const liArr = <NodeListOf<HTMLLIElement>>wrapper.querySelectorAll("ul li");
  liArr.forEach((li) => {
    const liText = li.innerText.toLowerCase();
    const isIncluded = (liText.includes(msg.toLowerCase()) || msg === "");
    li.style.display = (isIncluded) ? "block" : "none";
  });

  
}

function main() {
  const today = new Date();
  const nextDay = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  const dateInput = <HTMLInputElement>document.getElementById("start-date-input");
  dateInput.setAttribute("min", nextDay);


  const searchTable = document.querySelector(".search_bar");

  const searchWrapper = [
    {
      input: <HTMLInputElement>searchTable?.querySelector("#start-place"),
      suggest: <HTMLDivElement>searchTable?.querySelector("#auto-complete-start")
    },
    {
      input: <HTMLInputElement>searchTable?.querySelector("#end-place"),
      suggest: <HTMLInputElement>searchTable?.querySelector("#auto-complete-end")
    }
  ]

  searchWrapper.forEach(({ input, suggest }) => {
    if (!input || !suggest) { return; }

    console.log(input);
    input.addEventListener("focusin", () => {
      suggest.style.display = "block";
    })

    // input.addEventListener("focusout", () => {
    //   suggest.style.display = "none";
    // })

    const liArr = suggest.querySelectorAll("ul li");
    liArr.forEach((li) => {
      li.addEventListener("click", () => {
        input.value = (li as HTMLLIElement).innerText;
        suggest.style.display = "none";
      })
    });


    input.addEventListener("input", () => {
      console.log(input.value);
      FilterList(input.value, suggest);
    })
  });
}

main();