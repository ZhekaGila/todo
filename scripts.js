if(localStorage.activeUser){
  document.querySelector('.username').innerHTML = `<h3>${localStorage.activeUser}</h3>`;
} else {
  document.querySelector('.username').innerHTML = `<h3>Ошибка с установкой username</h3>`;
}


const todoBody = document.querySelector('.todo-item');
const inProgressBody = document.querySelector('.inprogress-item');
const doneBody = document.querySelector('.done-body');



// рендер todo элементов
function createTodoElement(todo) {
  if(todo.createdBy == localStorage.activeUser){
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const textarea = document.createElement('textarea');
    textarea.classList.add('todo-text');
    textarea.name = 'todo-text';
    textarea.dataset.id = todo.createdAt.toString();
    textarea.setAttribute('placeholder', 'Type your text')
    textarea.textContent = todo.text;

    // сохранение localstorage при инпуте в textarea
    textarea.addEventListener('input', () => {
      const newText = textarea.value;
      const todoId = textarea.dataset.id;
      
      const index = storedData.toDo.findIndex(todo => todo.createdAt.toString() === todoId);
      
      if (index !== -1) {
        storedData.toDo[index].text = newText;
        localStorage.setItem('data', JSON.stringify(storedData));
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    // удаления элемента
    deleteButton.addEventListener('click', () => {
    const todoId = textarea.dataset.id;
    const index = storedData.toDo.findIndex(todo => todo.createdAt.toString() === todoId);
    if (index !== -1) {
        storedData.toDo.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(storedData));
        todoItem.remove();
    }
    });
    
    const moveToInProgressButton = document.createElement('button');
    moveToInProgressButton.classList.add('move-to-in-progress');
    moveToInProgressButton.textContent = 'Move to In Progress';

    moveToInProgressButton.addEventListener('click', () => {
      const todoId = textarea.dataset.id;
      moveToInProgress(todoId);
    });



    todoItem.appendChild(textarea);
    todoItem.appendChild(deleteButton);
    todoItem.appendChild(moveToInProgressButton);
    return todoItem;
  }
}

function createInProgressElement(todo) {
  if(todo.createdBy == localStorage.activeUser){
    const inProgressItem = document.createElement('div');
    inProgressItem.classList.add('inprogress-item');

    const textarea = document.createElement('textarea');
    textarea.classList.add('todo-text');
    textarea.name = 'todo-text';
    textarea.dataset.id = todo.createdAt.toString();
    textarea.textContent = todo.text;

    // сохранение localstorage при инпуте в textarea
    textarea.addEventListener('input', () => {
      const newText = textarea.value;
      const todoId = textarea.dataset.id;

      const index = storedData.inProgress.findIndex(todo => todo.createdAt.toString() === todoId);

      if (index !== -1) {
        storedData.inProgress[index].text = newText;
        localStorage.setItem('data', JSON.stringify(storedData));
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    // удаления элемента
    deleteButton.addEventListener('click', () => {
      const todoId = textarea.dataset.id;
      const index = storedData.inProgress.findIndex(todo => todo.createdAt.toString() === todoId);

      if (index !== -1) {
        storedData.inProgress.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(storedData));
        inProgressItem.remove();
      }
    });

    const moveToDoneButton = document.createElement('button');
    moveToDoneButton.classList.add('move-to-done');
    moveToDoneButton.textContent = 'Move to Done';

    moveToDoneButton.addEventListener('click', () => {
      const todoId = textarea.dataset.id;
      moveToDone(todoId);
    });

    inProgressItem.appendChild(textarea);
    inProgressItem.appendChild(deleteButton);
    inProgressItem.appendChild(moveToDoneButton);
    return inProgressItem;
  }
}

// из inProgress в Done
function createDoneElement(todo) {
  if(todo.createdBy == localStorage.activeUser){
    const doneItem = document.createElement('div');
    doneItem.classList.add('done-item');

    const textarea = document.createElement('textarea');
    textarea.classList.add('todo-text');
    textarea.name = 'todo-text';
    textarea.dataset.id = todo.createdAt.toString();
    textarea.setAttribute('disabled', true);
    textarea.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
      const todoId = textarea.dataset.id;
      const index = storedData.done.findIndex(todo => todo.createdAt.toString() === todoId);

      if (index !== -1) {
        storedData.done.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(storedData));
        doneItem.remove();
      }
    });

    doneItem.appendChild(textarea);
    doneItem.appendChild(deleteButton);
    return doneItem;
  }
}








// Рендеринг задач из localstorage если оно конечно имеется гыгы
if(localStorage.activeUser){
  if(storedData.toDo){
    storedData.toDo.forEach(todo => {
      const todoElement = createTodoElement(todo);
      if (todoElement){
        todoBody.appendChild(todoElement);
      }
    });
  }
  if (storedData.inProgress) {
    storedData.inProgress.forEach(todo => {
      const inProgressElement = createInProgressElement(todo);
      if (inProgressElement) {
        inProgressBody.appendChild(inProgressElement);
      }
    });
  }
  if (storedData.done) {
    storedData.done.forEach(todo => {
      const doneElement = createDoneElement(todo);
      if(doneElement){
        doneBody.appendChild(doneElement);
      }
    });
  }
}


// добавление новых task
document.querySelector('.todo-add-item').addEventListener('click', () => {
  const newTodo = {
    text: '',
    createdBy: localStorage.activeUser,
    createdAt: new Date()
  };

  storedData.toDo.push(newTodo);
  localStorage.setItem('data', JSON.stringify(storedData));

  const newTodoElement = createTodoElement(newTodo);
  todoBody.appendChild(newTodoElement);
});






// move to progress
function moveToInProgress(todoId) {
  const index = storedData.toDo.findIndex(todo => todo.createdAt.toString() === todoId);

  if (index !== -1) {
    const movedTodo = storedData.toDo.splice(index, 1)[0]; // Удаляем задачу из "To do"
    movedTodo.status = 'In progress';
    inProgressBody.appendChild(createInProgressElement(movedTodo)); // Добавляем задачу в "In Progress"
    storedData.inProgress = storedData.inProgress || [];
    storedData.inProgress.push(movedTodo);

    localStorage.setItem('data', JSON.stringify(storedData));

    const todoItemElement = document.querySelector(`[data-id="${todoId}"]`);
    const todoItemParent = todoItemElement.parentNode;
    if (todoItemElement) {
      todoItemElement.remove();
      todoItemParent.remove();
    }
  }
}

// move to done
function moveToDone(todoId) {
  const index = storedData.inProgress.findIndex(todo => todo.createdAt.toString() === todoId);
  if (index !== -1) {
    const movedTodo = storedData.inProgress.splice(index, 1)[0];
    movedTodo.status = 'Done';
    storedData.done = storedData.done || [];
    storedData.done.push(movedTodo);
    localStorage.setItem('data', JSON.stringify(storedData));

    const inProgressElement = document.querySelector(`[data-id="${todoId}"]`);
    const inProgressParent = inProgressElement.parentNode;
    const doneElement = createDoneElement(movedTodo);
    doneBody.appendChild(doneElement);
    if (inProgressElement) {
      inProgressElement.remove();
      inProgressParent.remove();
    }
  }
}



















// всякое из AUTHORIZATION
function clearActiveUser(){
  localStorage.activeUser = "";
  localStorage.setItem('data', JSON.stringify(storedData));
  window.location.href = "";
}

if(localStorage.activeUser){
  $('.control-wrapper').fadeIn(400);
  $('.todo-wrapper').fadeIn(400);
} else {
  localStorage.activeUser = "";
  $('.wrapper').css({
     'display': 'grid'
  });
  $('.auth-wrapper').fadeIn(400);
}

$('.auth-submit').on('click', function () {
  const users = storedData.users;
  if (users) {
     const enteredUsername = $('.auth-login').val();
     const enteredPassword = $('.auth-password').val();

     for (let i = 0; i < users.length; i++) {
        if (enteredUsername === users[i].username && enteredPassword === users[i].password) {
           activeUser = users[i].username;
           localStorage.setItem('activeUser', activeUser);
           window.location.href = "";
           return;
        }
     }
     $('.auth-warning').show(100);
  } else {
     console.log('Пользователей нету');
  }
});

$('.reg-submit').click(function(){
  clearActiveUser();
  const login = $('.reg-login').val();
  const pass = $('.reg-password').val();
  const users = storedData.users;
  const isExists = false;
  for(let i = 0; i < users.length; i++){
     if (users[i].username === login) {
        console.log("Username already exists!");
        isExists = true;
        return;
     }
  }
  if (!isExists){
     window.location.href = "";
  }

  storedData.users.push({ username: login, password: pass });
  localStorage.activeUser = login;
  localStorage.setItem('data', JSON.stringify(storedData));
  
  setTimeout(() => {
     window.localStorage.href = "";
  }, 400);
});

$('.signout-btn').click(function(){
  clearActiveUser();
  window.localStorage.href = "";
});

$('.open-reg').click(function(){
  $('.auth-container').fadeOut(100, function(){
     $('.reg-container').fadeIn(100);
  });
});