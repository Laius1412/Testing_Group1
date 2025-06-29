class HouseElement extends HTMLElement {
    constructor(houseInfo, form) {
        super();
        this.house = houseInfo;
        this.houseForm = form;
        this.innerText = houseInfo.Name;
        this.onclick = this.setDataToForm;
    }
    setDataToForm() {
        const inputs = this.houseForm.elements;
        const name = inputs.namedItem("house-name");
        const id = inputs.namedItem("house-id");
        const desc = inputs.namedItem("desc");
        const phone = inputs.namedItem("phone");
        if (!inputs || !name || !id) {
            return null;
        }
        name.value = this.house.Name;
        id.valueAsNumber = this.house.id;
        desc.value = this.house.Desc;
        phone.value = this.house.Phone;
    }
    updateHouseData(name) {
        this.house.Name = name;
    }
    getHouse() {
        return this.house;
    }
}
customElements.define('li-house-element', HouseElement);
export default HouseElement;
