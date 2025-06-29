import { it } from "node:test";

// main view event Handler

const listItems = document.querySelectorAll(".list-item");
const displayItem = document.querySelectorAll(".sidebar-display-list");
const sidebarNavigation = <NodeListOf<HTMLLIElement>>(
  document.querySelectorAll(".sidebar-navigation > ul .list-item")
);

sidebarNavigation?.forEach((element) => {
  element.addEventListener("click", function () {
    sidebarNavigation.forEach((sidebarNavigation) => {
      sidebarNavigation.classList.remove("active-tab");
    });
    this.classList.add("active-tab");
  });
});

class SidebarDisplayListHandler {
  private displayList = <NodeListOf<HTMLDivElement>>(
    document.querySelectorAll(".sidebar-display > div")
  );
  constructor() {}
  setDisplay(index: number) {
    this.displayList.forEach((item, id) => {
      if (id === index) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
}

const sidebarDisplayListHandler = new SidebarDisplayListHandler();

sidebarNavigation?.forEach((item, index) => {
  item.onclick = (ev) => {
    sidebarDisplayListHandler.setDisplay(index);
  };
});

// History Ticket view event Handler
