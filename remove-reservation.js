document.addEventListener('DOMContentLoaded', function() {
  const reservationsTableBody = document.querySelector('#reservations tbody');
  const cancelMessageDiv = document.getElementById('cancelMessage');
  const labFilterSelect = document.getElementById('labFilter');
  const sortSelect = document.getElementById('sortSelect');

  let reservationData = [
      { lab: 'Lab 1', time: '9:00 AM', seat: 1, user: 'Juan dela Cruz', status: 'Not checked in', minutesLate: 5 },
	  { lab: 'Lab 2', time: '9:30 AM', seat: 2, user: 'Maria Santos', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 3', time: '10:00 AM', seat: 3, user: 'Pedro Reyes', status: 'Not checked in', minutesLate: 7 },
	  { lab: 'Lab 1', time: '10:30 AM', seat: 4, user: 'Sofia Rivera', status: 'Not checked in', minutesLate: 20 },
	  { lab: 'Lab 2', time: '11:00 AM', seat: 5, user: 'Diego Garcia', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 3', time: '11:30 AM', seat: 6, user: 'Juan dela Cruz', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 1', time: '12:00 PM', seat: 7, user: 'Maria Santos', status: 'Not checked in', minutesLate: 10 },
	  { lab: 'Lab 2', time: '12:30 PM', seat: 8, user: 'Pedro Reyes', status: 'Not checked in', minutesLate: 0 },
	  { lab: 'Lab 3', time: '1:00 PM', seat: 9, user: 'Sofia Rivera', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 1', time: '1:30 PM', seat: 10, user: 'Diego Garcia', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 2', time: '2:00 PM', seat: 1, user: 'Juan dela Cruz', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 3', time: '2:30 PM', seat: 2, user: 'Maria Santos', status: 'Not checked in', minutesLate: 12 },
	  { lab: 'Lab 1', time: '3:00 PM', seat: 3, user: 'Pedro Reyes', status: 'Not checked in', minutesLate: 0 },
	  { lab: 'Lab 2', time: '3:30 PM', seat: 4, user: 'Sofia Rivera', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 3', time: '4:00 PM', seat: 5, user: 'Diego Garcia', status: 'Not checked in', minutesLate: 0 },
	  { lab: 'Lab 1', time: '4:30 PM', seat: 6, user: 'Juan dela Cruz', status: 'Not checked in', minutesLate: 0 },
	  { lab: 'Lab 2', time: '5:00 PM', seat: 7, user: 'Maria Santos', status: 'Not checked in', minutesLate: 40 },
	  { lab: 'Lab 3', time: '5:30 PM', seat: 8, user: 'Pedro Reyes', status: 'Checked in', minutesLate: 0 },
	  { lab: 'Lab 1', time: '6:00 PM', seat: 9, user: 'Sofia Rivera', status: 'Not checked in', minutesLate: 0 },
	  { lab: 'Lab 2', time: '6:30 PM', seat: 10, user: 'Diego Garcia', status: 'Checked in', minutesLate: 0 },
  ];
  
  function displayReservations() {
    reservationsTableBody.innerHTML = '';
    reservationData.forEach(reservation => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${reservation.lab}</td>
        <td>${reservation.time}</td>
        <td>${reservation.seat}</td>
        <td>${reservation.user}</td>
        <td>${reservation.status} (${reservation.minutesLate} minutes late)</td>
        <td>
          ${reservation.status === 'Not checked in' && reservation.minutesLate >= 10 ? 
            `<button class="cancelButton" data-lab="${reservation.lab}" data-time="${reservation.time}" data-user="${reservation.user}">Cancel Reservation</button>` : ''}
        </td>
      `;
      reservationsTableBody.appendChild(row);
    });
  }
  
	labFilterSelect.addEventListener('change', function() {
        filterAndSortReservations();
    });

    sortSelect.addEventListener('change', function() {
        filterAndSortReservations();
    });

    function filterAndSortReservations() {
        let filteredReservations = filterReservations(reservationData);
        let sortedReservations = sortReservations(filteredReservations);
        populateTable(sortedReservations);
    }

    function filterReservations(reservationData) {
        let labFilter = labFilterSelect.value;
        return reservationData.filter(reservation => labFilter === '0' || reservation.lab === `Lab ${labFilter}`);
    }

    function sortReservations(reservationData) {
        let sortValue = sortSelect.value;
        return reservationData.sort((a, b) => {
            if (a[sortValue] < b[sortValue]) return -1;
            if (a[sortValue] > b[sortValue]) return 1;
            return 0;
        });
    }
	
	function populateTable(filteredData) {
        const tableBody = document.getElementById('reservations').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; 
        filteredData.forEach(reservation => {
            let row = tableBody.insertRow();
            ['lab', 'time', 'seat', 'user', 'status', 'minutesLate'].forEach(field => {
                let cell = row.insertCell();
                cell.textContent = reservation[field];
            });
        });
    }
  
  function cancelReservation(lab, time, user) {
    cancelMessageDiv.textContent = `Reservation for ${lab}, time: ${time}, user: ${user} has been canceled.`;
    reservationData = reservationData.filter(reservation => !(reservation.lab == lab && reservation.time == time && reservation.user == user));
    displayReservations();
  }

  reservationsTableBody.addEventListener('click', function(event) {
    if (event.target.classList.contains('cancelButton')) {
      const lab = event.target.dataset.lab;
      const time = event.target.dataset.time;
      const user = event.target.dataset.user;
      cancelReservation(lab, time, user);
    }
  });

  labFilterSelect.addEventListener('change', function() {
    displayReservations();
  });

  sortSelect.addEventListener('change', function() {
    displayReservations();
  });
  
  sortSelect.addEventListener('change', function() {
    displayReservations();
  });
  
  function cancelAllLateReservations() {
    let canceledCount = 0;
    reservationData = reservationData.filter(reservation => {
      if (reservation.minutesLate >= 10) { 
        canceledCount++;
        return false; 
      }
      return true; 
    });
    displayReservations();
    cancelMessageDiv.textContent = `${canceledCount} late reservations have been canceled.`;
  }

  const cancelAllButton = document.getElementById('cancelAllButton');
  cancelAllButton.addEventListener('click', function() {
    cancelAllLateReservations();
  });
  
  displayReservations();
});

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}
