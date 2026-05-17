const calendarDates = document.getElementById("calendarDates");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();

function renderCalendar(date){
    calendarDates.innerHTML = "";
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    monthYear.textContent =
        `${monthNames[month]} ${year}`;


    for(let i = 0; i < firstDay; i++){

        const emptyDiv = document.createElement("div");

        emptyDiv.classList.add(
            "calendar-day",
            "empty"
        );
        calendarDates.appendChild(emptyDiv);

    }


    for(let day = 1; day <= lastDate; day++){

        const dayDiv = document.createElement("div");

        dayDiv.classList.add("calendar-day");


        const today = new Date();

        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            dayDiv.classList.add("today");
        }

        dayDiv.innerHTML = `
                <div class="calendar-date">
                    ${day}
                </div>
            `;

        calendarDates.appendChild(dayDiv);

    }

}


document
    .getElementById("prevMonth")
    .addEventListener("click", () => {
        currentDate.setMonth(
            currentDate.getMonth() - 1
        );
        renderCalendar(currentDate);

    });


document
    .getElementById("nextMonth")
    .addEventListener("click", () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );
        renderCalendar(currentDate);
    });
renderCalendar(currentDate);

