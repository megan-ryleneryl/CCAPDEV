// Add event listeners to the filters
document.getElementById('date-selector').addEventListener('change', refreshReservations);
document.getElementById('lab-selector').addEventListener('change', refreshReservations);

async function refreshReservations() {
    // Get selected date and lab values
    const selectedDate = document.getElementById('date-selector').value;
    const selectedLab = document.getElementById('lab-selector').value;
    const table = document.getElementById('timeslots-table')

    try {
        const response = await fetch(`/homepage/refresh?date=${selectedDate}&lab=${selectedLab}`);
        const newData = await response.json();
        console.log(newData);

        table.innerHTML = '';

        // For the header row
        const headerRow = document.createElement('tr');
        const timeslotHeader = document.createElement('th');
        timeslotHeader.textContent = 'Timeslot';
        headerRow.appendChild(timeslotHeader);

        newData.seats.forEach(seat => {
            const seatHeader = document.createElement('th');
            seatHeader.textContent = `Seat ${seat}`;
            headerRow.appendChild(seatHeader);
        });

        const thead = document.createElement('thead');
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // For the body rows
        newData.timeslots.forEach(timeslot => {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = timeslot.time;
            row.appendChild(timeCell);

            timeslot.seats.forEach(seat => {
                const seatCell = document.createElement('td');
                seatCell.classList.add(seat.class);
                if (seat.reserved) {
                    const nameParagraph = document.createElement('p');
                    nameParagraph.textContent = seat.name;
                    seatCell.appendChild(nameParagraph);
                }
                row.appendChild(seatCell);
            });

            table.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}