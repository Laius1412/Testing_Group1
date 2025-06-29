import DetailElement from "./DetailEle.js";
import toastMsg from "./Toast.js";
class DetailInfo {
    constructor() {
        this.elements = [];
    }
    update(detail, data, start, end) {
        for (let index = 0; index < this.elements.length; index++) {
            if (this.elements[index].getDetailId() === detail) {
                console.log(data, start, end);
                this.elements[index].setData(data, start, end);
                break;
            }
        }
    }
}
const detailInfo = new DetailInfo();
function SwitchGETFrom() {
    const detailForm = document.getElementById("route-detail-form");
    detailForm.method = "GET";
    const timeLabel = detailForm.querySelectorAll(".js-time-label > span");
    timeLabel[0].innerText = "Ngày đi sớm nhất";
    timeLabel[1].innerText = "Ngày đi trễ nhất";
    detailForm.elements.namedItem("time1").type = "date";
    detailForm.elements.namedItem("time2").type = "date";
    detailForm.elements.namedItem("detailId").required = false;
    detailForm.elements.namedItem("busId").required = false;
    detailForm.elements.namedItem("seat").required = false;
    detailForm.elements.namedItem("price").required = false;
    const postLabel = detailForm.querySelectorAll(".js-post-label");
    console.log(postLabel);
    postLabel.forEach(lbl => { lbl.style.display = "none"; });
}
function SwitchPOSTForm() {
    const detailForm = document.getElementById("route-detail-form");
    detailForm.method = "POST";
    const timeLabel = detailForm.querySelectorAll(".js-time-label > span");
    timeLabel[0].innerText = "Giờ đi";
    timeLabel[1].innerText = "Giờ đến";
    detailForm.elements.namedItem("time1").type = "datetime-local";
    detailForm.elements.namedItem("time2").type = "datetime-local";
    detailForm.elements.namedItem("detailId").valueAsNumber = -1;
    detailForm.elements.namedItem("detailId").required = true;
    detailForm.elements.namedItem("busId").required = true;
    detailForm.elements.namedItem("busId").readOnly = false;
    detailForm.elements.namedItem("seat").required = true;
    detailForm.elements.namedItem("price").required = true;
    const postLabel = detailForm.querySelectorAll(".js-post-label");
    postLabel.forEach(lbl => { lbl.style.display = "grid"; });
}
function getFormData() {
    const detailForm = document.getElementById("route-detail-form");
    const inputs = detailForm.elements;
    const nameIndex = inputs.namedItem("from-location").selectedIndex;
    const toIndex = inputs.namedItem("to-location").selectedIndex;
    const data = {
        time1: inputs.namedItem("time1").valueAsDate,
        time2: inputs.namedItem("time2").valueAsDate,
        detailId: inputs.namedItem("detailId").valueAsNumber,
        busId: inputs.namedItem("busId").valueAsNumber,
        fromId: Number.parseInt(inputs.namedItem("from-location").value),
        toId: Number.parseInt(inputs.namedItem("to-location").value),
        seat: detailForm.elements.namedItem("seat").valueAsNumber,
        price: detailForm.elements.namedItem("price").valueAsNumber,
        fromName: inputs.namedItem("from-location").options[nameIndex].text,
        toName: inputs.namedItem("to-location").options[toIndex].text,
    };
    return data;
}
async function fetchDetail() {
    toastMsg.fetchDetailMsg.showToast();
    const data = getFormData();
    const fetchData = await fetch(`/admin/api/route_detail?fromId=${data.fromId}&toId=${data.toId}&time1=${data.time1}&time2=${data.time2}`);
    const routeUL = document.getElementById("route-display-list");
    const detailForm = document.getElementById("route-detail-form");
    try {
        const details = await fetchData.json();
        console.log(details);
        if (detailInfo) {
            const liArr = [];
            details.forEach((det) => {
                const newElement = new DetailElement(det, data.fromName, data.toName, detailForm);
                detailInfo.elements.push(newElement);
                const li = document.createElement("li");
                li.appendChild(newElement);
                liArr.push(li);
            });
            routeUL.replaceChildren(...liArr);
            toastMsg.successMsg.showToast();
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
    toastMsg.failedMsg.showToast();
}
async function createDetail() {
    toastMsg.createDetailMsg.showToast();
    const routeUL = document.getElementById("route-display-list");
    const detailForm = document.getElementById("route-detail-form");
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
    });
    try {
        const newRouteDetail = await fetchData.json();
        if (newRouteDetail) {
            const newElement = new DetailElement(newRouteDetail, data.fromName, data.toName, detailForm);
            detailInfo.elements.push(newElement);
            const li = document.createElement("li");
            li.appendChild(newElement);
            routeUL.appendChild(li);
            toastMsg.successMsg.showToast();
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
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
    });
    try {
        const updatedRoute = await fetchData.json();
        if (updatedRoute) {
            detailInfo.update(updatedRoute.id, updatedRoute, data.fromName, data.toName);
            toastMsg.successMsg.showToast();
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
    toastMsg.failedMsg.showToast();
}
function handleFormSubmit(e) {
    e.preventDefault();
    const detailForm = document.getElementById("route-detail-form");
    switch (detailForm.method) {
        case "get":
        case "GET": {
            console.log("Fetching ticket");
            fetchDetail();
            break;
        }
        case "post":
        case "POST": {
            const data = getFormData();
            if (data.detailId === -1) {
                createDetail();
            }
            else {
                updateDetail();
            }
            break;
        }
    }
}
document.getElementById("route-detail-find")?.addEventListener("click", SwitchGETFrom);
document.getElementById("route-detail-add")?.addEventListener("click", SwitchPOSTForm);
document.getElementById("route-detail-form")?.addEventListener("submit", handleFormSubmit);
