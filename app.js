const taskInput = document.getElementById('taskInput');
const imageInput = document.getElementById('imageInput');
const dateInput = document.getElementById('dateInput');
const taskList = document.getElementById('taskList');

// Función para agregar una publicación
function addTask() {
  const taskName = taskInput.value;
  const imageUrl = imageInput.value;
  const date = dateInput.value;
  console.log(imageUrl, date, taskName)
  if (taskName.trim() !== '' && imageUrl.trim() !== '' && date.trim() !== '') {
    const taskRef = database.ref('tasks').push();
    taskRef.set({
      name: taskName,
      imageUrl: imageUrl,
      date: date
    });
    taskInput.value = '';
    imageInput.value = '';
    dateInput.value = '';
  }
}

// Función para mostrar las publicaciones
function displayTasks(snapshot) {
  taskList.innerHTML = '';
  snapshot.forEach(childSnapshot => {
    const task = childSnapshot.val();
    const taskId = childSnapshot.key;
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${task.imageUrl}" alt="Imagen de la publicación" style="max-width: 200px; max-height: 200px;">
      <p>Nombre: ${task.name}</p>
      <p>Fecha: ${task.date}</p>
    `;
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = () => editTask(taskId, task.name, task.imageUrl, task.date);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = () => deleteTask(taskId);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

// Función para editar una publicación
function editTask(taskId, currentName, currentImageUrl, currentDate) {
  const newName = prompt('Editar nombre de la publicación:', currentName);
  const newImageUrl = prompt('Editar URL de la imagen:', currentImageUrl);
  const newDate = prompt('Editar fecha de la publicación:', currentDate);
  if (newName !== null && newImageUrl !== null && newDate !== null) {
    database.ref('tasks/' + taskId).update({ 
      name: newName,
      imageUrl: newImageUrl,
      date: newDate
    });
  }
}

// Función para eliminar una publicación
function deleteTask(taskId) {
  if (confirm('¿Estás seguro de eliminar esta publicación?')) {
    database.ref('tasks/' + taskId).remove();
  }
}

// Escuchar cambios en la base de datos y actualizar la lista de publicaciones
database.ref('tasks').on('value', snapshot => {
  displayTasks(snapshot);
});
