const selectedSeats = [];
const reservedSeats = [
    { labNumber: '1', timeSlot: '10:00 AM', seatNumber: 'Seat 3', name: 'Sofia Rivera', profile: 'user-profile.html' },
    { labNumber: '1', timeSlot: '10:30 AM', seatNumber: 'Seat 2', name: 'Diego Garcia', profile: 'user-profile.html' },
    { labNumber: '1', timeSlot: '2:00 PM', seatNumber: 'Seat 3', name: 'Anon.', profile: '#profileUserC' }
];

document.addEventListener('DOMContentLoaded', function() {
    const selectedDateElement = document.querySelector('.selected-date');
    const prevDateButton = document.querySelector('.prev-date');
    const nextDateButton = document.querySelector('.next-date');
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    const proceedButton = document.querySelector('.proceed-button');
    const labDropdown = document.querySelector('.lab-dropdown');
    const selectedSlotsContainer = document.querySelector('.selected-slots');
	const usernameInput = document.querySelector('.name');
	const calendarContainer = document.querySelector('.calendar-container');


    let currentDate = new Date();

	proceedButton.addEventListener('click', proceedWithReservation);

    labDropdown.addEventListener('change', createLabs);

    function updateSelectedDate() {
        selectedDateElement.textContent = currentDate.toDateString();
    }

	function generateWeekCalendar() {
        calendarContainer.innerHTML = '';
    
        let startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
    
            const dateButton = document.createElement('button');
            dateButton.classList.add('date-button', 'calendar-day');
            dateButton.textContent = date.toDateString();
            dateButton.value = date.toISOString().split('T')[0];
    
            dateButton.addEventListener('click', function() {
                currentDate = new Date(this.value);
                updateSelectedDate();
                createLabs(); 
            });
    
            calendarContainer.appendChild(dateButton);
        }
    }
    
    function createLabs() {
        const numberOfSeats = 10; 
        timeSlotsContainer.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'time-slots-table';

        const headerRow = document.createElement('tr');
        const timeHeader = document.createElement('th');
        timeHeader.textContent = 'Time';
        headerRow.appendChild(timeHeader);

        for (let i = 1; i <= numberOfSeats; i++) {
            const seatHeader = document.createElement('th');
            seatHeader.textContent = `Seat ${i}`;
            headerRow.appendChild(seatHeader);
        }
        table.appendChild(headerRow);

        for (let hour = 9; hour <= 17; hour++) {
			for (let mins = 0; mins < 60; mins += 30) {
				const row = document.createElement('tr');
				const timeSlot = document.createElement('td');
				timeSlot.textContent = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? ' PM' : ' AM'}`;
				row.appendChild(timeSlot);

				for (let j = 1; j <= numberOfSeats; j++) {
					const seatSlot = document.createElement('td');
					seatSlot.className = 'seat-slot available';

					const reservedSeat = reservedSeats.find(seat => seat.labNumber === hour && seat.timeSlot === mins && seat.seatNumber === j);
					if (reservedSeat) {
						seatSlot.className = 'seat-slot reserved';
						const userLink = document.createElement('a');
						userLink.href = reservedSeat.profile; 
						userLink.textContent = reservedSeat.name; 
						userLink.title = reservedSeat.name; 
						userLink.style.color = 'white'; 
						userLink.style.textDecoration = 'none'; 
						seatSlot.innerHTML = '';
						seatSlot.appendChild(userLink); 
					}
					row.appendChild(seatSlot);
				}
				table.appendChild(row);
			}
		}
        timeSlotsContainer.appendChild(table);
		updateReservedSeats();
    }
    
    function proceedWithReservation() {
		const name = usernameInput.value;
		if(!name) {
			name = "Anon.";
		}

		selectedSeats.forEach(seat => {
			seat.name = name;
			seat.profile = '#profileUserA';
		});
		
		selectedSlotsContainer.innerHTML = "<h3>Selected Slots:</h3>";
		usernameInput.value = "";
		reservedSeats.push(...selectedSeats);
		selectedSeats.length = 0;
		createLabs();
	}
    
    function populateLabDropdown() {
        for (let i = 1; i <= 3; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Lab ${i}`;
            labDropdown.appendChild(option);
        }
    }
    
    timeSlotsContainer.addEventListener('click', function(event) {
        const clickedCell = event.target;
        if (clickedCell.classList.contains('seat-slot')) {
			if (!clickedCell.textContent.trim()) {
				clickedCell.classList.toggle('selected');
				const table = clickedCell.closest('table');
				const labNumber = labDropdown.options[labDropdown.selectedIndex].value;
				const timeSlot = clickedCell.parentNode.children[0].textContent;
				const seatNumber = table.querySelector('tr').cells[clickedCell.cellIndex].textContent;
				const seat = clickedCell;
				const seatData = {
					labNumber: labNumber,
					timeSlot: timeSlot,
					seatNumber: seatNumber,
					name: '',
					profile: ''
				};
				
				let isReserved = reservedSeats.some(seat => {
					return seat.labNumber === parseInt(labNumber) && 
						   seat.timeSlot === parseInt(timeSlot) && 
						   seat.seatNumber === parseInt(seatNumber);
				});

				if (isReserved) {
					alert('This seat is already reserved.');
				} else {
					const selectedIndex = selectedSeats.findIndex(item => item.seat === clickedCell);
					if (selectedIndex !== -1) {
						selectedSeats.splice(selectedIndex, 1);
					} else {
						selectedSeats.push(seatData);
					}
					updateSelectedSeats();
				}
			}
		}
	});

    function updateSelectedSeats() {
        selectedSlotsContainer.innerHTML = "Selected Seats: <br>" + selectedSeats.map(seatData => {
            return `Lab ${seatData.labNumber}, Time: ${seatData.timeSlot}, ${seatData.seatNumber}`;
        }).join("<br>");
		
		selectedSeats.forEach(seat => {
			const seatRowIndex = parseInt(seat.seatNumber.split(' ')[1]);
			let timeColumnIndex = -1;
			const seatTimeSlot = seat.timeSlot;
			const rows = document.querySelectorAll('.time-slots-container tr');

			rows.forEach((row, rowIndex) => {
				const timeCell = row.querySelector('td:first-child');
				if (timeCell && timeCell.textContent.trim() === seatTimeSlot) {
					timeColumnIndex = rowIndex;
				}
			});
	
			const table = document.querySelector('.time-slots-container table');
			const row = table.rows[timeColumnIndex];
			const cell = row.cells[seatRowIndex];
			
			cell.style.backgroundColor = '#ECA625';
		});
    }
	
	function updateReservedSeats() {
		reservedSeats.forEach(seat => {
			const seatRowIndex = parseInt(seat.seatNumber.split(' ')[1]);
			let timeColumnIndex = -1;
			const seatTimeSlot = seat.timeSlot;
			const rows = document.querySelectorAll('.time-slots-container tr');

			rows.forEach((row, rowIndex) => {
				const timeCell = row.querySelector('td:first-child');
				if (timeCell && timeCell.textContent.trim() === seatTimeSlot) {
					timeColumnIndex = rowIndex;
				}
			});
	
			const table = document.querySelector('.time-slots-container table');
			const row = table.rows[timeColumnIndex];
			const cell = row.cells[seatRowIndex];
			
			cell.textContent = seat.name;
			cell.style.color = 'white';
			cell.style.backgroundColor = '#ED2B2B';
			
			cell.addEventListener('click', function() {
				window.location.href = seat.profile;
			});
		});
	}
    
    updateSelectedDate();
    createLabs();
    populateLabDropdown();
	generateWeekCalendar();
});