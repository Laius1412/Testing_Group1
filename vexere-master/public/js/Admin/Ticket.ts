import TicketElement from "./TicketEleClass.js";
import toastMsg from "./Toast.js";

type Ticket = {
  id: number;
  comment: string | null;
  routeDetailId: number;
  status: "WAITING" | "PAID" | "CANCELED";
  userId: number;
}
class TicketsInfo{
  public ticketMap: {[key:number]:TicketElement}
  constructor(){
    this.ticketMap = {};
  }
  public setTickets(tickets: TicketElement[]){
    this.ticketMap = {};
    tickets.forEach((ticket)=>{
      this.ticketMap[ticket.getTicket().id] = ticket;
    })
  }
  public addElement(ticket: TicketElement){
    this.ticketMap[ticket.getTicket().id] = ticket;
  }
  public updateElement(ticketId:number,comment:string,status:("WAITING" | "PAID" | "CANCELED")){
    if(this.ticketMap[ticketId]){
      this.ticketMap[ticketId].updateTicketData(comment,status);
    }
  }
}
const ticketInfo = new TicketsInfo();

async function fetchTicket() {
  const ticketForm = <HTMLFormElement> document.getElementById("ticket-display-form");
  const ticketList = <HTMLUListElement> document.getElementById("ticket-display-list");

  if(!ticketForm || !ticketList){
    return;
  }
  toastMsg.fetchDetailMsg.showToast();
  console.log("Fetching ticket...")
  const fetchData = await fetch("/admin/api/ticket");
  try {
    const tickets = await fetchData.json();
    console.log(tickets);
    if(!Array.isArray(tickets)){
      toastMsg.failedMsg.showToast();
      return null;
    }

    const ticketLi:HTMLLIElement[] = [];

    tickets.forEach(ticket=>{
      const newTicket = new TicketElement(ticket,ticketForm);
      ticketInfo.addElement(newTicket);
      const li = document.createElement("li");
      li.appendChild(newTicket);
      ticketLi.push(li);
    })

    ticketList.replaceChildren(...ticketLi);
    toastMsg.successMsg.showToast();
    return null;
  } catch (error) {
    console.log(error);
  }
  toastMsg.failedMsg.showToast();
}

async function updateTicket(event:SubmitEvent) {
  event.preventDefault();
  const form = <HTMLFormElement>event.target;
  if(!form){
    return;
  }
  const inputs = form.elements;
  const ticketId = (<HTMLInputElement>inputs.namedItem("ticket-id"))?.valueAsNumber;
  const comment = (<HTMLInputElement>inputs.namedItem("comment"))?.value;
  const status = (<HTMLInputElement>inputs.namedItem("ticket-status"))?.value;

  if(!(ticketId && status)){
    console.log(inputs,ticketId,comment,status)
    return;
  }

  toastMsg.updateDetailMsg.showToast();
  const fetchUpdate = await fetch("/admin/api/ticket",{
    method:"PUT",
    cache:"no-cache",
    credentials:"same-origin",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      ticketId: ticketId,
      status: status,
      comment: comment
    })
  });
  console.log(fetchUpdate);
  try {
    const updateTicket:Ticket = await fetchUpdate.json();
    ticketInfo.updateElement(updateTicket.id,updateTicket.comment ? updateTicket.comment : "",updateTicket.status);
    toastMsg.successMsg.showToast();
    console.log(updateTicket);
    return null;
  } catch (error) {console.log(error)};

  toastMsg.failedMsg.showToast();
}

document.getElementById("ticket-refresh-btn")?.addEventListener("click",fetchTicket);
document.getElementById("ticket-display-form")?.addEventListener("submit",updateTicket)