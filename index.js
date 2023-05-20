const todoInput = document.querySelector('.take-input');
const todos = document.querySelector('.todos');
const markAllComplete = document.getElementById('mark-all-complete');
const footer = document.querySelector('.footer');
const allItemsTab = document.querySelector('.all-items');
const activeItemsTab = document.querySelector('.active-items');
const completedItemsTab = document.querySelector('.completed-items');
const clearItems = document.querySelector('.clear-items');
const tabs = [allItemsTab, activeItemsTab, completedItemsTab];

let todoList;
let activeTab = 1;
let counter;

if(localStorage.getItem('todos')) {
    todoList = JSON.parse(localStorage.getItem('todos'));
    counter = Number(localStorage.getItem('counter'));
    showTodos();
} else {
    todoList = [];
    counter = 0;
}

todoInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        if(todoInput.value.trim()) {
            addTodo(todoInput.value);
            todoInput.value = '';
        }
    }
});


markAllComplete.addEventListener('click', markAllAsCompleted);
clearItems.addEventListener('click', deleteAllItems);

function addTodo(data) {
    const newTodo = {
        id: counter,
        data,
        completed: false
    }

    todoList.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todoList));
    counter++;
    localStorage.setItem('counter', counter);
    showTodos();
}

function showTodos(activeTab = 1) {
    todos.innerHTML = '';
    const ulElem = document.createElement('ul');
    ulElem.classList.add('todo-list');

    if(todoList.length === 0) {
        localStorage.clear();
    }

    for(let index = 0; index < todoList.length; index++) {
        const liElem = document.createElement('li');
        liElem.classList.add('todo-item');

        const checkBoxBtn = document.createElement('input');
        checkBoxBtn.classList.add('mark-completed');
        checkBoxBtn.type = 'checkbox';
        checkBoxBtn.setAttribute('name', 'delete-this');
        checkBoxBtn.setAttribute('btnId', todoList[index].id);
        checkBoxBtn.checked = todoList[index].completed;
        checkBoxBtn.addEventListener('change', markItemAsCompleted);
        
        const todo = document.createElement('span');
        todo.classList.add('items');
        todo.setAttribute('listId', todoList[index].id);

        todo.addEventListener('keyup', (e) => {
            if(e.target.innerText.trim()) {
                todoList[index].data = e.target.innerText.trim();
            }
        });

        todo.addEventListener('dblclick', () => {
            todo.setAttribute('contenteditable', true);
        });
        todo.textContent = todoList[index].data;

        if(checkBoxBtn.checked) {
            todo.style.textDecoration = 'line-through';
        } else {
            todo.style.textDecoration = 'none';
        }

        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.setAttribute('btnId', todoList[index].id);
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', deleteItemFromList);

        liElem.appendChild(checkBoxBtn);
        liElem.appendChild(todo);
        liElem.appendChild(deleteBtn);
        liElem.addEventListener('mouseenter', (event) => {
            event.target.childNodes[2].style.visibility = 'visible';
        });
        liElem.addEventListener('mouseleave', (event) => {
            event.target.childNodes[2].style.visibility = 'hidden';
        });


        if(activeTab == 2) {
            if(checkBoxBtn.checked == false) {
                ulElem.appendChild(liElem);
                todos.appendChild(ulElem);
            }
        } else if(activeTab == 3){
            if(checkBoxBtn.checked) {
                ulElem.appendChild(liElem);
                todos.appendChild(ulElem);
            }
        } else {
            ulElem.appendChild(liElem);
                todos.appendChild(ulElem);
        }
    }


    if(todoList.length > 0) {
        document.querySelector('.active-items-count').textContent = `${getCompletedCount()} items left`;
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }

    for(let index = 0; index < tabs.length; index++) {
        if(activeTab-1 == index) {
            tabs[index].style.border = '1px solid #d3d2d2';
        } else {
            tabs[index].style.border = 'none';
        }
    }

    const activeItems = getActiveItemsCount();
    if(activeItems > 0) {
        clearItems.style.display = 'block';
    }
}


function getActiveItemsCount() {
    return todoList.reduce((acc, todo) => {
        if(todo.completed) {
            acc++;
        }
        return acc;
    }, 0);
}


function markItemAsCompleted(event) {

    for(let index = 0; index < todoList.length; index++){
        if(todoList[index].id == event.target.getAttribute('btnId')) {
            if(event.target.checked) {
                todoList[index].completed = true;
            } else {
                todoList[index].completed = false;
            }
        }
    };

    localStorage.setItem('todos', JSON.stringify(todoList))
    showTodos(activeTab);
}



function markAllAsCompleted() {
    const checkboxBtn = document.querySelectorAll('.mark-completed');
    if(checkboxBtn.length === 0) {
        return;
    }

    const isChecked = Array.from(checkboxBtn).filter(todo => todo.checked);
    
    for(let index = 0; index < todoList.length; index++) {
        if(isChecked.length > 0) {
            if(activeTab === 1 && isChecked.length !== todoList.length) {
                todoList[index].completed = true;
            } else {
                todoList[index].completed = false;
            }
        } else {
            todoList[index].completed = true;
        }
    }
    
    localStorage.setItem('todos', JSON.stringify(todoList));
    showTodos(activeTab);
}


function deleteItemFromList(event) {
    const todos = document.querySelectorAll('.items');

    todos.forEach((todo, index) => {
        if(todo.getAttribute('listId') == event.target.getAttribute('btnId')) {
            todoList.splice(index, 1);
        }
    });

    localStorage.setItem('todos', JSON.stringify(todoList));
    showTodos();
}

function deleteAllItems() {
    const newTodo = [];
    todoList.forEach(todo => {
        if(!todo.completed) {
            newTodo.push(todo);
        }
    });

    todoList = newTodo;
    localStorage.setItem('todos', JSON.stringify(todoList));
    showTodos();
}


function getCompletedCount() {
    const count = todoList.reduce((acc, todo) => {
        if(!todo.completed) {
            acc++;
        }
        return acc;
    }, 0);

    return count;
}

allItemsTab.addEventListener('click', () =>  {
    activeTab = 1;
    showTodos(activeTab)
});

activeItemsTab.addEventListener('click', () => {
    activeTab = 2;
    showTodos(activeTab);
});

completedItemsTab.addEventListener('click', () => {
    activeTab = 3;
    showTodos(activeTab);
});