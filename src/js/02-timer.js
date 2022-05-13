import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const datepickerInput = document.querySelector('input#datetime-picker');
const daysRef = document.querySelector('.value[data-days]');
const hoursRef = document.querySelector('.value[data-hours]');
const minutesRef = document.querySelector('.value[data-minutes]');
const secondsRef = document.querySelector('.value[data-seconds]');
const startBtnRef = document.querySelector('button[data-start]');
startBtnRef.disabled = true;
let timerId = null;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}
let dates = [];

flatpickr(datepickerInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates[0] > Date.now()) {
      startBtnRef.disabled = false;

      startBtnRef.disabled = false;
      return (dates = selectedDates[0]);
    }

    startBtnRef.disabled = true;
    Notify.failure('Please choose a date in the future');
  },
});

startBtnRef.addEventListener('click', () => {
  startBtnRef.disabled = true;

  Notify.info('Countdown has started');

  timerId = setInterval(() => {
    const currentTimeData = Date.now();
    const selectedTimeData = dates;
    const timeDataObj = convertMs(selectedTimeData - currentTimeData);

    daysRef.textContent = timeDataObj.days;
    hoursRef.textContent = timeDataObj.hours;
    minutesRef.textContent = timeDataObj.minutes;
    secondsRef.textContent = timeDataObj.seconds;

    if (
      (timeDataObj.days === '00') &
      (timeDataObj.hours === '00') &
      (timeDataObj.minutes === '00') &
      (timeDataObj.seconds === '00')
    ) {
      Notify.success('Countdown has reached the end');
      return clearInterval(timerId);
    }
  }, 1000);
});
