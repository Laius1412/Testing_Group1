class BusElement extends HTMLElement {
    constructor(busId, busPlate, busSeats, busType, house, houseName, form) {
        super();
        this.busId = busId;
        this.plate = busPlate;
        this.seats = busSeats;
        this.form = form;
        this.type = busType;
        this.houseId = house;
        this.houseName = houseName;
        this.innerText = `${this.plate} - ${this.houseName}`;
        this.onclick = this.updateForm;
    }
    updateForm() {
        const inputs = this.form.elements;
        inputs.namedItem("busId").valueAsNumber = this.busId;
        inputs.namedItem("plate").value = this.plate;
        inputs.namedItem("busType").valueAsNumber = this.type;
        inputs.namedItem("seats").valueAsNumber = this.seats;
        inputs.namedItem("house").value = `${this.houseId}`;
    }
    getBusId() {
        return this.busId;
    }
    updateBus(data, houseName) {
        this.busId = data.id;
        this.plate = data.plate;
        this.seats = data.seatAmount;
        this.houseName = houseName;
        this.innerText = `${this.plate} - ${this.houseName}`;
    }
}
customElements.define('li-bus-element', BusElement);
export default BusElement;
