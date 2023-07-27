$(document).ready(function () {
  // Function to get and display tasks based on the selected filter
  const getAndDisplayAllTasks = function () {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=267',
      dataType: 'json',
      success: function (response, textStatus) {
        const filterValue = $('input[name="taskFilter"]:checked').val();
        const $todoList = $('#todo-list').empty();

        response.tasks.forEach(function (task) {
          if (filterValue === 'all' || (filterValue === 'completed' && task.completed) || (filterValue === 'active' && !task.completed)) {
            const checkedAttribute = task.completed ? 'checked' : '';
            const taskListItem = `
              <div class="row">
                <p class="task">${task.content}</p>
                <button class="delete" data-id="${task.id}">
                  <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                </button>
                <label class="cl-checkbox">
                  <input type="checkbox" class="mark-complete" data-id="${task.id}" ${checkedAttribute}>
                  <span></span>
                </label>
              </div>
            `;
            $todoList.append(taskListItem);
          }
        });
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to captilize the first letter of a string
  const captilizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to create a new task
  const createTask = function () {
    const $newTaskContent = $('#new-task-content');
    let content = $newTaskContent.val();
    content = captilizeFirstLetter(content);

    if (!content.trim()) {
      alert('Task content cannot be empty!');
      return;
    }

    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=267',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: content
        }
      }),
      success: function (response, textStatus) {
        $newTaskContent.val('');
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Event handler for form submission
  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  // Function to delete a task
  const deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=267',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Event delegation for delete buttons
  $(document).on('click', '.delete', function () {
    const taskId = $(this).data('id');
    deleteTask(taskId);
  });

  // Function to mark a task as complete
  const markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=267',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Function to mark a task as active
  const markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=267',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  };

  // Event delegation for mark-complete checkboxes
  $(document).on('change', '.mark-complete', function () {
    const taskId = $(this).data('id');
    if (this.checked) {
      markTaskComplete(taskId);
    } else {
      markTaskActive(taskId);
    }
  });

  // Event handler for filter change
  $(document).on('change', 'input[name="taskFilter"]', function () {
    getAndDisplayAllTasks();
  });

  // Initial call to get and display tasks
  getAndDisplayAllTasks();
});