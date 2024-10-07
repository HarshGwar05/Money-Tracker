let totalAmount = 0;
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Fetch existing data from the server when the page loads
window.onload = function() {
    fetch("/fetch")
        .then(response => response.json())
        .then(data => {
            data.forEach(expense => addRowToTable(expense));
            totalAmount = data.reduce((sum, expense) => {
                return expense.Category === 'Income' ? sum + expense.Amount : sum - expense.Amount;
            }, 0);
            totalAmountCell.textContent = totalAmount;
        })
        .catch(err => console.error("Error fetching data:", err));
};

// Function to add a new row to the table
function addRowToTable(expense) {
    const newRow = expenseTableBody.insertRow();
    newRow.insertCell(0).textContent = expense.Category;
    newRow.insertCell(1).textContent = expense.Amount;
    newRow.insertCell(2).textContent = expense.Info;
    newRow.insertCell(3).textContent = expense.Date;

    // Create and append the delete button
    const deleteCell = newRow.insertCell(4);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteCell.appendChild(deleteBtn);

    // Delete functionality
    deleteBtn.addEventListener('click', function() {
        // Update total based on whether it's income or expense
        if (expense.Category === 'Income') {
            totalAmount -= expense.Amount; // Subtract from total for income deletion
        } else if (expense.Category === 'Expense') {
            totalAmount += expense.Amount; // Add to total for expense deletion
        }

        totalAmountCell.textContent = totalAmount; // Update total amount
        expenseTableBody.removeChild(newRow); // Remove the row from the table
    });
}

// Event listener for adding new expense
addBtn.addEventListener('click', function(e) {
    e.preventDefault();

    const category = categorySelect.value;
    const info = infoInput.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    // Validation checks
    if (category === '' || isNaN(amount) || amount <= 0 || info === '' || date === '') {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Create an expense object
    const expense = {
        Category: category,
        Amount: amount,
        Info: info,
        Date: date
    };

    fetch("/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)  // Send the expense object as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();  // Convert response to text
    })
    .then(message => {
        console.log(message); // Log the response message
        addRowToTable(expense); // Add the new expense to the table
        
        // Update total amount based on category
        totalAmount = category === 'Income' ? totalAmount + amount : totalAmount - amount;
        totalAmountCell.textContent = totalAmount; // Update total amount

        // Clear form inputs after adding
        categorySelect.value = '';
        amountInput.value = '';
        infoInput.value = '';
        dateInput.value = '';
    })
    .catch(err => console.error("Error adding expense:", err));
});
