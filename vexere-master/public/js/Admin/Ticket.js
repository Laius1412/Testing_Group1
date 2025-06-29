import TicketElement from "./TicketEleClass.js";
import toastMsg from "./Toast.js";
class TicketsInfo {
    constructor() {
        this.ticketMap = {};
    }
    setTickets(tickets) {
        this.ticketMap = {};
        tickets.forEach((ticket) => {
            this.ticketMap[ticket.getTicket().id] = ticket;
        });
    }
    addElement(ticket) {
        this.ticketMap[ticket.getTicket().id] = ticket;
    }
    updateElement(ticketId, comment, status) {
        if (this.ticketMap[ticketId]) {
            this.ticketMap[ticketId].updateTicketData(comment, status);
        }
    }
}
const ticketInfo = new TicketsInfo();
async function fetchTicket() {
    const ticketForm = document.getElementById("ticket-display-form");
    const ticketList = document.getElementById("ticket-display-list");
    if (!ticketForm || !ticketList) {
        return;
    }
    toastMsg.fetchDetailMsg.showToast();
    console.log("Fetching ticket...");
    const fetchData = await fetch("/admin/api/ticket");
    try {
        const tickets = await fetchData.json();
        console.log(tickets);
        if (!Array.isArray(tickets)) {
            toastMsg.failedMsg.showToast();
            return null;
        }
        const ticketLi = [];
        tickets.forEach(ticket => {
            const newTicket = new TicketElement(ticket, ticketForm);
            ticketInfo.addElement(newTicket);
            const li = document.createElement("li");
            li.appendChild(newTicket);
            ticketLi.push(li);
        });
        ticketList.replaceChildren(...ticketLi);
        toastMsg.successMsg.showToast();
        return null;
    }
    catch (error) {
        console.log(error);
    }
    toastMsg.failedMsg.showToast();
}
async function updateTicket(event) {
    event.preventDefault();
    const form = event.target;
    if (!form) {
        return;
    }
    const inputs = form.elements;
    const ticketId = inputs.namedItem("ticket-id")?.valueAsNumber;
    const comment = inputs.namedItem("comment")?.value;
    const status = inputs.namedItem("ticket-status")?.value;
    if (!(ticketId && status)) {
        console.log(inputs, ticketId, comment, status);
        return;
    }
    toastMsg.updateDetailMsg.showToast();
    const fetchUpdate = await fetch("/admin/api/ticket", {
        method: "PUT",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ticketId: ticketId,
            status: status,
            comment: comment
        })
    });
    console.log(fetchUpdate);
    try {
        const updateTicket = await fetchUpdate.json();
        ticketInfo.updateElement(updateTicket.id, updateTicket.comment ? updateTicket.comment : "", updateTicket.status);
        toastMsg.successMsg.showToast();
        console.log(updateTicket);
        return null;
    }
    catch (error) {
        console.log(error);
    }
    ;
    toastMsg.failedMsg.showToast();
}
document.getElementById("ticket-refresh-btn")?.addEventListener("click", fetchTicket);
document.getElementById("ticket-display-form")?.addEventListener("submit", updateTicket);
