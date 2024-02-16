document.addEventListener('DOMContentLoaded', function() {
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    const labDropdown = document.querySelector('.lab-dropdown');
    const searchTimeInput = document.querySelector('.search-time');
    const searchButton = document.querySelector('.search-button');

    function createLabs(searchDate = null, searchTime = null, searchLab = null) {
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

        const reservedSeats = {
            10: [[0, 3, 'Sofia Rivera', 'user-profile.html'], [30, 5, 'Diego Garcia', 'user-profile.html']],
            14: [[0, 2, 'Anon.', '#profileUserC']],
        };

        for (let hour = 9; hour <= 17; hour++) {
            for (let mins = 0; mins < 60; mins += 30) {
                const time = `${hour % 12 === 0 ? 12 : hour % 12}:${mins === 0 ? '00' : mins}${hour >= 12 ? ' PM' : ' AM'}`;
                if (!searchTime || time === searchTime) {
                    const row = document.createElement('tr');
                    const timeSlot = document.createElement('td');
                    timeSlot.textContent = time;
                    row.appendChild(timeSlot);

                    for (let j = 1; j <= numberOfSeats; j++) {
                        const seatSlot = document.createElement('td');
                        seatSlot.className = 'seat-slot available';

                        if (reservedSeats[hour] && reservedSeats[hour].some(reservation => reservation[0] === mins && reservation[1] === j)) {
                            const reservation = reservedSeats[hour].find(reservation => reservation[0] === mins && reservation[1] === j);
                            seatSlot.className = 'seat-slot reserved';
                            const userLink = document.createElement('a');
                            userLink.href = reservation[3]; 
                            userLink.textContent = reservation[2]; 
                            userLink.title = reservation[2]; 
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
        }

        timeSlotsContainer.appendChild(table);
    }

    function populateLabDropdown() {
        for (let i = 1; i <= 3; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Lab ${i}`;
            labDropdown.appendChild(option);
        }
    }

    function handleSearch() {
        const searchDate = searchDateInput.value;
        const searchTime = searchTimeInput.value;
        const searchLab = labDropdown.value; 
        createLabs(searchDate, searchTime, searchLab);
    }
    
    function setCurrentWeekForDateInput() {
        const currentDate = new Date();
        const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
        const lastDayOfWeek = firstDayOfWeek + 6; 
    
        const startDate = new Date(currentDate.setDate(firstDayOfWeek));
        const endDate = new Date(currentDate.setDate(lastDayOfWeek));
    
        const formatDate = (date) => date.toISOString().split('T')[0];
    
        const searchDateInput = document.querySelector('.search-date');
        searchDateInput.setAttribute('min', formatDate(startDate));
        searchDateInput.setAttribute('max', formatDate(endDate));
    }

    function populateTimeDropdown() {
        const timeDropdown = document.querySelector('.search-time');
        timeDropdown.innerHTML = ''; 
        
        const startHour = 9;
        const endHour = 18;
    
        for (let hour = startHour; hour < endHour; hour++) {
            let displayHour = hour > 12 ? hour - 12 : hour;
            let amPm = hour >= 12 ? 'PM' : 'AM';
            
            let option = document.createElement('option');
            option.value = `${hour}:00`;
            option.textContent = `${displayHour}:00 ${amPm}`;
            timeDropdown.appendChild(option);
    
            option = document.createElement('option');
            option.value = `${hour}:30`;
            option.textContent = `${displayHour}:30 ${amPm}`;
            timeDropdown.appendChild(option);
        }
    }

    searchButton.addEventListener('click', handleSearch);
    
    labDropdown.addEventListener('change', () => {
        createLabs(searchDateInput.value, searchTimeInput.value, labDropdown.value);
    });
    
    setCurrentWeekForDateInput();
    createLabs();
    populateLabDropdown();
    populateTimeDropdown();
});
