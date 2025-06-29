type Ticket = {
  id: number;
  comment: string | null;
  routeDetailId: number;
  status: "WAITING" | "PAID" | "CANCELED";
  userId: number;
}

class TicketElement extends HTMLElement{
  private ticketInfo: Ticket;
  private ticketForm:HTMLFormElement
  constructor(info:Ticket,form:HTMLFormElement){
    super();
    this.ticketInfo = info;
    this.ticketForm = form;

    this.innerText = `User id: ${this.ticketInfo.userId} - Ticket Id: ${this.ticketInfo.id}`
    this.onclick = this.setDataToForm;
  }

  public setDataToForm(){
    const inputs = this.ticketForm.elements;
    const comment = (<HTMLTextAreaElement>inputs.namedItem("comment"));
    const status = (<HTMLSelectElement>inputs.namedItem("ticket-status"));
    const id = (<HTMLInputElement>inputs.namedItem("ticket-id"));
    if(!comment || !status || !id){
      return;
    }

    comment.value = this.ticketInfo.comment ? this.ticketInfo.comment : "";
    status.value = this.ticketInfo.status;
    id.valueAsNumber = this.ticketInfo.id;
  }

  public getTicket(){
    return this.ticketInfo;
  }
  public updateTicketData(comment:string,status:("WAITING" | "PAID" | "CANCELED")){
    this.ticketInfo.comment = comment;
    this.ticketInfo.status = status; 
  }
}
customElements.define('li-ticket-element', TicketElement);

export default TicketElement;