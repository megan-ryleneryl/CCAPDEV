// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Edit Profile button event
    document.getElementById('editProfileBtn').addEventListener('click', function() {
      document.getElementById('editProfileForm').style.display = 'block';
    });
  
    // Change Password button event within the form
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
      document.getElementById('currentPasswordPopup').style.display = 'block';
    });
  
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        // Populate form fields with current data
        document.getElementById('profileNameInput').value = document.getElementById('profileName').textContent;
        document.getElementById('contactNumberInput').value = document.getElementById('contactNumber').textContent;
        document.getElementById('emailInput').value = document.getElementById('email').textContent;
        document.getElementById('biographyInput').value = document.getElementById('biography').textContent;
        
        // Display the form
        document.getElementById('editProfileForm').style.display = 'block';
      });      

    // Confirm Current Password button event
    document.getElementById('confirmPasswordBtn').addEventListener('click', function() {
        var currentPassword = document.getElementById('currentPasswordInput').value;
        var newPassword = document.getElementById('newPasswordInput').value;
        // Here you would verify the current password and then update to the new password on the server
        // After updating the password:
        hideCurrentPasswordPopup();
        // You may want to add feedback for the user here, like an alert or a message showing success/failure
    });
  
  
    // Saving changes (submitting the edit profile form)
    document.getElementById('profileForm').addEventListener('submit', function(event) {
      event.preventDefault();
      // Process form data and send to server
      hideEditProfileForm();
      // Handle response and update UI accordingly
    });
  
    // Delete Account button event
    document.getElementById('deleteAccountBtn').addEventListener('click', function() {
      document.getElementById('deletePopup').style.display = 'block';
    });
  
    // Confirm Delete button event
    document.getElementById('confirmDelete').addEventListener('click', function() {
      var password = document.getElementById('confirmPassword').value;
      // Verify the password and handle the delete action
      window.location.href = 'index.html';
    });
  
    // Cancel Delete button event
    document.getElementById('cancelDelete').addEventListener('click', function() {
      document.getElementById('deletePopup').style.display = 'none';
    });
	
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
  
  function hideEditProfileForm() {
    document.getElementById('editProfileForm').style.display = 'none';
  }
  
  function hideCurrentPasswordPopup() {
    document.getElementById('currentPasswordPopup').style.display = 'none';
  }
  