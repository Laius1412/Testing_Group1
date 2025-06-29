import DetailClass from "./DetailClass";

class SelectSeat {
  detailClass:DetailClass;
  seatSelectList: HTMLLIElement[];
  totalSeats: number;
  remainSeats:number;

  selectedSeats:number[];

  constructor(detailElement:DetailClass){
    this.detailClass = detailElement;
    this.seatSelectList = [];
    this.selectedSeats = [];

    const total = Number.parseInt((<HTMLSpanElement> this.detailClass.shadowRoot?.querySelector(".js-seat-amount")).innerText);
    this.totalSeats = (isNaN(total)) ? 0 : total;
    
    const remain = Number.parseInt((<HTMLSpanElement> this.detailClass.shadowRoot?.querySelector(".js-empty-seat")).innerText);
    this.remainSeats = (isNaN(remain)) ? 0 : remain;

    this.fillSeats();
    this.makeEmptySeat();
  }

  makeEmptySeat(){
    let seatEmptied = this.remainSeats;
    while(seatEmptied > 0){
      const randId = Math.floor(Math.random() * this.totalSeats);
      if(this.seatSelectList[randId].innerText.includes("🟦")){
        continue;
      }
      seatEmptied -= 1;
      this.seatSelectList[randId].innerText = "🟦";
      this.seatSelectList[randId].style.cursor = "pointer"

      this.seatSelectList[randId].onclick = (ev)=>{
        this.selectSeatHander(this.seatSelectList[randId]);
      }
    }
  }

  selectSeatHander(li:HTMLLIElement){
    if(li.innerText.includes("🟦")){
      li.innerText = "🟩";
      this.selectedSeats.push(li.value);
    }else{
      console.log("remove");
      li.innerText = "🟦";
      this.selectedSeats = this.selectedSeats.filter((item)=>{return(item != li.value)});
    }
    const seatDisplay = <HTMLSpanElement> this.detailClass.shadowRoot?.querySelector(".js_checkout_seat");
    seatDisplay.innerText = this.selectedSeats.toString().replace("[|]","");

    const price = <HTMLSpanElement> this.detailClass.shadowRoot?.querySelector(".js_checkout_price");
    price.innerText = (this.selectedSeats.length * 300000).toFixed(0);
  }

  fillSeats(){
    const totalSpit:Number =  (this.totalSeats < 10) ? 1 : ( Number.parseInt(this.totalSeats.toFixed(0)) / 10);
    const selectSeatContainer = this.detailClass.shadowRoot?.querySelector(".vexere_checout_seat_select_action");
    if(selectSeatContainer){
      for (let index = 0; index < totalSpit; index++) {
        const ul = document.createElement("ul");
        for (let seat = 0; seat < 10; seat++) {
          if((((index)*10) + seat) >= this.totalSeats){
            break;
          } 
          const li = document.createElement("li");
          li.innerText = `🟥`;
          li.style.cursor = "not-allowed"
          li.value = ((index)*10) + seat;
          ul.appendChild(li);
          this.seatSelectList.push(li);
        }
        selectSeatContainer.appendChild(ul);
      }
    }
  }


}

export default SelectSeat;