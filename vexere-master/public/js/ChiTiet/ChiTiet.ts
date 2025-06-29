//Chi tiet template maker
import ChiTietElement from "./DetailClass.js";


const body = document.body;
const template = <HTMLTemplateElement> document.getElementById("chi-tiet-template");
Array<number>(5).fill(0).forEach(() => {
  const chiTietElement = new ChiTietElement(template);
  body.appendChild(chiTietElement);
});
