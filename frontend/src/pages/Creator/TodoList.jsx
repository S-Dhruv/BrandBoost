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

  const toggleTodoCompletion = async (id) => {
    try {
      setLoading(true);
      const todoToUpdate = todos.find(todo => todo._id === id);
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todoToUpdate.completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#081A42] pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#081A42] via-[#0F3A68] to-transparent"></div>
        <div className="absolute -right-48 top-48 w-96 h-96 bg-[#328AB0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -left-48 bottom-48 w-96 h-96 bg-[#42A4E0]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-96 h-96 bg-[#1D78A0]/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#328AB0]/20">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#42A4E0] to-[#1D78A0] text-transparent bg-clip-text">
              Todo List
            </h2>
            <p className="mt-2 text-[#081A42]">Manage your tasks efficiently</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl">
              {error}
            </div>
          )}

          <form onSubmit={addTodo} className="space-y-6">
            <div className="relative group">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo"
                className="w-full px-5 py-4 rounded-2xl bg-[#F9FAFB] border-2 border-[#328AB0]/20 text-[#081A42] placeholder-[#A1C6D2] focus:outline-none focus:border-[#42A4E0] transition-all duration-300 group-hover:border-[#42A4E0]/50"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#42A4E0]/20 to-[#1D78A0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#42A4E0] text-white py-4 rounded-2xl hover:bg-[#1D78A0] focus:outline-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add Todo'}
            </button>
          </form>

          {loading && !todos.length ? (
            <div className="flex justify-center mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#42A4E0]" />
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {Array.isArray(todos) && todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl border-2 border-[#328AB0]/20 hover:border-[#42A4E0]/50 transition-all duration-300 group"
                >
                  <span
                    className={`${todo.completed ? 'line-through text-[#A1C6D2]' : 'text-[#081A42]'} cursor-pointer`}
                    onClick={() => toggleTodoCompletion(todo._id)}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => toggleTodoCompletion(todo._id)}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 focus:outline-none transition-colors duration-300"
                  >
                    {todo.completed ? 'Undo' : 'Complete'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;