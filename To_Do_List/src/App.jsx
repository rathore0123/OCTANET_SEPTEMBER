import { useState, useId, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [finishedTodo, setFinishedTodo] = useState(true)
  const [showFinishedTodos, setShowFinishedTodos] = useState(false)
  const [showUnfinishedTodos, setShowUninishedTodos] = useState(false)
  
  function showIncomplete(){
    setShowUninishedTodos(!showUnfinishedTodos);
    setFinishedTodo(false)
  }
  function showComplete(){
    setShowFinishedTodos(!showFinishedTodos);
    setFinishedTodo(true)
  }

  function handleChange(e) {
    setTodo(e.target.value);
  }

  function handleAdd(e) {
    if (todo.trim() === '') {
      alert('Todo cannot be empty');
      return;
    }
    setTodos([...todos, { todo, id: uuidv4(), isCompleted: false }]);
    setTodo("");
  }

  function handleCheckBox(e) {
    let id = e.target.id;
    let index = todos.findIndex((item) => { return item.id === id });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    useLocalStorage();
    setTodos(newTodos);
  }

  function handleDelete(e, id) {
    let ask = confirm("Do you want to delete this item")
    if (ask) {
      let newTodos = todos.filter((item) => item.id !== id);
      useLocalStorage();
      clearAllTodos();
      setTodos(newTodos);
    }
  }

  function handleEdit(e, id) {
    let editTodo = todos.filter((item) => item.id === id);
    setTodo(editTodo[0].todo)
    let newTodos = todos.filter((item) => item.id !== editTodo[0].id);
    useLocalStorage();
    console.log(newTodos);
    clearAllTodos();
    setTodos(newTodos)

  }

  function finishedTodos(e) {
    setFinishedTodo(!finishedTodo)
  }

  function clearAllTodos() {
    if (RadioNodeList.length == 0) {
      localStorage.clear()
    }
  }

  function useLocalStorage() {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    if (storedTodos && Array.isArray(storedTodos)) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    useLocalStorage();
  }, [todos]);

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* Navbar */}
      <nav className='h-[70px] py-2 px-4 sm:px-8 md:px-14 flex justify-between bg-indigo-500 items-center'>
        <div>
          <h2 className='text-lg sm:text-xl font-bold text-white cursor-pointer hover:text-violet-700 transition-colors duration-500'>
            My Todo's
          </h2>
        </div>
        <div className='hidden md:flex gap-4'>
          <h2 onClick={showComplete} className='text-sm sm:text-md md:text-xl font-semibold text-white cursor-pointer hover:text-violet-700 transition-colors duration-500'>
            Completed
          </h2>
          <h2 onClick={showIncomplete} className='text-sm sm:text-md md:text-xl font-semibold text-white cursor-pointer hover:text-violet-700 transition-colors duration-500'>
            Incomplete
          </h2>
        </div>
      </nav>

      {/* Content */}
      <div className='p-4 sm:p-6 md:p-8'>
        <h2 className='text-lg sm:text-xl font-semibold text-white mb-2'>
          Add Todo
        </h2>
        <div className='flex flex-col sm:flex-row gap-2 mb-4'>
          <input
            type="text"
            value={todo}
            onChange={handleChange}
            placeholder='Enter Your Todo'
            className='border-none text-lg sm:text-xl font-semibold outline-none p-3 rounded-l-md w-full sm:w-2/3'
          />
          <button
            className='text-white p-3 bg-violet-700 rounded-r-md text-lg sm:text-xl font-semibold'
            onClick={handleAdd}
          >
            Save
          </button>
        </div>

        <div className='flex items-center gap-2 text-sm md:text-md mb-4'>
          <input type="checkbox" onChange={finishedTodos} checked={finishedTodo} />
          <h3 className='text-white'>Show Finished Todos</h3>
        </div>
        <hr className='border-gray-500 mb-4' />

        {/* Todo List */}
        <h2 className='text-lg sm:text-xl font-semibold text-white mb-2'>
          Todo List
        </h2>
        {todos.length === 0 ? (
          <div className='text-white'>Nothing to display</div>
        ) : (
          todos.map((item) => (
            (finishedTodo || !item.isCompleted) && (
              <div
                key={item.id}
                className="todo flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between bg-gray-700 text-white p-3 rounded-md mb-3 w-full sm:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <div className="flex gap-2 sm:gap-4 items-center font-semibold">
                  <input
                    onChange={handleCheckBox}
                    checked={item.isCompleted}
                    type="checkbox"
                    id={item.id}
                  />
                  <h3 className={`text-lg ${item.isCompleted ? "line-through text-gray-400" : "text-white"}`}>
                    {item.todo}
                  </h3>
                </div>
                <div className="flex gap-2 sm:gap-4 items-center">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='text-white p-2 bg-violet-700 rounded-md text-sm font-semibold'
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='text-white p-2 bg-red-500 rounded-md text-sm font-semibold'
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
}

export default App
