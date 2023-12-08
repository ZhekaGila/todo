let storedData = JSON.parse(localStorage.getItem('data')) || {
   users: [
     { username: 'root', password: 'root' },
   ],
   toDo: []
 };