import { LightningElement } from "lwc";
import AlarmClockAssets from "@salesforce/resourceUrl/AlarmClockAssets";
// Example :- import TRAILHEAD_LOGO from '@salesforce/resourceUrl/trailhead_logo';";
export default class AlarmClockApp extends LightningElement {
  clockImage = AlarmClockAssets + "/AlarmClockAssets/clock.png";
  ringtone = new Audio(AlarmClockAssets + "/AlarmClockAssets/Clocksound.mp3");
  currentTime;
  hours = [];
  minutes = [];
  meridems = ["AM", "PM"];
  hourSelected;
  minSelected;
  meridemSelected;
  alarmTime;
  isAlarmSet = false;
  isAlarmTriggered = false;

  get isFieldNotSelected() {
    return !(this.hourSelected && this.minSelected && this.meridemSelected);
  }

  get shakeImage() {
    return this.isAlarmTriggered ? "shake" : "";
  }
  connectedCallback() {
    this.createHoursOptions();
    this.createMinutesOptions();
    this.currentTimeHandler();
  }
  currentTimeHandler() {
    const updateCurrentTime = () => {
      const dateTime = new Date();
      const hour = dateTime.getHours();
      const min = dateTime.getMinutes().toString().padStart(2, "0");
      const sec = dateTime.getSeconds().toString().padStart(2, "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = (hour % 12 === 0 ? 12 : hour % 12)
        .toString()
        .padStart(2, "0");
      this.currentTime = `${formattedHour}:${min}:${sec} ${ampm}`;
      if (this.alarmTime === `${formattedHour}:${min} ${ampm}`) {
        this.isAlarmTriggered = true;
        this.ringtone.play();
        this.ringtone.loop = true;
      }
    };
    setInterval(updateCurrentTime, 1000);
  }
  createHoursOptions() {
    for (let i = 0; i <= 12; i++) {
      let val = i < 10 ? "0" + i : i;
      this.hours.push(val);
    }
  }
  createMinutesOptions() {
    for (let i = 1; i <= 59; i++) {
      let val = i < 10 ? "0" + i : i;
      this.minutes.push(val);
    }
  }
  optionhandler(event) {
    console.log("optionhandler");
    const { label, value } = event.detail;
    if (label === "Hour(s)") {
      this.hourSelected = value;
    } else if (label === "Minute(s)") {
      this.minSelected = value;
    } else if (label === "AM/PM") {
      this.meridemSelected = value;
    }
    console.log("this.hourSelected", this.hourSelected);
    console.log("this.minSelected", this.minSelected);
    console.log("this.meridemSelected", this.meridemSelected);
  }
  setAlarmHandler() {
    this.alarmTime = `${this.hourSelected}:${this.minSelected} ${this.meridemSelected}`;
    this.isAlarmSet = true;
  }
  clearAlarmHandler() {
    this.alarmTime = "";
    this.isAlarmTriggered = false;
    this.ringtone.pause();
    const elements = this.template.querySelectorAll("c-clock-dropdown");
    Array.from(elements).forEach((element) => {
      element.reset("");
    });
    this.isAlarmSet = false;
  }
}
