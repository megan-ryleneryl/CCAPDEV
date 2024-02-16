let users = []; 
let reservations = []; 

document.addEventListener('DOMContentLoaded', function() {
	function generateId() {
		return Math.random().toString(36).substr(2, 9);
	}

	function registerUser(email, password, role) {
		if (users.some(user => user.email === email)) {
			return false;
		}
		const newUser = {
			id: generateId(),
			email,
			password, 
			role,
			reservations: []
		};
		users.push(newUser);
		return true;
	}

	function loginUser(email, password) {
		const user = users.find(user => user.email === email && user.password === password); 
		if (user) {
			return user;
		} else {
			return null;
		}
	}

	function togglePasswordVisibility() {
		var passwordInput = document.getElementById('loginPassword');
		var toggleSpan = document.querySelector('.show-password');
		if (passwordInput.type === 'password') {
			passwordInput.type = 'text';
			toggleSpan.textContent = 'Hide';
		} else {
			passwordInput.type = 'password';
			toggleSpan.textContent = 'Show';
		}
	}

	function handleLoginSubmit(event) {
		event.preventDefault();
		const email = document.getElementById('loginEmail').value;
		const password = document.getElementById('loginPassword').value;
		if (loginUser(email, password)) {
			
		} else {
			
		}
	}
});
