// Initialize global variables
const currentMonthDisplay = document.getElementById("current-month");
const calendarBody = document.getElementById("calendar-body");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const bookingModal = document.getElementById("booking-modal");
const closeModal = document.querySelector(".close");
const saveBookingBtn = document.getElementById("save-booking");
const deleteBookingBtn = document.getElementById("delete-booking");
const modalDateElement = document.getElementById("modal-date");
const bookingReasonInput = document.getElementById("booking-reason");

let currentDate = new Date(); //initialize current date with date function
let bookings = JSON.parse(localStorage.getItem("bookings")) || {}; //variable to help retrieve bookings from local storage

// Function to generate calendar
function generateCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  currentMonthDisplay.innerText = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  // Get first day and number of days in the month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Clear previous calendar content
  calendarBody.innerHTML = "";
  let row = document.createElement("tr");

  // Fill in the empty spaces before the first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("td");
    row.appendChild(emptyCell);
  }

  // Create day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("td");
    cell.innerText = day;
    const dateKey = `${year}-${month + 1}-${day}`;

    // Check if the date is booked and add visual indicator
    if (bookings[dateKey]) {
      cell.classList.add("booked");
    }

    // Add click event for booking modal
    cell.addEventListener("click", () => openBookingModal(dateKey));
    row.appendChild(cell);

    // Start a new row every 7 days
    if ((day + firstDay) % 7 === 0) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }
  }

  // Append the last row
  if (row.children.length > 0) {
    calendarBody.appendChild(row);
  }
}

// Open booking modal
function openBookingModal(dateKey) {
  modalDateElement.innerText = `Booking for: ${dateKey}`;
  bookingReasonInput.value = bookings[dateKey] || "";
  bookingModal.style.display = "flex";

  saveBookingBtn.onclick = () => {
    const reason = bookingReasonInput.value.trim();
    
    if(reason) {
      bookings[dateKey] = reason;
      localStorage.setItem("bookings", JSON.stringify(bookings));
      bookingModal.style.display = "none";
      generateCalendar(currentDate); // Refresh calendar to display booked date
    }
    else if(reason == false) {
      alert("You must enter a reason for the booking!");
    }
  };
}

// Close modal
closeModal.onclick = () => {
  bookingModal.style.display = "none";
};

// Previous and Next month navigation
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate);
});

// Initial calendar load
generateCalendar(currentDate);
