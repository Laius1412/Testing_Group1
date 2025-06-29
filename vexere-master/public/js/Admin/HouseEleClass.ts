type BusHouse = {
  id: number;
  Name: string;
  Phone: string;
  Desc: string;
}


class HouseElement extends HTMLElement {
  private house:BusHouse;
  private houseForm:HTMLFormElement;

  constructor(houseInfo:BusHouse,form:HTMLFormElement){
    super();
    this.house = houseInfo;
    this.houseForm = form;
    this.innerText = houseInfo.Name;
    this.onclick = this.setDataToForm;
  }

  public setDataToForm(){
    const inputs = this.houseForm.elements;
    const name = <HTMLInputElement>inputs.namedItem("house-name");
    const id = <HTMLInputElement>inputs.namedItem("house-id");
    const desc = <HTMLInputElement>inputs.namedItem("desc");
    const phone = <HTMLInputElement>inputs.namedItem("phone");

    if(!inputs || !name || !id){
      return null;
    }

    name.value = this.house.Name;
    id.valueAsNumber = this.house.id;
    desc.value = this.house.Desc;
    phone.value = this.house.Phone;
  }

  public updateHouseData(name:string){
    this.house.Name = name;
  }

  public getHouse(){
    return this.house;
  }
}
customElements.define('li-house-element', HouseElement);
export default HouseElement;