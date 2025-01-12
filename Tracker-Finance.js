// Select DOM elements
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategorySelect = document.getElementById('expense-category');
const addExpenseButton = document.getElementById('add-expense');
const filterCategorySelect = document.getElementById('filter-category');
const expenseList = document.getElementById('expense-list');
const totalExpensesElement = document.getElementById('total-expenses');
const expenseChartElement = document.getElementById('expense-chart');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

// Data storage
let expenses = [];

// Initialize Chart.js
let expenseChart;
function initializeChart() {
    const ctx = expenseChartElement.getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }],
        },
        options: {
            responsive: true,
        },
    });
}
initializeChart();

// Update total expenses
function updateTotalExpenses() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpensesElement.textContent = total.toFixed(2);
}

// Update chart data
function updateChart() {
    const categoryTotals = {};

    expenses.forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    expenseChart.data.labels = Object.keys(categoryTotals);
    expenseChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();
}

// Add expense
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategorySelect.value;

    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid expense name and amount.');
        return;
    }

    const expense = { name, amount, category };
    expenses.push(expense);
    displayExpenses();
    updateTotalExpenses();
    updateChart();

    expenseNameInput.value = '';
    expenseAmountInput.value = '';
}

// Display expenses
function displayExpenses() {
    const filteredCategory = filterCategorySelect.value;

    expenseList.innerHTML = '';
    expenses
        .filter((expense) => filteredCategory === 'All' || expense.category === filteredCategory)
        .forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})
                <button class="delete-expense" data-index="${index}">Delete</button>
            `;
            expenseList.appendChild(li);
        });

    const deleteButtons = document.querySelectorAll('.delete-expense');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', deleteExpense);
    });
}

// Delete expense
function deleteExpense(event) {
    const index = parseInt(event.target.dataset.index, 10);
    expenses.splice(index, 1);
    displayExpenses();
    updateTotalExpenses();
    updateChart();
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listeners
addExpenseButton.addEventListener('click', addExpense);
filterCategorySelect.addEventListener('change', displayExpenses);
toggleDarkModeButton.addEventListener('click', toggleDarkMode);
