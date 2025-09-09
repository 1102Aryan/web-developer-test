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

  // Table state
  const [selectedRowId, setSelectedRowId] = useState(null)
  const [editingRowId, setEditingRowId] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  // File upload function
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  // Drag file drop
  const handleFileDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const processFile = (file) => {
    // Reset states
    setUploadError(null)
    setExtractedData(null)

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF, JPG, or PNG file')
      return
    }

    // Handle max file size (10mb)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10mb')
      return
    }

    // Set uploaded file
    setUploadedFile(file)
    setIsProcessing(true)

    // Simulate OCR processing (in real app, this would call OCR service)
    simulateOCR(file)
  }

  const simulateOCR = (file) => {
    // Simulate processing time
    setTimeout(() => {
      // Mock OCR results based on file name or type
      let mockData = {}

      if (file.name.toLowerCase().includes('receipt') || file.name.toLowerCase().includes('invoice')) {
        mockData = {
          text: "RECEIPT\n\nOffice Depot\nDate: 2025-09-08\nNotebooks: $15.99\nPens (3-pack): $8.50\nTax: $2.45\nTotal: $26.94",
          extractedExpense: {
            item: "Office Supplies",
            description: "Notebooks and pens from Office Depot",
            category: "Office",
            cost: 26.94,
            date: "2025-09-08",
            status: "pending"
          }
        }
      } else {
        mockData = {
          text: "Sample extracted text from uploaded file.\n\nThis would contain the actual OCR results in a real implementation.",
          extractedExpense: {
            item: "Unknown Item",
            description: "Extracted from " + file.name,
            category: "Office",
            cost: 0,
            date: new Date().toISOString().split('T')[0],
            status: "pending"
          }
        }
      }

      setExtractedData(mockData)
      setIsProcessing(false)
    }, 2000) // 2 second delay to simulate processing
  }

  const addExtractedExpense = () => {
    if (extractedData && extractedData.extractedExpense) {
      const newExpense = {
        ...extractedData.extractedExpense,
        id: Date.now()
      }
      setExpenses([...expenses, newExpense])

      // Clear extracted data and file
      setExtractedData(null)
      setUploadedFile(null)

      // Clear file input
      const fileInput = document.getElementById('fileInput')
      if (fileInput) fileInput.value = ''

      alert('Expense added to table successfully!')
    }
  }

  const clearUploadedFile = () => {
    setUploadedFile(null)
    setExtractedData(null)
    setUploadError(null)
    setIsProcessing(false)

    // Clear file input
    const fileInput = document.getElementById('fileInput')
    if (fileInput) fileInput.value = ''
  }

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
        alert('Please select a row to delete')
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


        {/* Data Visualization - Full Width */}
        <div className='section'>
          <h3><span className="section-icon">C</span>Data Visualization</h3>
          <div className="chart-placeholder">
            <div className="chart-mock">
              <p>Expense Analysis Chart</p>
              <div className="chart-bars">
                <div className="bar" style={{ height: '80px' }}></div>
                <div className="bar" style={{ height: '45px' }}></div>
                <div className="bar" style={{ height: '95px' }}></div>
                <div className="bar" style={{ height: '60px' }}></div>
              </div>
              <p><small>Expenses by Category</small></p>
            </div>
          </div>
        </div>
      </div>

      {/* Split Panel Layout - Only for File Upload and Reports */}
      {/* Left Panel - File Upload */}
      <div className="split-content">
        <div className='left-panel'>
          <div className='section'>
            <h3><span className="section-icon">F</span>File Upload & OCR</h3>

            {/* Upload Area */}
            <div
              className={`upload-zone ${isProcessing ? 'processing' : ''}`}
              onClick={() => !isProcessing && document.getElementById('fileInput').click()}
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >
              <div className="upload-icon">
                {isProcessing ? 'PROC' : 'DOC'}
              </div>
              <p>
                <strong>
                  {isProcessing ? 'Processing file...' : 'Drag & drop or click to upload'}
                </strong>
              </p>
              <p><small>PDF, JPG, PNG supported (max 10MB)</small></p>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="upload-error">
                <p>Error: {uploadError}</p>
              </div>
            )}

            {/* Uploaded File Info */}
            {uploadedFile && (
              <div className="file-info">
                <h4>Uploaded File:</h4>
                <div className="file-details">
                  <p><strong>Name:</strong> {uploadedFile.name}</p>
                  <p><strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Type:</strong> {uploadedFile.type}</p>
                  <p><strong>Last Modified:</strong> {new Date(uploadedFile.lastModified).toLocaleString()}</p>
                </div>
                <button className="btn btn-secondary clear-file-btn" onClick={clearUploadedFile}>
                  Clear File
                </button>
              </div>
            )}

            {/* OCR Results */}
            {extractedData && (
              <div className="ocr-results">
                <h4>OCR Extraction Results:</h4>
                <div className="extracted-text">
                  <h5>Raw Text:</h5>
                  <pre>{extractedData.text}</pre>
                </div>
                <div className="parsed-data">
                  <h5>Parsed Expense Data:</h5>
                  <div className="parsed-fields">
                    <p><strong>Item:</strong> {extractedData.extractedExpense.item}</p>
                    <p><strong>Description:</strong> {extractedData.extractedExpense.description}</p>
                    <p><strong>Category:</strong> {extractedData.extractedExpense.category}</p>
                    <p><strong>Cost:</strong> ${extractedData.extractedExpense.cost}</p>
                    <p><strong>Date:</strong> {extractedData.extractedExpense.date}</p>
                  </div>
                  <button className="btn btn-success add-expense-btn" onClick={addExtractedExpense}>
                    Add to Expense Table
                  </button>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <p>Processing file with OCR...</p>
              </div>
            )}
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
      </div >
    </div>
  )
}

export default App