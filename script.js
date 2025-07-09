// Student Registration System JavaScript
// Handles add, edit, delete, display, and validation with localStorage persistence

// Select DOM elements
const form = document.getElementById('student-form');
const studentsTableBody = document.querySelector('#studentsTable tbody');
const submitBtn = document.getElementById('submitBtn');

let editIndex = null; // Track which student is being edited

// Utility: Validate input fields
function validateStudent({ studentName, studentId, email, contact }) {
    // Name: only letters and spaces
    const nameRegex = /^[A-Za-z ]+$/;
    // ID: only numbers
    const idRegex = /^\d+$/;
    // Email: basic email pattern
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
    // Contact: only numbers, 7-15 digits
    const contactRegex = /^\d{7,15}$/;

    if (!studentName.trim() || !studentId.trim() || !email.trim() || !contact.trim()) {
        alert('All fields are required.');
        return false;
    }
    if (!nameRegex.test(studentName)) {
        alert('Student name must contain only letters and spaces.');
        return false;
    }
    if (!idRegex.test(studentId)) {
        alert('Student ID must contain only numbers.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    if (!contactRegex.test(contact)) {
        alert('Contact number must be 7-15 digits.');
        return false;
    }
    return true;
}

// Utility: Get students from localStorage
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

// Utility: Save students to localStorage
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Render students in the table
function renderStudents() {
    const students = getStudents();
    studentsTableBody.innerHTML = '';
    if (students.length === 0) {
        studentsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">No students registered yet.</td></tr>';
        return;
    }
    students.forEach((student, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.studentName}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button class="action-btn edit" data-idx="${idx}">Edit</button>
                <button class="action-btn delete" data-idx="${idx}">Delete</button>
            </td>
        `;
        studentsTableBody.appendChild(tr);
    });
}

// Handle form submit (add or edit)
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const student = {
        studentName: form.studentName.value.trim(),
        studentId: form.studentId.value.trim(),
        email: form.email.value.trim(),
        contact: form.contact.value.trim()
    };
    if (!validateStudent(student)) return;
    let students = getStudents();
    if (editIndex === null) {
        // Add new student
        students.push(student);
    } else {
        // Edit existing student
        students[editIndex] = student;
        editIndex = null;
        submitBtn.textContent = 'Register Student';
    }
    saveStudents(students);
    renderStudents();
    form.reset();
});

// Handle edit and delete actions
studentsTableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit')) {
        // Edit student
        const idx = e.target.getAttribute('data-idx');
        const students = getStudents();
        const student = students[idx];
        form.studentName.value = student.studentName;
        form.studentId.value = student.studentId;
        form.email.value = student.email;
        form.contact.value = student.contact;
        editIndex = idx;
        submitBtn.textContent = 'Update Student';
        form.studentName.focus();
    } else if (e.target.classList.contains('delete')) {
        // Delete student
        const idx = e.target.getAttribute('data-idx');
        let students = getStudents();
        if (confirm('Are you sure you want to delete this student?')) {
            students.splice(idx, 1);
            saveStudents(students);
            renderStudents();
            // If editing the same row, reset form
            if (editIndex == idx) {
                form.reset();
                editIndex = null;
                submitBtn.textContent = 'Register Student';
            }
        }
    }
});

// On page load, render students
window.addEventListener('DOMContentLoaded', renderStudents); 