const navigationSections = document.querySelectorAll(".navigationSection");
const availability = document.querySelector(".availabilityTitle");
const availableSlots = document.querySelector(".timeSlots");


let workingHours = ["10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm"];
let reservedSlots = [];

let currentDate = "";
let reservedYear = "";
let reservedMonth = "";
let reservedDay = "";
let reservedTime = "";



navigationSections.forEach((section) => {
    section.addEventListener("click", () => {
        navigationSections.forEach((section) => section.classList.remove("active"));
        section.classList.add("active");
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 450,
      aspectRatio: 2,
      width: 650,
      dateClick: function(info) {
        const DateNow = new Date(); // Current date
        let currentYear = DateNow.getFullYear();
        let currentMonth = DateNow.getMonth(); // 0-based, Jan = 0, Feb = 1, etc.
        let currentDay = DateNow.getDate(); // 1-based

        currentDate = info.dateStr; // Selected date string
        const { year, month, day } = parseDateString(currentDate); // Function to parse the selected date
        let selectedDate = new Date(year, month - 1, day); // Create Date object for selected date
        let currentDateObj = new Date(currentYear, currentMonth, currentDay); 

        // If the selected date is today or in the future, allow selection
        if (selectedDate >= currentDateObj){
            var allDays = document.querySelectorAll('.fc-daygrid-day');

            allDays.forEach(function(day) {
                day.classList.remove('selected');
            });
            info.dayEl.classList.add('selected');


            reservedYear = year;
            reservedMonth = month;
            reservedDay = day;
            reservedTime = "";

            const selectedDate = info.date;
            const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
            displayAvailableSlots();
        } else{
            return;
        }

        
      }
    });
    calendar.render();
  });


window.onload = () => {
    const currentDate = new Date();
    const weekday = currentDate.getDay();
    const date = currentDate.getDate();
    const month = currentDate.getMonth();
 
    // Get the full weekday and month names using arrays
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the full weekday name and month name
    const weekdayName = weekdayNames[weekday];
    const monthName = monthNames[month];

    // Format the date as "Friday, March 28"
    const formattedDate = `${weekdayName}, ${monthName} ${date}`;
    availability.textContent = `Availability for, ${formattedDate}`;

    // Get today's date
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    displayAvailableSlots();
};


document.addEventListener("DOMContentLoaded", function () {
    const showcaseElements = document.querySelectorAll(".showcaseDesign");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.5 });

    showcaseElements.forEach(element => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", function () {
    const elementsToAnimate = document.querySelectorAll(".crossSectionImage, .proccessSectionContainer");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.5 });

    elementsToAnimate.forEach(element => observer.observe(element));
});

document.addEventListener("DOMContentLoaded", function () {
    const serviceElements = document.querySelectorAll(".service");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.5 });

    serviceElements.forEach(element => observer.observe(element));
});



// Function to convert "YYYY-MM-DD" string into an object
function parseDateString() {
    const [year, month, day] = currentDate.split('-');
    return { year, month, day };
}

// Function to display available slots
function displayAvailableSlots() {
    if (!availableSlots) {
        console.error("Element with class 'timeSlots' not found.");
        return;
    }

    availableSlots.innerHTML = ''; 

    // Convert selected date string to an object
    const { year, month, day } = parseDateString();

    // Get reserved slots for this date
    const reservedTimes = reservedSlots
        .filter(slot => slot.year === year && slot.month === month && slot.day === day)
        .map(slot => slot.slot);

    // Get available slots
    const availableSlotsList = workingHours.filter(slot => !reservedTimes.includes(slot));

    if (availableSlotsList.length > 0) {
        availableSlotsList.forEach(workingHour => {
            const timeSlotDiv = document.createElement('div');
            timeSlotDiv.classList.add('timeSlot');
            timeSlotDiv.innerHTML = `<p class="timeSlotTime">${workingHour}</p>`;

            timeSlotDiv.addEventListener("click", () => {
                document.querySelectorAll(".timeSlot").forEach(element => {
                    element.classList.remove("active");
                });
                timeSlotDiv.classList.add("active");
                reservedTime = timeSlotDiv.textContent;
            });

            availableSlots.appendChild(timeSlotDiv);
        });
    } else {
        availableSlots.innerHTML = '<p>No available slots for this day.</p>';
    }
}


function showPopup(message, isSuccess) {
    // Remove any existing popups before creating a new one
    const existingPopup = document.querySelector(".popup");
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;

    if (isSuccess) {
        popup.classList.add("success");
    } else {
        popup.classList.add("error");
    }

    document.body.appendChild(popup);

    // Slide in the popup from the right
    setTimeout(() => {
        popup.classList.add("visible");
    }, 10);

    // Remove the popup after 5 seconds
    setTimeout(() => {
        popup.classList.remove("visible");
        setTimeout(() => popup.remove(), 500); // Ensure it fades out smoothly
    }, 5000);
}

function onReservation() {
    if (!reservedYear || !reservedMonth || !reservedDay || !reservedTime) {
        showPopup("❌ Please select a date and time before reserving!", false);
        return;
    }

    reservedSlots.push({
        year: reservedYear,
        month: reservedMonth,
        day: reservedDay,
        slot: reservedTime
    });

    reservedTime = "";

    displayAvailableSlots();
    showPopup("✅ Reservation successful! Thank you! 🎉", true);
}
