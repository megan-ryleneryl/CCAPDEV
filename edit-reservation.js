document.addEventListener('DOMContentLoaded', function() {
  const reservationsTableBody = document.querySelector('#reservations tbody');
  const editFormContainer = document.getElementById('editFormContainer');
  
  let reservationData = [
	  { lab: 'Lab 1', time: '9:00 AM', seat: 1, user: 'Juan dela Cruz' },
	  { lab: 'Lab 2', time: '9:30 AM', seat: 2, user: 'Maria Santos' },
	  { lab: 'Lab 3', time: '10:00 AM', seat: 3, user: 'Pedro Reyes' },
	  { lab: 'Lab 1', time: '10:30 AM', seat: 4, user: 'Sofia Rivera' },
	  { lab: 'Lab 2', time: '11:00 AM', seat: 5, user: 'Diego Garcia' },
	  { lab: 'Lab 3', time: '11:30 AM', seat: 6, user: 'Juan dela Cruz' },
	  { lab: 'Lab 1', time: '12:00 PM', seat: 7, user: 'Maria Santos' },
	  { lab: 'Lab 2', time: '12:30 PM', seat: 8, user: 'Pedro Reyes' },
	  { lab: 'Lab 3', time: '1:00 PM', seat: 9, user: 'Sofia Rivera' },
	  { lab: 'Lab 1', time: '1:30 PM', seat: 10, user: 'Diego Garcia' },
	  { lab: 'Lab 2', time: '2:00 PM', seat: 1, user: 'Juan dela Cruz' },
	  { lab: 'Lab 3', time: '2:30 PM', seat: 2, user: 'Maria Santos' },
	  { lab: 'Lab 1', time: '3:00 PM', seat: 3, user: 'Pedro Reyes' },
	  { lab: 'Lab 2', time: '3:30 PM', seat: 4, user: 'Sofia Rivera' },
	  { lab: 'Lab 3', time: '4:00 PM', seat: 5, user: 'Diego Garcia' },
	  { lab: 'Lab 1', time: '4:30 PM', seat: 6, user: 'Juan dela Cruz' },
	  { lab: 'Lab 2', time: '5:00 PM', seat: 7, user: 'Maria Santos' },
	  { lab: 'Lab 3', time: '5:30 PM', seat: 8, user: 'Pedro Reyes' },
	  { lab: 'Lab 1', time: '6:00 PM', seat: 9, user: 'Sofia Rivera' },
	  { lab: 'Lab 2', time: '6:30 PM', seat: 10, user: 'Diego Garcia' }
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
        <td><button class="editButton" data-id="${reservation.id}">Edit</button></td>
      `;
      reservationsTableBody.appendChild(row);
    });
  }
  
	document.getElementById('labFilter').addEventListener('change', function() {
        filterAndSortReservations();
    });

    document.getElementById('sortSelect').addEventListener('change', function() {
        filterAndSortReservations();
    });

    function filterAndSortReservations() {
        let filteredReservations = filterReservations(reservationData);
        let sortedReservations = sortReservations(filteredReservations);
        populateTable(sortedReservations);
    }

    function filterReservations(reservationData) {
        let labFilter = document.getElementById('labFilter').value;
        return reservationData.filter(reservation => labFilter === '0' || reservation.lab === `Lab ${labFilter}`);
    }

    function sortReservations(reservationData) {
        let sortValue = document.getElementById('sortSelect').value;
        return reservationData.sort((a, b) => {
            if (a[sortValue] < b[sortValue]) return -1;
            if (a[sortValue] > b[sortValue]) return 1;
            return 0;
        });
    }
	
	function populateTable(reservationData) {
        const tableBody = document.getElementById('reservations').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; 
        reservationData.forEach(reservation => {
            let row = tableBody.insertRow();
			['lab', 'time', 'seat', 'user', 'id'].forEach(field => {
				let cell = row.insertCell();
				if (field === 'id') {
					cell.innerHTML = `<button class="editButton" data-id="${reservation[field]}">Edit</button>`;
				} else {
					cell.textContent = reservation[field];
				}
            });
        });
    }

  displayReservations();

  document.getElementById('reservations').addEventListener('click', function(event) {
    if (event.target.classList.contains('editButton')) {
      const rowIndex = event.target.parentNode.parentNode.rowIndex - 1; // Adjust index to account for table header
      const reservation = reservationData[rowIndex];
      if (reservation) {
        showEditForm(reservation, rowIndex);
      }
    }
  });

  function showEditForm(reservation) {
    const editForm = `
      <form id="editForm">
        <label for="editLab">Lab:</label>
        <input type="text" id="editLab" name="editLab" value="${reservation.lab}"><br><br>
        <label for="editTime">Time Slot:</label>
        <input type="text" id="editTime" name="editTime" value="${reservation.time}"><br><br>
        <label for="editSeat">Seat No.:</label>
        <input type="text" id="editSeat" name="editSeat" value="${reservation.seat}"><br><br>
        <label for="editUser">User:</label>
        <input type="text" id="editUser" name="editUser" value="${reservation.user}"><br><br>
        <button type="submit">Save</button>
      </form>
    `;
    editFormContainer.innerHTML = editForm;
    editFormContainer.style.display = 'block';
    
    const editFormElement = document.getElementById('editForm');
    editFormElement.addEventListener('submit', function(event) {
      event.preventDefault();
      const editedReservation = {
        ...reservation,
        seat: parseInt(editFormElement.elements.editSeat.value)
      };
      updateReservation(editedReservation);
    });
  }

  function updateReservation(editedReservation, rowIndex) {
	  reservationData[rowIndex] = editedReservation;
	  editFormContainer.style.display = 'none';
	  displayReservations();
	}
  
  displayReservations();
});
