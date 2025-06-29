type Bus = {
  id: number
  plate: string
  seatAmount: number
  type: number
  busHouse: number
}

class BusElement extends HTMLElement {
  private busId: number;
  private plate: string;
  private seats: number;
  private type: number;
  private form: HTMLFormElement;
  private houseId: number;
  private houseName: string;
  constructor(busId: number, busPlate: string, busSeats: number, busType: number, house: number, houseName: string,
    form: HTMLFormElement) {
    super();
    this.busId = busId;
    this.plate = busPlate;
    this.seats = busSeats;
    this.form = form;
    this.type = busType;
    this.houseId = house;
    this.houseName = houseName;

    this.innerText = `${this.plate} - ${this.houseName}`

    this.onclick = this.updateForm;
  }

  updateForm() {
    const inputs = this.form.elements;
    (<HTMLInputElement>inputs.namedItem("busId")).valueAsNumber = this.busId;
    (<HTMLInputElement>inputs.namedItem("plate")).value = this.plate;
    (<HTMLInputElement>inputs.namedItem("busType")).valueAsNumber = this.type;
    (<HTMLInputElement>inputs.namedItem("seats")).valueAsNumber = this.seats;
    (<HTMLSelectElement>inputs.namedItem("house")).value = `${this.houseId}`;
  }

  public getBusId() {
    return this.busId;
  }

  public updateBus(data:{id:number,plate:string,seatAmount:number},houseName:string){
    this.busId = data.id;
    this.plate = data.plate;
    this.seats = data.seatAmount;
    this.houseName = houseName;
    
    this.innerText = `${this.plate} - ${this.houseName}`

  }
}

customElements.define('li-bus-element', BusElement);
export default BusElement;