import { useState } from 'react'
import './App.css'

// import ExpenseTable from './components/Table/ExpenseTable';
// import ChartContainer from './components/Charts/ChartContainer';

function App() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2025-09-08',
      item: 'Office Supplies',
      description: 'Notebooks and pens',
      category: 'Office',
      cost: 245.50,
      status: 'approved'
    },
    {
      id: 2,
      date: '2025-09-07',
      item: 'Client Lunch',
      description: 'Business meeting',
      category: 'Meals',
      cost: 89.25,
      status: 'pending'
    }
  ])

  const [selectedRowId, setSelectedRowId] = useState(null)
  const [editingRowId, setEditingRowId] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [fileUpload, setFileUpload] = useState(null)

  // Handle row selection (click anywhere on row)
  const handleRowSelect = (id) => {
    setSelectedRowId(id)
  }

  // Delete row
  const handleDeleteClick = () => {
    if (selectedRowId) {
      if (window.confirm('Are you sure you want to delete this expense?')) {
        setExpenses(expenses.filter(expense => expense.id !== selectedRowId))
        setSelectedRowId(null)
        setEditingRowId(null)
      } else {
        alert('Please select a row to edit')
      }
    }
  }

  // Handle edit button click
  const handleEditClick = (id) => {
    if (selectedRowId) {
      const expense = expenses.find(exp => exp.id === selectedRowId)
      setEditingRowId(selectedRowId)
      setEditFormData(expense) // Pre-fill form with current data
    } else {
      alert('Please select a row to edit')
    }
  }

  // Handle add new row
  const handleAddRow = () => {
    const newExpense = {
      id: Date.now(), // Simple ID generation
      date: new Date().toISOString().split('T')[0],
      item: 'New Item',
      description: 'Enter description',
      category: 'Office',
      cost: 0,
      status: 'pending'
    }
    setExpenses([...expenses, newExpense])
    setSelectedRowId(newExpense.id) // Auto-select the new row
    setEditingRowId(newExpense.id) // Auto-start editing the new row
    setEditFormData(newExpense)
  }

  // Handle form input changes during editing
  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: field === 'cost' ? parseFloat(value) || 0 : value
    }))
  }

  // Save edited data
  const handleSaveEdit = () => {
    setExpenses(expenses.map(expense =>
      expense.id === editingRowId ? editFormData : expense
    ))
    setEditingRowId(null)
    setEditFormData({})
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRowId(null)
    setEditFormData({})
  }


  // Summaries Audit
  const generateSummary = () => {
    console.log('Generate Audit Summary')
    alert('Audit Summary would generate here. This would use LLM to summarise')
  }

  // Create PDF report
  const generatePDFReport = () => {
    console.log('Generating PDF report...')
    alert('PDF report would be generated here. This would use jsPDF library.')
  }



  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Developer Assessment</h1>
        <p>Enterprise Expense Management System</p>
      </header>

      {/* Full-width sections */}
      <div className="full-width-content">

        {/* Dashboard Overview - Full Width */}
        <div className='section'>
          <h3><span className="section-icon">D</span>Dashboard Overview</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-number">$3,245</div>
              <div className="stat-label">Total Expenses</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3</div>
              <div className="stat-label">Pending Approval</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$1,755</div>
              <div className="stat-label">This Month</div>
            </div>
          </div>
        </div>

        {/* Data Table with CRUD operations */}
        <div className='section'>
          <h3><span className="section-icon">T</span>Data Table</h3>

          {/* Instructions */}
          <div className="instructions-box">
            Instructions: Click on a row to select it, then use Edit or Delete.
            When editing, click Save Edit to confirm changes.
          </div>

          <div className="table-placeholder">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    onClick={() => handleRowSelect(expense.id)}
                    className={`
                      clickable-row
                      ${selectedRowId === expense.id ? 'selected-row' : ''} 
                      ${editingRowId === expense.id ? 'editing-row' : ''}
                    `}
                  >
                    <td>
                      {editingRowId === expense.id ? (
                        <input
                          type="date"
                          value={editFormData.date || ''}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        expense.date
                      )}
                    </td>
                    <td>
                      {editingRowId === expense.id ? (
                        <input
                          type="text"
                          value={editFormData.item || ''}
                          onChange={(e) => handleInputChange('item', e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        expense.item
                      )}
                    </td>
                    <td>
                      {editingRowId === expense.id ? (
                        <input
                          type="text"
                          value={editFormData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="edit-input"
                        />
                      ) : (
                        expense.description
                      )}
                    </td>
                    <td>
                      {editingRowId === expense.id ? (
                        <select
                          value={editFormData.category || 'Office'}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="edit-input"
                        >
                          <option value="Office">Office</option>
                          <option value="Travel">Travel</option>
                          <option value="Meals">Meals</option>
                          <option value="Software">Software</option>
                          <option value="Equipment">Equipment</option>
                        </select>
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td className="cost-cell">
                      {editingRowId === expense.id ? (
                        <input
                          type="number"
                          value={editFormData.cost || 0}
                          onChange={(e) => handleInputChange('cost', e.target.value)}
                          className="edit-input"
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        `$${expense.cost.toFixed(2)}`
                      )}
                    </td>
                    <td>
                      {editingRowId === expense.id ? (
                        <select
                          value={editFormData.status || 'pending'}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="edit-input"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                        </select>
                      ) : (
                        <span className={`status-${expense.status}`}>
                          {expense.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit controls when in editing mode */}
          {editingRowId && (
            <div className="edit-controls">
              <button
                className="btn btn-success edit-control-btn"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary edit-control-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          )}
          <div className='table-controls'>
            <div className='modify-table'>
              <button
                className='btn btn-edit'
                onClick={handleEditClick}
              >
                {editingRowId ? 'Save Edit' : 'Edit Row'}
              </button>
              <button
                className='btn btn-delete'
                onClick={handleDeleteClick}
              >
                Delete Row
              </button>
            </div>
            <button
              className='btn btn-primary'
              onClick={handleAddRow}
            >
              Add New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Split Panel Layout - Only for File Upload and Reports */}
      <div className="split-content">

        {/* Left Panel - File Upload */}
        <div className='left-panel'>
          <div className='section'>
            <h3><span className="section-icon">F</span>File Upload & OCR</h3>
            <div className='upload-zone'>
              <div className="upload-icon">DOC</div>
              <p><strong>Drag & drop or click to upload</strong></p>
              <p><small>PDF, JPG, PNG supported</small></p>
              <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} />
            </div>
            <div className="divider"></div>
            <p style={{ fontSize: '12px', color: '#636e72', textAlign: 'center' }}>
              OCR will extract data automatically
            </p>
          </div>
        </div>

        {/* Right Panel - Reports & Export */}
        <div className='right-panel'>
          <div className='section'>
            <h3><span className="section-icon">R</span>Reports & Export</h3>

            <div className='report-section'>
              <h4>Audit Summary</h4>
              <p>Generate comprehensive expense audit</p>
              <button className="btn btn-warning">Generate Audit Summary</button>
            </div>

            <div className="divider"></div>

            <div className='report-section'>
              <h4>PDF Report</h4>
              <p>Export detailed financial report</p>
              <button className="btn btn-success">Generate PDF Report</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default App