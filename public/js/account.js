let origData = [];

function redirectToLogin() {
    // TODO: logout the current user
    window.location.href = "/login";
}

function saveChanges() {
    const form = document.getElementById('user-actions-form');
    let formData = new FormData(form);
    
    // Identify the user based on their email, and update their account details in the db
    const emailField = document.getElementById('email');
    const emailValue = emailField.placeholder.trim();
    formData.append('email', emailValue);

    fetch('/account/update', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Changes were saved successfully!');
        } else {
            console.error('Error:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteAccount() {
    // TODO: Fully implement after session handling, set userID to 10000
    const postData = {
        userID: 10000 // Set current userID here
    };

    fetch('/account/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Error:', response.status);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function editReservation(button) {
    const row = button.closest('tr'); // Get the closest row to the button clicked
    let origCells = row.cells; // Get all cells in the row

    // Iterate over each cell in the row
    for (let i = 0; i < origCells.length; i++) {
        const cell = origCells[i];
        const cellValue = cell.textContent;

        // Replace the content of the cell with an input field containing the cell's value
        if(cellValue === "Edit") {
            cell.innerHTML = `<button class="save-button" onclick="saveEditedData(this)" class="save-button">Done</button>`;
        } else if(cellValue === "Delete") {
            const deleteButton = cell.querySelector('.delete-button');
            deleteButton.style.display = 'none';
        }
        else {
            origData.push(cellValue);
            cell.innerHTML = `<input type="text" value="${cellValue}" required>`;
        }
    }
}

function saveEditedData(button) {
    const row = button.closest('tr'); 
    const updatedCells = row.cells;
    const updatedData = [];
    let valid = true;

    // Manually check if the important data cells are empty
    for(let i = 0; i < 7; i++) {
        const input = updatedCells[i].querySelector('input');
        if(input.value.trim() === '') {
            valid = false; 
        }
    }

    // Prepare the first half of the array to be passed to served (for original reservation data)
    for(let i = 0; i < origData.length; i++) {
        updatedData.push(origData[i]);
    }

    // If there are no problems with blank data, load the second half of the array (new reservation values)
    if(valid) {
        // Collect all data for the edited row
        for(let i = 0; i < updatedCells.length; i++) {
            const cell = updatedCells[i];
            const input = cell.querySelector('input');
            
            if(input) {
                const cellValue = input.value;
                updatedData.push(cellValue);
            } 
        }

        const jsonData = JSON.stringify(updatedData);

        // Pass the data into the POST route
        fetch('/account/edit-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
            if (response.ok) {
                // Handle successful response from the server
                console.log('Data sent successfully');
                origData = [];
                //change all inputs back to text tds
                for (let i = 0; i < updatedCells.length; i++) {
                    const cell = updatedCells[i];
                    const input = cell.querySelector('input');
                    if (input) {
                        const cellValue = input.value;
                        cell.textContent = cellValue;
                    }
                }

                if(updatedCells[7]) {
                    updatedCells[7].innerHTML = `<td><button class="edit-button" onclick="editReservation(this)">Edit</button></td>`;
                }

                if(updatedCells[8]) {
                    const deleteButton = updatedCells[8].querySelector('.delete-button');
                    deleteButton.style.display = 'block';
                }
            } else {
                // Handle errors
                console.error('Failed to send data to the server');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        valid = true;
    }
}

function deleteReservation(button) {
    const row = button.closest('tr'); // Get the closest row to the button clicked
    let rowData = row.cells; // Get all cells in the row
    let reservationData = [];
    
    // Iterate over each cell in the row
    for (let i = 0; i < rowData.length; i++) {
        const cell = rowData[i];
        const cellValue = cell.textContent;

        // Replace the content of the cell with an input field containing the cell's value
        if(cellValue !== "Edit" && cellValue !== "Delete") {
            reservationData.push(cellValue);
        }
    }

    // Double check if data is complete
    if(reservationData.length >= rowData.length - 2) {
        const jsonData = JSON.stringify(reservationData);

        // Pass the data into the POST route
        fetch('/account/delete-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
        .then(response => {
            if (response.ok) {
                row.style.display = 'none';
            } else {
                console.error('Failed to send data to the server');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } 
}