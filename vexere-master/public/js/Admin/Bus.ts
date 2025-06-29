import BusElement from "./BusEle.js";
import toastMsg from "./Toast.js";

interface GetBusesRespond {
  id: number,
  plate: string
  seatAmount: number
  type: number
  busHouse: number,
  BusHouse: {
    Name: string;
  }
}

type Bus = {
  id: number
  plate: string
  seatAmount: number
  type: number
  busHouse: number
}
class BusList {
  public busList: BusElement[] = [];
  constructor() { }
  public updateBus(bus: Bus) {
    for (let index = 0; index < this.busList.length; index++) {
      if (bus.id === this.busList[index].getBusId()) {
        this.busList[index].updateBus({ id: bus.id, plate: bus.plate, seatAmount: bus.seatAmount},houseMap[bus.busHouse]);
        break;
      }
    }
  }

  public addBusElement(ele: BusElement) {
    this.busList.push(ele);
  }

  public clearElement() {
    this.busList = [];
  }
}

const houseMap: { [key: number]: string } = {}
const busList = new BusList();


async function fetchBuses() {
  const list = <HTMLUListElement>document.getElementById("bus-display-list");
  const form = <HTMLFormElement>document.getElementById("bus-display-form");
  await fetchBusHouses();
  const fetchData = await fetch("/admin/api/bus");

  toastMsg.fetchBusMsg.showToast();

  try {
    const buses: GetBusesRespond[] = await fetchData.json();
    busList.clearElement();

    const liArr: HTMLLIElement[] = [];

    buses.forEach(bus => {
      const newEle = new BusElement(bus.id, bus.plate, bus.seatAmount, bus.type, bus.busHouse, houseMap[bus.busHouse], form);
      busList.addBusElement(newEle);
      const li = document.createElement("li");
      li.appendChild(newEle);
      liArr.push(li)
    })

    list.replaceChildren(...liArr);
    console.log(buses);
    toastMsg.successMsg.showToast();
    return;
  } catch (error) { console.log(error) }
  toastMsg.failedMsg.showToast();
}

async function addBus(plate: string, busType: number, seats: number, house: number, form: HTMLFormElement) {
  const ul = <HTMLUListElement>document.getElementById("bus-display-list");
  toastMsg.createBusMsg.showToast();
  const fetchData = await fetch("/admin/api/bus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plate: plate,
      seatAmount: seats,
      type: house,
      busHouse: house
    })
  });

  try {
    const newBus: Bus = await fetchData.json();
    if (newBus) {
      const busEle = new BusElement(newBus.id, newBus.plate, newBus.seatAmount, newBus.type, newBus.busHouse, houseMap[newBus.busHouse], form);
      const li = document.createElement("li");
      li.appendChild(busEle);
      ul.appendChild(li);
      toastMsg.successMsg.showToast();
      return;
    }
  } catch (error) { console.log(error) }
  toastMsg.failedMsg.showToast();
}

async function updateBus(id: number, plate: string, type: number, seats: number,house:number) {
  toastMsg.updateBusMsg.showToast();
  const fetchData = await fetch("/admin/api/bus", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      busId: id,
      plate: plate,
      seatAmount: seats,
      type: type,
      house: house
    })
  })

  try {
    const updateBus: Bus = await fetchData.json();
    if (updateBus) {
      busList.updateBus(updateBus);
      toastMsg.successMsg.showToast();
      return;
    }
  } catch (error) { console.log(error) }
  toastMsg.failedMsg.showToast();
}

async function handleBusForm(e: SubmitEvent) {
  const form = <HTMLFormElement>document.getElementById("bus-display-form");
  e.preventDefault();
  const inputs = form.elements;
  const id = (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber;
  const plate = (<HTMLInputElement>inputs.namedItem("plate")).value;
  const busType = (<HTMLInputElement>inputs.namedItem("busType")).valueAsNumber;
  const seats = (<HTMLInputElement>inputs.namedItem("seats")).valueAsNumber;
  const house = Number.parseInt((<HTMLSelectElement>inputs.namedItem("house")).value);

  if (!plate || isNaN(busType) || isNaN(id)) {
    return;
  }

  if (id < 0) {
    addBus(plate, busType, seats, house, form);
    return;
  }
  updateBus(id, plate, busType, seats,house);
}

async function fetchBusHouses() {
  const fetchData = await fetch("/admin/api/bushouse");
  try {
    const houses: { id: number, Name: string }[] = await fetchData.json();
    console.log(houses);
    const select = (<HTMLSelectElement>document.getElementById("bus-house-select"));
    const houseArray: (HTMLOptionElement[]) = [];
    houses.forEach(house => {
      houseMap[house.id] = house.Name;
      const opt = document.createElement("option");
      opt.value = house.id.toString();
      opt.innerText = house.Name
      houseArray.push(opt);
    })
    select.replaceChildren(...houseArray);
  } catch (error) {

  }
}

async function addBusBtnHandler() {
  const form = <HTMLFormElement>document.getElementById("bus-display-form");
  const inputs = form.elements;
  (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber = -1;
  (<HTMLInputElement>inputs.namedItem("plate")).value = "";
  (<HTMLInputElement>inputs.namedItem("busType")).valueAsNumber = 1;
  (<HTMLInputElement>inputs.namedItem("seats")).valueAsNumber = 0;
  (<HTMLSelectElement>inputs.namedItem("house")).value = "";
}

fetchBusHouses();
document.getElementById("bus-refresh-btn")?.addEventListener("click", fetchBuses);
document.getElementById("bus-display-form")?.addEventListener("submit", handleBusForm);
document.getElementById("bus-add-btn")?.addEventListener("click", addBusBtnHandler);