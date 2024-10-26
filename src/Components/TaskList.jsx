import React from "react";

function TaskList({ tasks, removeTask, isGroupTask, handleSubmitGroup }) {
  return (
    <div className="tasklist_container">
      <h6>Group Task</h6>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks added yet. Start by adding a task!</p>
      ) : (
        tasks?.map((task, i) => (
          <div key={i} className="task_item">
            <p>
              {i + 1}. {task.title} - {task.category}
            </p>
            <div onClick={() => removeTask(i)} className="delete-icon">
              <i class="bi bi-x-square-fill"></i>
            </div>
          </div>
        ))
      )}

      {/* Display the group submission button when there are group tasks */}
      {isGroupTask && tasks.length > 0 && (
        <button onClick={handleSubmitGroup} className="submit-group-btn">
          Submit Group Tasks
        </button>
      )}
    </div>
  );
}

export default TaskList;
