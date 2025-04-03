// Importing necessary modules and components
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Navbar from './components/Navbar'; // Custom Navbar component
import { v4 as uuidv4 } from 'uuid'; // Generates unique IDs for each todo
import { FaEdit } from "react-icons/fa"; // Icon for edit button
import { MdDelete } from "react-icons/md"; // Icon for delete button

// Main App Component
function App() {
  // State variables
  const [todo, setTodo] = useState(""); // Holds the current todo being typed
  const [todos, setTodos] = useState([]); // Array holding all todos
  const [showFinished, setShowFinished] = useState(true); // Controls visibility of completed todos

  // useEffect to load todos from Local Storage when the component mounts
  useEffect(() => {
    let todoString = localStorage.getItem("todos"); // Get todos from local storage
    if (todoString) {
      let todos = JSON.parse(todoString); // Parse the string to an array
      setTodos(todos); // Set the state with parsed todos
    }
  }, []);

  // Function to save the todos to Local Storage
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos)); // Convert todos to string and save
  };

  // Toggle the visibility of completed todos
  const toggleFinished = (e) => {
    setShowFinished(!showFinished); // Switch the boolean value of showFinished
  };

  // Edit function to update a todo
  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id); // Find the todo by ID
    setTodo(t[0].todo); // Set the current input field with the todo text for editing
    let newTodos = todos.filter(item => item.id !== id); // Remove the todo from the list
    setTodos(newTodos); // Update state
    saveToLS(); // Save changes to Local Storage
  };

  // Delete function to remove a todo
  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id); // Filter out the deleted todo
    setTodos(newTodos); // Update state
    saveToLS(); // Save changes to Local Storage
  };

  // Add function to add a new todo
  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]); // Add a new todo to the list
    setTodo(""); // Clear the input field
    saveToLS(); // Save the new list to Local Storage
  };

  // Handle typing in the input field
  const handleChange = (e) => {
    setTodo(e.target.value); // Update the input field state with current value
  };

  // Toggle the completion state of a todo (Checkbox handling)
  const handleCheckbox = (e) => {
    let id = e.target.name; // Get ID of the todo from the checkbox name attribute
    let index = todos.findIndex(item => item.id === id); // Find the index of the todo in the list

    let newTodos = [...todos]; // Clone the existing todos array
    newTodos[index].isCompleted = !newTodos[index].isCompleted; // Toggle isCompleted property
    setTodos(newTodos); // Update state
    saveToLS(); // Save changes to Local Storage
  };

  return (
    <>
      <Navbar /> {/* Render the Navbar component */}
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-200 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-xl'>TaskMate- Manage your Todo at one place</h1>

        {/* Add Todo Section */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <input 
            onChange={handleChange} 
            value={todo} 
            type="text" 
            className="w-full rounded-full px-5 py-1 bg-white" 
          />
          <button 
            onClick={handleAdd} 
            disabled={todo.length <= 3} 
            className="bg-violet-800 hover:bg-violet-950 disabled:bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md"
          >
            Save
          </button>
        </div>

        {/* Checkbox to toggle showing finished todos */}
        <input 
          onChange={toggleFinished} 
          type="checkbox" 
          checked={showFinished}
        /> Show Finished

        <h2 className="text-lg font-bold">Your Todos</h2>

        {/* Displaying all todos */}
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No todos to display</div>}
          
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex w-1/2 my-3 justify-between">
                <div className="flex gap-5">
                  {/* Checkbox to toggle completion */}
                  <input 
                    name={item.id} 
                    onChange={handleCheckbox} 
                    type="checkbox" 
                    checked={item.isCompleted} 
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="buttons flex h-full">
                  <button 
                    onClick={(e) => handleEdit(e, item.id)} 
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, item.id)} 
                    className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
