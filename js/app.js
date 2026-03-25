// JavaScript logic for the application

// Function to toggle the menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

// Function for page navigation
function navigateTo(page) {
    window.location.href = page;
}

// Function to fetch tasks from Google Sheets
async function fetchTasks() {
    const response = await fetch('https://sheet.example.com/tasks'); // Replace with your Google Sheets URL
    const data = await response.json();
    return data;
}

// New functionality to fetch avisos from spreadsheet
async function fetchAvisos() {
    const response = await fetch('https://sheet.example.com/avisos'); // Replace with your Google Sheets URL
    const avisos = await response.json();
    return avisos;
}