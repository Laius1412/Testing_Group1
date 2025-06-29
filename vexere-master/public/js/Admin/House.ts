import HouseElement from "./HouseEleClass.js";
import toastMsg from "./Toast.js";

type BusHouse = {
  id: number;
  Name: string;
}

class BusHousesInfo {
  public houseMap: { [key: number]: HouseElement };
  constructor() {
    this.houseMap = {};
  }
  public addElement(element: HouseElement) {
    this.houseMap[element.getHouse().id] = element;
  }
  public updateElement(houseId: number, houseName: string) {
    if (this.houseMap[houseId]) {
      this.houseMap[houseId].updateHouseData(houseName);
    }
  }
}

const busHousesInfo = new BusHousesInfo();

async function fetchBusHouse() {
  const houseForm = <HTMLFormElement>document.getElementById("house-display-form");
  const houseList = <HTMLUListElement>document.getElementById("house-display-list");

  if (!houseForm || !houseList) {
    return;
  }
  toastMsg.fetchHouseMsg.showToast();
  console.log("Fetching bus house...");
  const fetchData = await fetch("/admin/api/bushouse");

  try {
    const houses = await fetchData.json();
    console.log(houses);
    if (!Array.isArray(houses)) {
      toastMsg.failedMsg.showToast();
      return null;
    }

    const houseLi: HTMLLIElement[] = [];
    houses.forEach((house) => {
      const newHouse = new HouseElement(house, houseForm);
      busHousesInfo.addElement(newHouse);
      const li = document.createElement("li");
      li.appendChild(newHouse);
      houseLi.push(li);
    })

    houseList.replaceChildren(...houseLi);
    toastMsg.successMsg.showToast();
    return;
  } catch (error) {console.log(error);}
  toastMsg.failedMsg.showToast();
}

async function NewBusHouseClick() {
  const houseForm = <HTMLFormElement>document.getElementById("house-display-form");
  const inputs = houseForm.elements;
  (<HTMLInputElement>inputs.namedItem("house-id")).valueAsNumber = -1;
  (<HTMLInputElement>inputs.namedItem("house-name")).value = "";
}

async function createBusHouse(name: string,phone:string,desc:string) {
  toastMsg.createHouseMsg.showToast();
  const fetchData = await fetch("/admin/api/bushouse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      desc: desc,
      phone: phone
    })
  });
  try {
    const newHouse = await fetchData.json();
    const houseForm = <HTMLFormElement>document.getElementById("house-display-form");
    const houseList = <HTMLUListElement>document.getElementById("house-display-list");
    const newHouseElement = new HouseElement(newHouse, houseForm);
    const li = document.createElement("li");
    li.appendChild(newHouseElement);
    houseList.appendChild(li);
    toastMsg.successMsg.showToast();
    return;
  } catch (error) { console.log(error) }
  toastMsg.failedMsg.showToast();
}

async function updateBusHouse(id: number, name: string, phone: string, desc: string) {
  toastMsg.updateHouseMsg.showToast();
  const fetchData = await fetch("/admin/api/bushouse", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      busHouseId: id,
      name: name,
      desc: desc,
      phone: phone
    })
  });

  try {
    const updatedHouse = await fetchData.json();
    busHousesInfo.updateElement(updatedHouse.id, updatedHouse.Name);
    toastMsg.successMsg.showToast();
    return;
  } catch (error) { console.log(error) }
  toastMsg.failedMsg.showToast();
}

async function BusHouseFormSubmit(event: SubmitEvent) {
  event.preventDefault();
  const form = <HTMLFormElement>event.target;
  if (!form) {
    return;
  }

  const id = (<HTMLInputElement>form.elements.namedItem("house-id")).valueAsNumber;
  const name = (<HTMLInputElement>form.elements.namedItem("house-name")).value;
  const desc = (<HTMLInputElement>form.elements.namedItem("desc")).value;
  const phone = (<HTMLInputElement>form.elements.namedItem("phone")).value;

  if (isNaN(id) || id < 0) {
    const data = await createBusHouse(name,phone,desc);
    return;
  }

  await updateBusHouse(id, name, phone, desc);
}

document.getElementById("house-refresh-btn")?.addEventListener("click", fetchBusHouse);
document.getElementById("house-add-btn")?.addEventListener("click", NewBusHouseClick);
document.getElementById("house-display-form")?.addEventListener("submit", BusHouseFormSubmit);