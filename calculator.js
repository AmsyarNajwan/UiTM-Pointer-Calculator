
const gradePoint = {
    'A+': 4.00, 'A': 4.00, 'A-': 3.70,
    'B+': 3.30, 'B': 3.00, 'B-': 2.70,
    'C+': 2.30, 'C': 2.00, 'C-': 1.70,
    'D+': 1.30, 'D': 1.00,
    'E': 0.70, 'F': 0.00
};

const form = document.getElementById('cgpa-form');
const subjectContainer = document.getElementById('subject-container');
const gpaResultElement = document.getElementById('gpa-result');
const resultsSection = document.getElementById('result');
const errorMessage = document.getElementById('error-message');
const addSubjectButton = document.getElementById('add-subject-btn');

let subjectCount = 1;

form.addEventListener('submit', function (e) {
    e.preventDefault();
    calculateCGPA();
});

addSubjectButton.addEventListener('click', addSubjectRow);

function addSubjectRow() {
    subjectCount++;

    const newRow = document.createElement('div');
    newRow.classList.add('subject-row', 'grid', 'grid-cols-4', 'gap-4', 'items-center')

    newRow.innerHTML = `
                <input type="text" value="Subject ${subjectCount}" placeholder="e.g., CTU555"
                    class="subject-name-input p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full text-gray-700">
                <input type="number" min="1" max="10" value="3" data-index="${subjectCount - 1}"
                    class="credit-unit-input p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full">
                <input type="text" maxlength="2" data-index="${subjectCount - 1}" placeholder="A, A-, B+ ..."
                    class="grade-input p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-full">
                <button type="button" onclick="removeSubjectRow(this)"
                        class="text-red-500 hover:text-red-700 font-bold">Remove</button>
            `;

    subjectContainer.appendChild(newRow);
    updateRemoveButtonVisibility();
}

function removeSubjectRow(button) {
    button.closest('.subject-row').remove();
    reIndexSubjects();
}

function reIndexSubjects() {
    const rows = document.querySelectorAll('.subject-row');
    subjectCount = 0;

    rows.forEach((row, index) => {
        subjectCount++;
        const nameInput = row.querySelector('.subject-name-input');
        if (nameInput) {
            if (nameInput.value.startsWith('Subject ')) {
                nameInput.value = `Subject ${index + 1}`;
            }
            nameInput.setAttribute('placeholder', `e.g., Subject ${index + 1}`);
        }

        row.querySelector('.credit-unit-input').setAttribute('data-index', index);
        row.querySelector('.grade-input').setAttribute('data-index', index);
    });

    updateRemoveButtonVisibility();
}

function updateRemoveButtonVisibility() {
    const removeButtons = document.querySelectorAll('.subject-row button');
    if (removeButtons.length <= 1) {
        removeButtons.forEach(btn => btn.classList.add('hidden'));
    } else {
        removeButtons.forEach(btn => btn.classList.remove('hidden'));
    }
}
function calculateCGPA() {
    const creditInputs = document.querySelectorAll('.credit-unit-input');
    const gradeInputs = document.querySelectorAll('.grade-input');

    let totalGradePoints = 0;
    let totalCreditUnits = 0;
    let isValid = true;

    errorMessage.classList.add('hidden');

    gradeInputs.forEach(input => {
        input.classList.remove('border-red-500');
    });

    for (let i = 0; i < creditInputs.length; i++) {
        const creditUnit = parseInt(creditInputs[i].value);
        const grade = gradeInputs[i].value.trim().toUpperCase();

        if (isNaN(creditUnit) || creditUnit <= 0) {
            continue;
        }

        if (grade) {
            const point = gradePoint[grade];

            if (point === undefined) {
                gradeInputs[i].classList.add('border-red-500');
                isValid = false;
                continue;
            }

            // Calculation
            const subjectGradePoint = point * creditUnit;
            totalGradePoints += subjectGradePoint;
            totalCreditUnits += creditUnit;
        }

    }

    if (!isValid) {
        gpaResultElement.textContent = 'Invalid input';
        errorMessage.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    }

    else if (totalCreditUnits == 0) {
        gpaResultElement.textContent = '0.00';
        errorMessage.textContent = 'Please enter at least one subject with a grade.';
        errorMessage.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    }

    else {
        const gpa = totalGradePoints / totalCreditUnits;
        gpaResultElement.textContent = gpa.toFixed(2);
        errorMessage.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('results').classList.add('hidden');
    reIndexSubjects();
})