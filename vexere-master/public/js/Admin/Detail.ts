import DetailElement from "./DetailEle.js";
import toastMsg from "./Toast.js";

type RouteDetail = {
  id: number,
  busId: number,
  price: number,
  endTime: Date,
  startTime: Date
  remainSeat: number
  routeId: number,
  Route: {
    startLocId: number;
    endLocId: number;
  }
}

class DetailInfo {
  public elements: DetailElement[];
  constructor() {
    this.elements = [];
  }
  public update(detail:number,data:RouteDetail,start:string,end:string){
    for (let index = 0; index < this.elements.length; index++) {
      if(this.elements[index].getDetailId() === detail){
        console.log(data,start,end);
        this.elements[index].setData(data,start,end);
        break;
      }
    }
  }
}

const detailInfo = new DetailInfo();

function SwitchGETFrom() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  detailForm.method = "GET";

  const timeLabel = <NodeListOf<HTMLSpanElement>>detailForm.querySelectorAll(".js-time-label > span");
  timeLabel[0].innerText = "Ngày đi sớm nhất";
  timeLabel[1].innerText = "Ngày đi trễ nhất";

  (<HTMLInputElement>detailForm.elements.namedItem("time1")).type = "date";
  (<HTMLInputElement>detailForm.elements.namedItem("time2")).type = "date";
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("busId")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("seat")).required = false;
  (<HTMLInputElement>detailForm.elements.namedItem("price")).required = false;

  const postLabel = <NodeListOf<HTMLLabelElement>>detailForm.querySelectorAll(".js-post-label");
  console.log(postLabel);
  postLabel.forEach(lbl => { lbl.style.display = "none" });
}

function SwitchPOSTForm() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  detailForm.method = "POST";

  const timeLabel = <NodeListOf<HTMLSpanElement>>detailForm.querySelectorAll(".js-time-label > span");
  timeLabel[0].innerText = "Giờ đi";
  timeLabel[1].innerText = "Giờ đến";

  (<HTMLInputElement>detailForm.elements.namedItem("time1")).type = "datetime-local";
  (<HTMLInputElement>detailForm.elements.namedItem("time2")).type = "datetime-local";
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).valueAsNumber = -1;
  (<HTMLInputElement>detailForm.elements.namedItem("detailId")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("busId")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("busId")).readOnly = false;
  (<HTMLInputElement>detailForm.elements.namedItem("seat")).required = true;
  (<HTMLInputElement>detailForm.elements.namedItem("price")).required = true;

  const postLabel = <NodeListOf<HTMLLabelElement>>detailForm.querySelectorAll(".js-post-label");
  postLabel.forEach(lbl => { lbl.style.display = "grid" });
}

function getFormData() {
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  const inputs = detailForm.elements;
  const nameIndex = (<HTMLSelectElement>inputs.namedItem("from-location")).selectedIndex;
  const toIndex = (<HTMLSelectElement>inputs.namedItem("to-location")).selectedIndex;
  const data = {
    time1: (<HTMLInputElement>inputs.namedItem("time1")).valueAsDate,
    time2: (<HTMLInputElement>inputs.namedItem("time2")).valueAsDate,
    detailId: (<HTMLInputElement>inputs.namedItem("detailId")).valueAsNumber,
    busId: (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber,
    fromId: Number.parseInt((<HTMLSelectElement>inputs.namedItem("from-location")).value),
    toId: Number.parseInt((<HTMLSelectElement>inputs.namedItem("to-location")).value),
    seat: (<HTMLInputElement>detailForm.elements.namedItem("seat")).valueAsNumber,
    price: (<HTMLInputElement>detailForm.elements.namedItem("price")).valueAsNumber,
    fromName: (<HTMLSelectElement>inputs.namedItem("from-location")).options[nameIndex].text,
    toName: (<HTMLSelectElement>inputs.namedItem("to-location")).options[toIndex].text,
  }
  return data;
}

async function fetchDetail() {
  toastMsg.fetchDetailMsg.showToast();

  const data = getFormData();
  const fetchData = await fetch(`/admin/api/route_detail?fromId=${data.fromId}&toId=${data.toId}&time1=${data.time1}&time2=${data.time2}`);
  const routeUL = <HTMLUListElement>document.getElementById("route-display-list");
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");

  try {
    const details: RouteDetail[] = await fetchData.json();
    console.log(details);
    if (detailInfo) {
      const liArr: HTMLLIElement[] = [];
      details.forEach((det) => {
        const newElement = new DetailElement(det, data.fromName, data.toName, detailForm);
        detailInfo.elements.push(newElement);
        const li = document.createElement("li");
        li.appendChild(newElement);
        liArr.push(li);
      })
      routeUL.replaceChildren(...liArr);
      toastMsg.successMsg.showToast();
      return;
    }
  } catch (error) {
    console.log(error);
  }
  toastMsg.failedMsg.showToast();
}

async function createDetail() {
  toastMsg.createDetailMsg.showToast();

  const routeUL = <HTMLUListElement>document.getElementById("route-display-list");
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  const data = getFormData();
  const fetchData = await fetch("/admin/api/route_detail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromId: data.fromId,
      toId: data.toId,
      start: data.time1,
      end: data.time2,
      seats: data.seat,
      price: data.price,
      busId: data.busId,
    })
  })
  try {
    const newRouteDetail: RouteDetail = await fetchData.json();
    if (newRouteDetail) {
      const newElement = new DetailElement(newRouteDetail, data.fromName, data.toName, detailForm);
      detailInfo.elements.push(newElement);
      const li = document.createElement("li");
      li.appendChild(newElement);
      routeUL.appendChild(li);
      toastMsg.successMsg.showToast();
      return;
    }
  } catch (error) { console.log(error); }
  toastMsg.failedMsg.showToast();
}

async function updateDetail() {
  toastMsg.updateDetailMsg.showToast();

  const data = getFormData();
  const fetchData = await fetch("/admin/api/route_detail", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      detailId: data.detailId,
      fromId: data.fromId,
      toId: data.toId,
      start: data.time1,
      end: data.time2,
      price: data.price,
      seats: data.seat
    })
  })
  try {
    const updatedRoute:RouteDetail = await fetchData.json();
    if(updatedRoute){
      detailInfo.update(updatedRoute.id,updatedRoute,data.fromName,data.toName);
      toastMsg.successMsg.showToast();
      return;
    }
  } catch (error) {console.log(error);}
  toastMsg.failedMsg.showToast();
}

function handleFormSubmit(e: SubmitEvent) {
  e.preventDefault();
  const detailForm = <HTMLFormElement>document.getElementById("route-detail-form");
  switch (detailForm.method) {
    case "get":
    case "GET": {
      console.log("Fetching ticket")
      fetchDetail();
      break;
    }
    case "post":
    case "POST": {
      const data = getFormData();
      if (data.detailId === -1) {
        createDetail();
      } else {
        updateDetail();
      }
      break;
    }
  }
}

document.getElementById("route-detail-find")?.addEventListener("click", SwitchGETFrom);
document.getElementById("route-detail-add")?.addEventListener("click", SwitchPOSTForm);
document.getElementById("route-detail-form")?.addEventListener("submit", handleFormSubmit);