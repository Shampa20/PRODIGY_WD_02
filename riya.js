// Variables for stopwatch
let hr = min = sec = ms = "00";
let startTimer;
let paused = false;

// Elements
const startBtn = document.querySelector(".start");
const pauseBtn = document.querySelector(".pause");
const resetBtn = document.querySelector(".reset");
const lapBtn = document.querySelector(".lap");
const lapContainer = document.querySelector(".lap-container");
const quoteBox = document.querySelector(".quote-box");
const dateBoxes = document.querySelectorAll(".date-box");
const timeOfDayBox = document.querySelector(".time-of-day-box");

// Quotes
const quotes = [
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Do not wait; the time will never be 'just right.' Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "The only way to do great work is to love what you do."
];

// Track previous date and day values
let prevDay = "";
let prevMonth = "";
let prevYear = "";
let prevDayOfWeek = "";
let prevPeriod = "";

// Load sound
const bipSound = new Audio('bip.mp3');
const clockSound = new Audio('clock.mp3');

// Ensure sounds are loaded
bipSound.addEventListener('canplaythrough', () => console.log('Bip sound loaded'));
clockSound.addEventListener('canplaythrough', () => console.log('Clock sound loaded'));

// Play sound with error handling
function playSound(sound) {
  if (sound) {
    sound.play().catch(error => console.error('Error playing sound:', error));
  }
}

// Play bip sound on button clicks
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    playSound(bipSound);
  }
});


// Event Listeners
startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", recordLap);

// Functions
function start() {
  if (!paused) {
    startBtn.classList.add("active");
    pauseBtn.classList.remove("stopActive");
    startTimer = setInterval(updateTime, 10);
  } else {
    paused = false;
    startBtn.classList.add("active");
    pauseBtn.classList.remove("stopActive");
    startTimer = setInterval(updateTime, 10);
  }
}

function pause() {
  startBtn.classList.remove("active");
  pauseBtn.classList.add("stopActive");
  clearInterval(startTimer);
  paused = true;
}

function reset() {
  startBtn.classList.remove("active");
  pauseBtn.classList.remove("stopActive");
  clearInterval(startTimer);
  hr = min = sec = ms = "00";
  putValue();
  lapContainer.innerHTML = "";
  generateQuote(); // Generate a new quote when resetting
  paused = false;
}

// Update clock function
function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  document.querySelector('.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
  document.querySelector('.min-hand').style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hourDegrees = ((hour % 12) / 12) * 360 + ((mins / 60) * 30) + 90;
  document.querySelector('.hour-hand').style.transform = `rotate(${hourDegrees}deg)`;

  // Play the sound when the clock hands move
  playSound(clockSound);
}

// Call updateClock regularly
setTimeout(() => {
  updateClock();
  setInterval(updateClock, 1000);
}, 1000);

function updateTime() {
  ms++;
  ms = ms < 10 ? "0" + ms : ms;
  if (ms == 100) {
    sec++;
    sec = sec < 10 ? "0" + sec : sec;
    ms = "00";
  }
  if (sec == 60) {
    min++;
    min = min < 10 ? "0" + min : min;
    sec = "00";
  }
  if (min == 60) {
    hr++;
    hr = hr < 10 ? "0" + hr : hr;
    min = "00";
  }
  putValue();
}

function putValue() {
  document.querySelector(".millisecond").innerText = ms;
  document.querySelector(".second").innerText = sec;
  document.querySelector(".minute").innerText = min;
  document.querySelector(".hour").innerText = hr;
}

function updateDate() {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2); // Get last 2 digits of year
  
  // Array to get short day names
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = days[now.getDay()]; // Get the short name of the day of the week

  // Update date boxes with rotation animation only if values have changed
  if (day !== prevDay) {
    animateDateChange(dateBoxes[0], day);
    prevDay = day;
  }
  if (month !== prevMonth) {
    animateDateChange(dateBoxes[1], month);
    prevMonth = month;
  }
  if (year !== prevYear) {
    animateDateChange(dateBoxes[2], year);
    prevYear = year;
  }
  if (dayOfWeek !== prevDayOfWeek) {
    animateDateChange(document.querySelector(".day-of-week"), dayOfWeek);
    prevDayOfWeek = dayOfWeek;
  }

  updateDayPeriod(now);
}

function animateDateChange(element, newValue) {
  element.classList.add('flip');
  setTimeout(() => {
    element.innerText = newValue;
    element.classList.remove('flip');
  }, 300); // Adjust the timeout to match the duration of the animation
}

