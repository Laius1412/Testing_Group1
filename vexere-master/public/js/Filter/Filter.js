"use strict";
// const rangeInput = document.querySelectorAll(".range-input input"),
//   priceInput = document.querySelectorAll(".price-input input"),
//   range = document.querySelector(".slider .progress");
// let priceGap = 1000;
// priceInput.forEach((input) => {
//   input.addEventListener("input", (e) => {
//     let minPrice = parseInt(priceInput[0].value),
//       maxPrice = parseInt(priceInput[1].value);
//     if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
//       if (e.target.className === "input-min") {
//         rangeInput[0].value = minPrice;
//         range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
//       } else {
//         rangeInput[1].value = maxPrice;
//         range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
//       }
//     }
//   });
// });
// rangeInput.forEach((input) => {
//   input.addEventListener("input", (e) => {
//     let minVal = parseInt(rangeInput[0].value),
//       maxVal = parseInt(rangeInput[1].value);
//     if (maxVal - minVal < priceGap) {
//       if (e.target.className === "range-min") {
//         rangeInput[0].value = maxVal - priceGap;
//       } else {
//         rangeInput[1].value = minVal + priceGap;
//       }
//     } else {
//       priceInput[0].value = minVal;
//       priceInput[1].value = maxVal;
//       range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
//       range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
//     }
//   });
// });
const MAX = 2000000;
const MIN = 0;
const mainFilter = () => {
};
class RangeHandle {
    constructor() {
        this.ABS_MAX = 2000000;
        this.ABS_MIN = 0;
        this.minSlider = document.querySelector("#min-price-slider");
        this.maxSlider = document.querySelector("#max-price-slider");
        this.minWidthPercent = 100;
        this.maxWidthPercent = 100;
        this.px = 10;
        this.currentMax = 0;
        this.currentMin = 0;
        if (!this.minSlider || !this.maxSlider) {
            return;
        }
        this.minSlider.defaultValue = "0";
        this.minSlider.value = "0";
        this.maxSlider.defaultValue = "2000000";
        this.maxSlider.value = "2000000";
        this.currentMax = this.maxSlider.valueAsNumber;
        this.currentMin = this.minSlider.valueAsNumber;
        this.ReCalcMax_whenMinChange();
        this.ReCalcMin_whenMaxChange();
        this.minSlider.onclick = (ev) => {
            ev.preventDefault();
        };
        this.maxSlider.onclick = (ev) => {
            ev.preventDefault();
        };
        this.minSlider.oninput = (ev) => {
            this.currentMin = this.minSlider.valueAsNumber;
            this.ReCalcMax_whenMinChange();
            this.ReCalcMin_whenMaxChange();
            this.maxSlider.style.width = `calc(${this.maxWidthPercent.toFixed(0)}% + 20px)`;
            this.minSlider.style.width = `calc(${this.minWidthPercent.toFixed(0)}% - 20px)`;
            this.maxSlider.min = this.currentMin.toFixed(0).toString();
        };
        this.maxSlider.oninput = (ev) => {
            this.currentMax = this.maxSlider.valueAsNumber;
            this.ReCalcMax_whenMinChange();
            this.ReCalcMin_whenMaxChange();
            this.minSlider.style.width = `calc(${this.minWidthPercent.toFixed(0)}% + 20px)`;
            this.maxSlider.style.width = `calc(${this.maxWidthPercent.toFixed(0)}% - 20px)`;
            this.minSlider.max = this.currentMax.toFixed(0).toString();
        };
    }
    ReCalcMin_whenMaxChange() {
        this.minWidthPercent = (((this.currentMax) / (this.ABS_MAX)) * 100);
    }
    ReCalcMax_whenMinChange() {
        this.maxWidthPercent = (((this.ABS_MAX - this.currentMin) / (this.ABS_MAX)) * 100);
    }
}
const rangeHandler = new RangeHandle();
