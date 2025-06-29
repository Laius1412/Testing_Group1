import SelectSeat from "./SelectSeat.js";

interface imgAtribute {
  src: string,
  alt: string
}
const makeImgSrcArray = (amount: number = 5) => {
  const arr = Array<imgAtribute>(amount);
  for (let index = 0; index < arr.length; index++) {
    const data: imgAtribute = {
      src: `image/image${index}.png`,
      alt: `car img no image${index}`
    }
    arr[index] = data;
  }
  return arr;
}

class ChiTietElement extends HTMLElement {

  displayChiTiet: boolean;
  detailTabs: NodeListOf<HTMLElement>;
  navBtns:NodeListOf<HTMLButtonElement>;
  currentDisplayedDetailTab: number = 0;
  
  selectSeat:SelectSeat | null;
  checkOutTabs: NodeListOf<HTMLDivElement>;
  currentDisplayedCheckOutTab: number = 0;

  constructor(templateParma: HTMLTemplateElement | undefined | null = undefined) {
    super();
    this.displayChiTiet = false;
    this.attachShadow({ mode: "open" });

    let template: HTMLTemplateElement | undefined | null = null;

    if (templateParma) {
      template = templateParma
    } else {
      template = <HTMLTemplateElement>document.getElementById("chi-tiet-template");
    }

    const styleLinkElem = document.createElement("link");
    styleLinkElem.setAttribute("rel", "stylesheet");
    styleLinkElem.setAttribute("href", "/css/ChiTiet.css");

    let templateContent = template.content;
    this.shadowRoot?.appendChild(styleLinkElem);
    this.shadowRoot?.appendChild(templateContent.cloneNode(true));
    this.selectSeat = null;

    this.detailTabs = <NodeListOf<HTMLElement>>this.shadowRoot?.querySelectorAll(".js_vexere_detail_tab_item");
    this.navBtns = <NodeListOf<HTMLButtonElement>> this.shadowRoot?.querySelectorAll(".vexere_detail_info_select_tab > button");
    this.currentDisplayedDetailTab = 0;

    this.checkOutTabs = <NodeListOf<HTMLDivElement>> this.shadowRoot?.querySelectorAll(".js_checkout_item");

    const chiTiet = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
    const checkOut = <HTMLElement>this.shadowRoot?.querySelector(".vexere_checkout_container");
    chiTiet.style.display = "none";
    checkOut.style.display = "none";

    this.addDetailImage();
    this.addOpenDatailClickHandle();
    this.addDetailTabClickHandle();
    this.addCheckOutBtnHandler();
    this.addCheckOutNavBtnHandler();
  }

  addDetailImage() {
    const imgDisplayWrapper = this.shadowRoot?.querySelector(".vexere_bus_image_slider_display");
    const imgDatas = makeImgSrcArray();

    imgDatas.forEach((item) => {
      const imgDivWrap = document.createElement("div");
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;

      imgDivWrap.className = "vexere_bus_image_slider_display_img";
      imgDivWrap.appendChild(image);

      imgDisplayWrapper?.appendChild(imgDivWrap);
    })

  }

  addCheckOutNavBtnHandler(){

    this.checkOutTabs.forEach((tab,id)=>{
      tab.style.display = (id == 0) ? "" : "none";
    });

    const checkOutNavBnt = <NodeListOf<HTMLButtonElement>> this.shadowRoot?.querySelectorAll(".js_checkout_action > button");
    checkOutNavBnt.forEach((btn)=>{
      btn.onclick = (ev)=>{
        const value = isNaN(Number.parseInt(btn.value)) ? 0 : Number.parseInt(btn.value);
        const newIndex = this.currentDisplayedCheckOutTab + value;

        if( (newIndex < this.checkOutTabs.length) && (newIndex >= 0)){

          this.currentDisplayedCheckOutTab = newIndex;
          
          this.checkOutTabs.forEach((tab,id)=>{
            tab.style.display = (id == newIndex) ? "" : "none";
          });
        }
      }

    })
  }

  addCheckOutBtnHandler(){
    const orderBtn = <HTMLButtonElement> this.shadowRoot?.querySelector(".vexere_info_action > button");
    const chiTiet = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
    const checkOut = <HTMLElement>this.shadowRoot?.querySelector(".vexere_checkout_container");

    orderBtn.addEventListener("click",()=>{
      this.displayChiTiet = false;
      this.selectSeat = this.selectSeat || new SelectSeat(this);
      chiTiet.style.display = "none";
      checkOut.style.display = "";
    })
  }

  addOpenDatailClickHandle() {
    const chiTietAction = this.shadowRoot?.querySelector(".vexere_info_action > h4");
    const chiTiet = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
    chiTiet.style.display = "none";
    const checkOut = <HTMLElement>this.shadowRoot?.querySelector(".vexere_checkout_container");

    chiTietAction?.addEventListener('click', () => {
      this.displayChiTiet = !this.displayChiTiet;
      chiTietAction.innerHTML = (this.displayChiTiet) ? `Thông tin chi tiết 🔼` : `Thông tin chi tiết 🔽`;
      chiTiet.style.display = (this.displayChiTiet) ? "" : "none";
      checkOut.style.display = "none";
    });
  }
  addDetailTabClickHandle() {
    this.detailTabs.forEach((ele,id) =>{
      ele.style.display = (id == 0) ? "" : "none";
    })
    this.navBtns.forEach((btn)=>{
      btn.addEventListener("click",()=>{
        this.detailTabs.forEach((ele, index) => {
          ele.style.display = (index == Number.parseInt(btn.value)) ? "" : "none";
        });
      })
    })
  }

  public closeDetail() {
    this.displayChiTiet = false;
    const chiTietAction = <HTMLElement>this.shadowRoot?.querySelector(".vexere_info_action > h4");
    chiTietAction.innerHTML = `Thông tin chi tiết 🔼`;
    const chiTiet = <HTMLElement>this.shadowRoot?.querySelector(".vexere_detail_info_container");
    chiTiet.style.display = "none";
  }
}
customElements.define("chi-tiet-element", ChiTietElement);
export default ChiTietElement;