function updateDayPeriod(now) {
  const hours = now.getHours();
  let period = "";
  if (hours >= 5 && hours < 12) {
    period = "morning";
  } else if (hours >= 12 && hours < 17) {
    period = "afternoon";
  } else if (hours >= 17 && hours < 21) {
    period = "evening";
  } else {
    period = "night";
  }

  if (prevPeriod && prevPeriod !== period) {
    playSound(bipSound); // Play sound on transition
  }

  timeOfDayBox.className = `time-of-day-box ${period}`;
  timeOfDayBox.innerText = getEmoji(period);

  prevPeriod = period; // Update previous period
}

function getEmoji(period) {
  switch (period) {
    case "morning":
      return "🌅";
    case "afternoon":
      return "🌞";
    case "evening":
      return "🌇";
    case "night":
      return "🌙";
    default:
      return "";
  }
}

function recordLap() {
  if (hr === "00" && min === "00" && sec === "00" && ms === "00") {
    return; // Do nothing if all values are zero
  }
  const lapItem = document.createElement("div");
  lapItem.classList.add("lap-item");
  lapItem.innerText = `Lap ${lapContainer.children.length + 1}: ${hr}:${min}:${sec}:${ms}`;
  lapContainer.appendChild(lapItem);
  generateQuote(); // Generate a new quote after recording a lap
}

function generateQuote() {
  // Clear the previous quote before adding a new one
  quoteBox.innerHTML = "";
  
  // Select a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteItem = document.createElement("div");
  quoteItem.classList.add("quote");
  quoteItem.innerText = randomQuote;
  
  quoteBox.appendChild(quoteItem);
}

// Initialize quotes and update date and clock
generateQuote();
updateDate();
updateClock();
setInterval(updateDate, 1000);

// Alarm

document.getElementById('alarmTriggerBox').addEventListener('click', function() {
  document.getElementById('alarmBox').classList.add('show');
});

document.getElementById('closeAlarmBox').addEventListener('click', function() {
  document.getElementById('alarmBox').classList.remove('show');
});

const alarmSound = document.getElementById('alarmSound');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const alarmList = document.getElementById('alarmList');
const alarmTimeInput = document.getElementById('alarmTime');
const reminderSelect = document.getElementById('reminderSelect');

const popupMessage = document.getElementById('popupMessage');
const closePopup = document.getElementById('closePopup');

let alarms = [];
let ringingAlarms = []; // Array to track active alarms
let alarmTimeouts = [];
let reminderIntervals = [];

// Show popup message
function showPopupMessage() {
    popupMessage.style.display = 'block';
}

// Close popup message
closePopup.addEventListener('click', function() {
    popupMessage.style.display = 'none';
});

// Event Listener for setting an alarm
setAlarmBtn.addEventListener('click', function() {
    const alarmTime = alarmTimeInput.value;
    const reminderTime = reminderSelect.value !== 'none' ? parseInt(reminderSelect.value) : null;

    if (alarmTime) {
        // Check if an alarm with the same time already exists
        const existingAlarmIndex = alarms.findIndex(alarm => alarm.time === alarmTime);

        if (existingAlarmIndex !== -1) {
            showPopupMessage();
            return; // Exit if an alarm already exists
        }

        const alarm = {
            time: alarmTime,
            active: true,
            reminder: reminderTime // Save reminder time if selected
        };
        alarms.push(alarm);
        displayAlarms();
        scheduleAlarm(alarm);
    }
});

function scheduleAlarm(alarm) {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':');
    const alarmTime = new Date();
    alarmTime.setHours(hours);
    alarmTime.setMinutes(minutes);
    alarmTime.setSeconds(0);

    // If the time is earlier today, schedule for the next day
    if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const timeToAlarm = alarmTime.getTime() - now.getTime();

    if (timeToAlarm <= 0) {
        console.error("Time to alarm calculation error:", timeToAlarm);
        return; // Exit if time calculation is incorrect
    }

    // Clear any existing alarm timeout for this specific time
    const existingAlarmIndex = alarmTimeouts.findIndex(timeout => timeout.alarm.time === alarm.time);
    if (existingAlarmIndex !== -1) {
        clearTimeout(alarmTimeouts[existingAlarmIndex]?.timeout);
    }

    const alarmTimeout = setTimeout(() => {
        playAlarm(alarm);
    }, timeToAlarm);

    alarmTimeouts.push({ alarm, timeout: alarmTimeout }); // Store the timeout with reference to the alarm
}

