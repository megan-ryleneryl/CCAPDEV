let selectedCells = [];

// Add event listeners to the filters
document.getElementById('date-selector').addEventListener('change', refreshReservations);
document.getElementById('lab-selector').addEventListener('change', refreshReservations);
attachEventListeners();

async function refreshReservations() {
    // Get selected date and lab values
    const selectedDate = document.getElementById('date-selector').value;
    const selectedLab = document.getElementById('lab-selector').value;
    const table = document.getElementById('timeslots-table');

    try {
        const response = await fetch(`/reserve/refresh?date=${selectedDate}&lab=${selectedLab}`);
        const newData = await response.json();
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

            // If the seat has been clicked
            timeslot.seats.forEach((seat, index) => {
                const seatCell = document.createElement('td');
                const matchingCell = selectedCells.find(cellData => {
                    return cellData.lab === selectedLab &&
                           cellData.date === selectedDate &&
                           cellData.timeslot === timeslot.time &&
                           cellData.seat === (index + 1).toString();
                });
    
                if (matchingCell) {
                    seatCell.classList.add('clicked');
                } else {
                    seatCell.classList.add(seat.class);
                }

                if (seat.reserved) {
                    const nameParagraph = document.createElement('p');
                    nameParagraph.textContent = seat.name;
                    seatCell.appendChild(nameParagraph);
                }
                row.appendChild(seatCell);
            });

            table.appendChild(row);
        });        
        attachEventListeners();
    } catch (error) {
        console.error(error);
    }
}

function attachEventListeners() {
    const allCells = document.querySelectorAll('td');
    allCells.forEach(cell => {
        cell.addEventListener('click', function(event) {
            const clickedCell = event.target;
            const table = clickedCell.closest('table');
            const selectedLab = document.getElementById('lab-selector').value;
            const selectedDate = document.getElementById('date-selector').value;
            const timeslot = clickedCell.parentNode.children[0].textContent;
            const seat = table.querySelector('tr').cells[clickedCell.cellIndex].textContent;
            const splitSeat = seat.split(' ');
            const seatNumber = splitSeat[1].trim();

            if(clickedCell.classList.contains('available')) {
                clickedCell.classList.remove('available');
                clickedCell.classList.add('clicked');
                const cellData = {
                    lab: selectedLab,
                    date: selectedDate,
                    timeslot: timeslot,
                    seat: seatNumber,
                    name: ''
                };
                selectedCells.push(cellData);
                updateSelectedSeatsDisplay();
            } else if (clickedCell.classList.contains('clicked')) {
                clickedCell.classList.remove('clicked');
                clickedCell.classList.add('available');
                selectedCells = selectedCells.filter(cellData => {
                    return !(cellData.lab === selectedLab &&
                            cellData.date === selectedDate &&
                            cellData.timeslot === timeslot &&
                            cellData.seat === seatNumber);
                });
            }
        });
    });
}

function updateSelectedSeatsDisplay() {
    const selectedSlotsContainer = document.getElementById('selected-seats-container');
    selectedSlotsContainer.innerHTML = selectedCells.map(cellData => {
        return `Lab ${cellData.lab}, ${cellData.date}, ${cellData.timeslot}, Seat ${cellData.seat}`;
    }).join("<br>");
}

function submitReservation() {
    if(selectedCells.length > 0) {
        // Set the name of the reserving user
        const name = document.getElementById('name-select').value.trim();
        for(let i = 0; i < selectedCells.length; i++) {
            selectedCells[i].name = name;
        }

        // Send to server side
        const jsonData = JSON.stringify(selectedCells);
        const url = `/reserve/submit-reservation?selectedCells=${encodeURIComponent(jsonData)}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('selected-seats-container').innerHTML = '';

                // Loop through selectedCells and set classList to 'reserved'
                selectedCells.forEach(cellData => {
                    const selector = `td[data-lab="${cellData.lab}"][data-date="${cellData.date}"][data-timeslot="${cellData.timeslot}"][data-seat="${cellData.seat}"]`;
                    const cell = document.querySelector(selector);
                    if (cell) {
                        cell.classList.remove('available');
                        cell.classList.remove('clicked');
                        cell.classList.add('reserved');
                    }
                });

                selectedCells = [];

                refreshReservations();
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
}