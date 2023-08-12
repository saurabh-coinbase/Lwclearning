import { LightningElement } from "lwc";

export default class BmiCalculator extends LightningElement {
  height = "";
  weight = "";
  bmiValue = "";
  result;
  inputHandler(event) {
    const { name, value } = event.target;
    if (name === "height") {
      this.height = value;
    } else if (name === "weight") {
      this.weight = value;
    }
    /** this[name] = value*/
  }

  submitHandler(event) {
    event.preventDefault();
    console.log("height", this.height);
    console.log("weight", this.weight);
    this.calculate();
  }
  calculate() {
    let height = Number(this.height) / 100;
    let bmi = (Number(this.weight) / height) * height;
    console.log("bmi value", bmi);
    this.bmiValue = Number(bmi.toFixed());

    if (this.bmiValue < 18.5) {
      this.result = "Underweight";
    } else if (this.bmiValue >= 18.5 && this.bmiValue <= 25) {
      this.result = "Heighty";
    } else if (this.bmiValue > 25 && this.bmiValue < 30) {
      this.result = "Overweight";
    } else {
      this.result = "Obese";
    }
  }
  recalculate() {
    this.bmiValue = "";
    this.height = "";
    this.weight = "";
    this.result = "";
  }
}