function showNotification(alarm) {
    if (Notification.permission === "granted") {
        new Notification("Alarm", {
            body: `Alarm set for ${alarm.time} is ringing!`,
            icon: 'alarm-icon.png' // Replace with your icon URL
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Alarm", {
                    body: `Alarm set for ${alarm.time} is ringing!`,
                    icon: 'alarm-icon.png' // Replace with your icon URL
                });
            }
        });
    }
}

function playAlarm(alarm) {
    if (!ringingAlarms.includes(alarm)) {
        ringingAlarms.push(alarm);
    }

    updateStopButtonVisibility();

    // Play sound for 1 minute
    function playSoundForOneMinute() {
        alarmSound.play();
        alarmSound.loop = true;
        setTimeout(() => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
            alarmSound.loop = false;
        }, 60000);
    }

    // Play the alarm sound for the initial 1 minute
    playSoundForOneMinute();

    // Show popup notification
    showNotification(alarm);

    // If reminder is set, start reminders based on the selected time
    if (alarm.reminder) {
        const reminderInterval = setInterval(() => {
            if (ringingAlarms.includes(alarm)) {
                playSoundForOneMinute();
                showNotification(alarm);
            } else {
                clearInterval(reminderInterval);
            }
        }, alarm.reminder * 60000);
        reminderIntervals.push(reminderInterval);
    }
}

// Update visibility of Stop button based on active alarms
function updateStopButtonVisibility() {
    if (ringingAlarms.length > 0) {
        stopAlarmBtn.style.display = 'block';
    } else {
        stopAlarmBtn.style.display = 'none';
    }
}

// Stop the alarm and clear intervals
stopAlarmBtn.addEventListener('click', stopAlarm);

function stopAlarm() {
    ringingAlarms.forEach(alarm => {
        alarm.active = false; // Deactivate each ringing alarm
    });
    ringingAlarms = []; // Clear the list of ringing alarms
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmSound.loop = false; // Ensure looping is turned off
    updateStopButtonVisibility(); // Update button visibility

    // Clear all reminder intervals
    reminderIntervals.forEach(interval => clearInterval(interval));
    reminderIntervals = [];
}

function deleteAlarm(index) {
    // Clear the timeout for the alarm
    clearTimeout(alarmTimeouts[index]?.timeout);
    // Remove the alarm from the array
    alarms.splice(index, 1);
    alarmTimeouts.splice(index, 1);
    // Re-render the alarm list
    displayAlarms();
}

function displayAlarms() {
    alarmList.innerHTML = ''; // Clear the existing list

    if (alarms.length === 0) {
        alarmList.innerHTML = '<li>No alarms set</li>'; // Display a message if there are no alarms
    } else {
        alarms.forEach((alarm, index) => {
            if (alarm && alarm.time) { // Ensure the alarm object and time are valid
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${alarm.time} 
                    <button class="delete-btn" onclick="deleteAlarm(${index})">🗑️</button>
                `;
                alarmList.appendChild(listItem);
            }
        });
    }

    updateStopButtonVisibility(); // Update the Stop button visibility based on the current alarms
}

// Display alarms on page load
window.addEventListener('load', displayAlarms);

// Screen Change

const themeToggleBtn = document.getElementById('themeToggleBtn');
const currentHour = new Date().getHours();

// Function to apply the correct theme automatically based on the current time
function applyAutoTheme() {
    if (currentHour >= 16 || currentHour < 4) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

// Function to toggle the theme manually
themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
    // Save the user's preference in localStorage
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Check if the user has a manually selected theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme + '-mode');
} else {
    // Apply auto theme if no manual preference is set
    applyAutoTheme();
}

// Automatically update the theme based on the time of day
setInterval(() => {
    const currentHour = new Date().getHours();
    if (!localStorage.getItem('theme')) { // Only auto-switch if no manual theme is selected
        applyAutoTheme();
    }
}, 60 * 60 * 1000); // Check every hour


// CHANGE CLOCK DESIGN FOR DARK MODE AND LIGHT MODE

// Function to apply light or dark mode based on time
function applyModeBasedOnTime() {
  const currentHour = new Date().getHours();
  if (currentHour >= 16 || currentHour < 4) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

// Function to manually toggle mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('preferredMode', isDarkMode ? 'dark' : 'light');
}

// On page load, check the saved mode or apply based on time
window.onload = function () {
  const savedMode = localStorage.getItem('preferredMode');
  if (savedMode) {
    document.body.classList.add(`${savedMode}-mode`);
  } else {
    applyModeBasedOnTime();
  }
};

// Add event listener to toggle mode button
document.getElementById('toggleModeBtn').addEventListener('click', toggleMode);

