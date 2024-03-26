function openProfile(event) {
    const userID = event.currentTarget.getAttribute('data-user-id');
    window.location.href = '/profile/' + userID;
}