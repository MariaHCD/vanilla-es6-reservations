/**
 * Variable containing activites JSON data
 */
let activityData = data;

/**
 * The user's selected activity
 */
let selectedActivity = null;

/**
 * The user's selected session
 */
let selectedSession = null;

/**
 * Determine whether the reservation is valid
 */
const isValidReservation = () => {
    const attendees = document.forms.reservationsForm.attendees.value;
    const remainingSpaces = (+selectedSession.maxCapacity - +selectedSession.currentReservations);

    if (+attendees > remainingSpaces) {
        showError("Unfortunately, this session is no longer available for the selected number of attendees. Available slots left: " + remainingSpaces);
        return false;
    }

    return true;
};

/**
 * Show success alert modal
 */
const showSuccess = () => {
    document.getElementById("successAlert").hidden = false;
    document.getElementById("successAlert").innerHTML = "<strong>Success! </strong> Reservation created for " + selectedActivity.name + " at " + selectedSession.startTime + " - " + selectedSession.endTime + " for " + document.forms.reservationsForm.attendees.value + " persons";
    document.forms.reservationsForm.reset();
};

/**
 * Show error alert box and message
 * @param {string} message 
 */
const showError = (message) => {
    document.getElementById("errorAlert").hidden = false;
    document.getElementById("errorAlert").innerHTML = "<strong>Error: </strong>" + message;
};

/**
 * Determine whether the submitted form is valid
 */
const isValidForm = () => {
    let form = document.forms.reservationsForm;

    if (form.name.value.length < 5) {
        showError("Please enter your full name");
        return false;
    }

    if (form.email.value.length < 5) {
        showError("Please enter your email address");
        return false;
    }

    if (form.activities.value === "0") {
        showError("Please select an activity");
        return false;
    }

    if (form.sessions.value === "0") {
        showError("Please select a session you would like to reserve");
        return false;
    }

    if (form.attendees.value === "0") {
        showError("Please select the number of attendees");
        return false;
    }
    document.getElementById("errorAlert").hidden = true;
    return true;
};

/**
 * Handle form submission event
 */
const submit = () => {
    document.getElementById("errorAlert").hidden = true;

    // Validate form and session capacity
    if (isValidForm() && isValidReservation()) {
        // Increase current reservations of selected session
        selectedSession.currentReservations += +document.forms.reservationsForm.attendees.value;
        showSuccess();
        loadActivities();
    }
};

/**
 * Event handler for sessions select box
 * @param {Event} selected 
 */
const selectSession = (selected) => {
    if (selected.target.value !== 0) {
        selectedSession = selectedActivity.sessions.find((s) => s.id === +selected.target.value);
    }
};

/**
 * Load the session data based on the selected activity
 * @param {Event} selected 
 */
const loadSessions = (selected) => {
    selectedActivity = (activityData.find(activity => activity.id === +selected.target.value));

    if (selectedActivity) {
        let sessions = document.getElementById("sessions");
        sessions.options.length = 1;

        selectedActivity.sessions.forEach(session => {
            // Only show sessions with available spaces
            if (session.maxCapacity > session.currentReservations) {
                opt = document.createElement("option");
                opt.value = session.id;
                opt.textContent = session.startTime + " - " + session.endTime;
                sessions.appendChild(opt);
            }
        });
    }
};

/**
 * Load the activities data to be displayed in the activities select box
 */
const loadActivities = () => {
    let activities = document.getElementById("activities");
    activities.options.length = 1;

    activityData.forEach(activity => {
        // Validate that the activity has at least one session with available spaces
        if (activity.sessions.find((s) => s.maxCapacity > s.currentReservations)) {
            opt = document.createElement("option");
            opt.value = activity.id;
            opt.textContent = activity.name;
            activities.appendChild(opt);
        }
    });
}

/**
 * Initialize the form data
 */
const init = () => {
    // Hide alert boxes
    document.getElementById("successAlert").hidden = true;
    document.getElementById("errorAlert").hidden = true;

    // Load activities drop down
    loadActivities();

    // Listen for the change event on the activities select box
    document.getElementById("activities").addEventListener("change", loadSessions);

    // Listen for the change event on the sessions select box
    document.getElementById("sessions").addEventListener("change", selectSession);
};

/**
 * Initialise the page data once the window has loaded
 */
window.onload = () => {
    init();
};