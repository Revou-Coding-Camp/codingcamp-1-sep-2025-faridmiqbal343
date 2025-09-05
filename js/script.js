// --- 1. HTML ELEMENT SELECTION ---
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoDate = document.querySelector('.todo-date');
const filterSelect = document.querySelector('.filter-select'); 
const deleteAllButton = document.querySelector('.delete-all-button');
const todoListBody = document.querySelector('.todo-list-body');


// --- 2. EVENT LISTENERS ---
// Run the check function once the page has loaded
document.addEventListener('DOMContentLoaded', checkEmptyState);
todoForm.addEventListener('submit', addTask);
todoListBody.addEventListener('click', handleTaskActions);
deleteAllButton.addEventListener('click', deleteAllTasks);
filterSelect.addEventListener('change', filterTasks);


// --- 3. FUNCTIONS ---

/**
 * REVISED: The main function to check if the list is empty or appears empty due to filters.
 * This is now the single source of truth for showing the empty message.
 */
function checkEmptyState() {
    // First, remove any existing empty-row to avoid duplicates
    const existingEmptyRow = todoListBody.querySelector('.empty-row');
    if (existingEmptyRow) {
        existingEmptyRow.remove();
    }

    // Get all task rows
    const allTaskRows = todoListBody.querySelectorAll('tr');

    // Count how many tasks are actually visible
    let visibleTasks = 0;
    allTaskRows.forEach(row => {
        if (row.style.display !== 'none') {
            visibleTasks++;
        }
    });

    // If no tasks are visible, add the message
    if (visibleTasks === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        // The message depends on whether there are tasks that are just hidden by a filter
        const message = allTaskRows.length > 0 ? 'No tasks match filter' : 'No task found';
        emptyRow.innerHTML = `<td colspan="4">${message}</td>`;
        todoListBody.appendChild(emptyRow);
    }
}


/**
 * Adds a new task to the list.
 */
function addTask(event) {
    event.preventDefault();
    const taskText = todoInput.value;
    const taskDate = todoDate.value;

    if (taskText === '') {
        alert('Task description cannot be empty!');
        return;
    }

    const newRow = document.createElement('tr');
    let formattedDate = 'No due date';
    if (taskDate) {
        const dateParts = taskDate.split('-');
        formattedDate = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    }

    newRow.innerHTML = `
        <td class="task-text">${taskText}</td>
        <td>${formattedDate}</td>
        <td><span class="status">In Progress</span></td>
        <td><button class="delete-btn">Hapus</button></td>
    `;
    todoListBody.appendChild(newRow);

    todoInput.value = '';
    todoDate.value = '';
    
    filterTasks(); // Apply current filter to the new task
}

/**
 * Handles actions.
 */
function handleTaskActions(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('delete-btn')) {
        const rowToRemove = clickedElement.closest('tr');
        rowToRemove.remove();
        checkEmptyState(); // Check the state
    }
    
    if (clickedElement.classList.contains('task-text')) {
        const row = clickedElement.closest('tr');
        row.classList.toggle('completed');
        
        const statusSpan = row.querySelector('.status');
        if (row.classList.contains('completed')) {
            statusSpan.textContent = 'Completed';
        } else {
            statusSpan.textContent = 'In Progress';
        }
        
        filterTasks(); // Re-apply filter
    }
}

/**
 * Deletes all tasks.
 */
function deleteAllTasks() {
    todoListBody.innerHTML = '';
    checkEmptyState(); // Check the state after deleting all
}

/**
 * Filters tasks and then calls the main checkEmptyState function.
 */
function filterTasks() {
    const selectedFilter = filterSelect.value;
    const tasks = todoListBody.querySelectorAll('tr:not(.empty-row)');

    tasks.forEach(task => {
        let showTask = false;
        switch (selectedFilter) {
            case 'all':
                showTask = true;
                break;
            case 'completed':
                if (task.classList.contains('completed')) {
                    showTask = true;
                }
                break;
            case 'in-progress':
                if (!task.classList.contains('completed')) {
                    showTask = true;
                }
                break;
        }
        task.style.display = showTask ? 'table-row' : 'none';
    });

    checkEmptyState(); // Always check the empty state after filtering
}