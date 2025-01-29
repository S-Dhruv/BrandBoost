import React, { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error('Received data is not an array:', data);
        setError('Received data is not an array');
      }
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch (err) {
      console.error('Failed to add todo:', err);
      setError('Failed to add todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
        </button>
      </form>

      {loading && !todos.length ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <ul className="space-y-2">
          {Array.isArray(todos) && todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
