import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://homeinv-backend.onrender.com';

function App() {
  const [goods, setGoods] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoods = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(API);
      setGoods(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoods();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm({ name: '', quantity: '' });
      setEditingId(null);
      await fetchGoods();
    } catch (err) {
      setError('Operation failed. Please try again.');
      console.error(err);
    }
  };

  const handleEdit = good => {
    setForm({ name: good.name, quantity: good.quantity });
    setEditingId(good._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API}/${id}`);
        await fetchGoods();
      } catch (err) {
        setError('Failed to delete item. Please try again.');
        console.error(err);
      }
    }
  };

  return (
    <div className="inventory-app">
      <header className="app-header">
        <h1><i className="fas fa-boxes"></i> Toiletories Box</h1>
      </header>

      <div className="card">
        <h2>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="inventory-form">
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input
              id="item-name"
              placeholder="Enter item name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="item-quantity">Quantity</label>
            <input
              id="item-quantity"
              type="number"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
              min="0"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'}`}></i>
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', quantity: '' });
              }}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <div className="inventory-header">
          <h2>Box Status</h2>
          <span className="total-items">{goods.length} items</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {isLoading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading inventory...</p>
          </div>
        ) : goods.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-box-open"></i>
            <h3>Box is empty</h3>
            <p>Add some items to get started</p>
          </div>
        ) : (
          <ul className="inventory-list">
            {goods.map(good => (
              <li key={good._id} className="inventory-item">
                <div className="item-info">
                  <span className="item-name">{good.name}</span>
                  <span className="item-quantity">Quantity: {good.quantity}</span>
                  <span className="item-updated">
                    Last updated: {new Date(good.lastUpdated).toLocaleString()}
                  </span>
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => handleEdit(good)}
                    className="btn btn-edit"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(good._id)}
                    className="btn btn-danger"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary: #4361ee;
          --primary-dark: #3a56d4;
          --secondary: #6c757d;
          --danger: #f72585;
          --danger-dark: #e5177b;
          --light: #f8f9fa;
          --dark: #212529;
          --gray: #6c757d;
          --light-gray: #e9ecef;
          --border-radius: 12px;
          --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }
        
        .inventory-app {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
          color: var(--dark);
          line-height: 1.6;
        }
        
        .app-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .app-header h1 {
          color: var(--primary);
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .subtitle {
          color: var(--gray);
          font-size: 1.1rem;
        }
        
        .card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .total-items {
          background-color: var(--light-gray);
          color: var(--gray);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .inventory-form {
          display: flex;
          flex-direction: column;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark);
        }
        
        input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
        }
        
        input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: var(--border-radius);
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          gap: 0.5rem;
        }
        
        .btn-primary {
          background-color: var(--primary);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background-color: var(--secondary);
          color: white;
          margin-left: 0.5rem;
        }
        
        .btn-secondary:hover {
          background-color: #5a6268;
          transform: translateY(-2px);
        }
        
        .btn-danger {
          background-color: var(--danger);
          color: white;
        }
        
        .btn-danger:hover {
          background-color: var(--danger-dark);
          transform: translateY(-2px);
        }
        
        .btn-edit {
          background-color: var(--light-gray);
          color: var(--dark);
        }
        
        .btn-edit:hover {
          background-color: #d1d7dc;
          transform: translateY(-2px);
        }
        
        .inventory-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .inventory-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          margin-bottom: 1rem;
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: var(--transition);
        }
        
        .inventory-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        
        .item-info {
          flex: 1;
        }
        
        .item-name {
          font-weight: 500;
          margin-bottom: 0.3rem;
          display: block;
        }
        
        .item-quantity, .item-updated {
          color: var(--gray);
          font-size: 0.9rem;
          display: block;
        }
        
        .item-updated {
          font-size: 0.8rem;
          margin-top: 0.3rem;
          opacity: 0.8;
        }
        
        .item-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .empty-state, .loading-state {
          text-align: center;
          padding: 3rem;
          color: var(--gray);
        }
        
        .empty-state i, .loading-state i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #e0e0e0;
        }
        
        .empty-state h3 {
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          margin-bottom: 1.5rem;
        }
        
        .alert {
          padding: 1rem;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
        }
        
        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        @media (max-width: 768px) {
          .inventory-app {
            padding: 1rem;
          }
          
          .app-header h1 {
            font-size: 2rem;
          }
          
          .card {
            padding: 1.5rem;
          }
          
          .inventory-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .item-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </div>
  );
}

export default App;