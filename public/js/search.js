function getSlots() {
    const selectedDate = document.getElementById('date-filter').value.trim();
    const selectedLab = document.getElementById('lab-filter').value.trim();
    const selectedTimeslot = document.getElementById('timeslot-filter').value.trim();
    const selectedUser = document.getElementById('user-filter').value.trim();
    const table = document.getElementById('search-results-table');
    let newTbody = document.createElement('tbody');

    const requestData = {
        date: selectedDate,
        lab: selectedLab,
        timeslot: selectedTimeslot,
        user: selectedUser
    };

    // Send a fetch request to the server
    fetch('/search/get-slots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Convert data object to JSON string
    })
    .then(async response => {
        if (response.ok) {
            const data = await response.json();
            const label = data.label;
            const resultsData = data.resultsData;
            const labelDiv = document.getElementById('table-label');
            
            // Display table header
            if(label === 'none') {
                labelDiv.innerHTML = '<h3>No reservations found</h3>';
            } else if(label === 'seats') {
                labelDiv.innerHTML = '<h3>Search for Available Seats Results</h3>';
            } else if(label === 'users') {
                labelDiv.innerHTML = '<h3>Search for Users Results</h3>';
            }

            // Display search results
            if(resultsData.length > 0) {
                resultsData.forEach(row => {
                    let rowName = 'Free';
                    if(selectedUser !== 'default') {
                        rowName = selectedUser;
                    }

                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${row.lab}</td>
                                    <td>${row.date}</td>
                                    <td>${row.timeslot}</td>
                                    <td>${row.seat}</td>
                                    <td>${rowName}</td>`;
                    newTbody.appendChild(tr);
                });
            }

            // Replace existing tbody with newTbody
            if (table.firstChild) {
                table.replaceChild(newTbody, table.firstChild);
            } else {
                table.appendChild(newTbody);
            }
        } else {
            console.error('Error:', response.status);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function resetFilters() {
    document.getElementById('date-filter').value = 'default';
    document.getElementById('lab-filter').value = 'default';
    document.getElementById('timeslot-filter').value = 'default';
    document.getElementById('user-filter').value = 'default';
}