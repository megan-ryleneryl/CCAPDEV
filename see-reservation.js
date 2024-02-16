document.addEventListener('DOMContentLoaded', () => {
    let reservations = [
        { lab: 'Lab 1', timeSlot: '09:00 AM', seatNo: 1, user: 'Juan dela Cruz', requestDateTime: '2023-10-01 08:00', reservationDateTime: '2023-10-03 09:00'},
		{ lab: 'Lab 2', timeSlot: '09:30 AM', seatNo: 2, user: 'Maria Santos', requestDateTime: '2023-10-02 08:30', reservationDateTime: '2023-10-03 09:30'},
		{ lab: 'Lab 3', timeSlot: '10:00 AM', seatNo: 3, user: 'Pedro Reyes', requestDateTime: '2023-10-03 09:00', reservationDateTime: '2023-10-04 10:00'},
		{ lab: 'Lab 1', timeSlot: '10:30 AM', seatNo: 4, user: 'Sofia Rivera', requestDateTime: '2023-10-04 10:30', reservationDateTime: '2023-10-06 10:30'},
		{ lab: 'Lab 2', timeSlot: '11:00 AM', seatNo: 5, user: 'Diego Garcia', requestDateTime: '2023-10-05 11:00', reservationDateTime: '2023-10-07 11:00'},
		{ lab: 'Lab 3', timeSlot: '11:30 AM', seatNo: 6, user: 'Juan dela Cruz', requestDateTime: '2023-10-06 11:30', reservationDateTime: '2023-10-08 11:30'},
		{ lab: 'Lab 1', timeSlot: '12:00 PM', seatNo: 7, user: 'Maria Santos', requestDateTime: '2023-10-07 12:00', reservationDateTime: '2023-10-09 12:00'},
		{ lab: 'Lab 2', timeSlot: '12:30 PM', seatNo: 8, user: 'Pedro Reyes', requestDateTime: '2023-10-08 12:30', reservationDateTime: '2023-10-10 12:30'},
		{ lab: 'Lab 3', timeSlot: '01:00 PM', seatNo: 9, user: 'Sofia Rivera', requestDateTime: '2023-10-09 13:00', reservationDateTime: '2023-10-11 13:00'},
		{ lab: 'Lab 1', timeSlot: '01:30 PM', seatNo: 10, user: 'Diego Garcia', requestDateTime: '2023-10-10 13:30', reservationDateTime: '2023-10-12 13:30'},
		{ lab: 'Lab 2', timeSlot: '02:00 PM', seatNo: 1, user: 'Juan dela Cruz', requestDateTime: '2023-10-11 14:00', reservationDateTime: '2023-10-13 14:00'},
		{ lab: 'Lab 3', timeSlot: '02:30 PM', seatNo: 2, user: 'Maria Santos', requestDateTime: '2023-10-12 14:30', reservationDateTime: '2023-10-14 14:30'},
		{ lab: 'Lab 1', timeSlot: '03:00 PM', seatNo: 3, user: 'Pedro Reyes', requestDateTime: '2023-10-13 15:00', reservationDateTime: '2023-10-15 15:00'},
		{ lab: 'Lab 2', timeSlot: '03:30 PM', seatNo: 4, user: 'Sofia Rivera', requestDateTime: '2023-10-14 15:30', reservationDateTime: '2023-10-16 15:30'},
		{ lab: 'Lab 3', timeSlot: '04:00 PM', seatNo: 5, user: 'Diego Garcia', requestDateTime: '2023-10-15 16:00', reservationDateTime: '2023-10-17 16:00'},
		{ lab: 'Lab 1', timeSlot: '04:30 PM', seatNo: 6, user: 'Juan dela Cruz', requestDateTime: '2023-10-16 16:30', reservationDateTime: '2023-10-18 16:30'},
		{ lab: 'Lab 2', timeSlot: '05:00 PM', seatNo: 7, user: 'Maria Santos', requestDateTime: '2023-10-17 17:00', reservationDateTime: '2023-10-19 17:00'},
		{ lab: 'Lab 3', timeSlot: '05:30 PM', seatNo: 8, user: 'Pedro Reyes', requestDateTime: '2023-10-18 17:30', reservationDateTime: '2023-10-20 17:30'},
		{ lab: 'Lab 1', timeSlot: '06:00 PM', seatNo: 9, user: 'Sofia Rivera', requestDateTime: '2023-10-19 18:00', reservationDateTime: '2023-10-21 18:00'},
		{ lab: 'Lab 2', timeSlot: '06:30 PM', seatNo: 10, user: 'Diego Garcia', requestDateTime: '2023-10-20 18:30', reservationDateTime: '2023-10-22 18:30'}
    ];

    populateTable(reservations);

    document.getElementById('labFilter').addEventListener('change', function() {
        filterAndSortReservations();
    });

    document.getElementById('sortSelect').addEventListener('change', function() {
        filterAndSortReservations();
    });

    function filterAndSortReservations() {
        let filteredReservations = filterReservations(reservations);
        let sortedReservations = sortReservations(filteredReservations);
        populateTable(sortedReservations);
    }

    function filterReservations(reservations) {
        let labFilter = document.getElementById('labFilter').value;
        return reservations.filter(reservation => labFilter === '0' || reservation.lab === `Lab ${labFilter}`);
    }

    function sortReservations(reservations) {
        let sortValue = document.getElementById('sortSelect').value;
        return reservations.sort((a, b) => {
            if (a[sortValue] < b[sortValue]) return -1;
            if (a[sortValue] > b[sortValue]) return 1;
            return 0;
        });
    }

    function populateTable(reservations) {
        const tableBody = document.getElementById('reservationsTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; 
        reservations.forEach(reservation => {
            let row = tableBody.insertRow();
            ['lab', 'timeSlot', 'seatNo', 'user','requestDateTime', 'reservationDateTime'].forEach(field => {
                let cell = row.insertCell();
                cell.textContent = reservation[field];
            });
        });
    }
});