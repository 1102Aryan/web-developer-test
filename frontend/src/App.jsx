import { useState } from 'react'
import jsPDF from 'jspdf'
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

  // Audit state
  const [auditResults, setAuditResults] = useState(null)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false)

  // Export PDF state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Export PDF
  const generatePDFReport = () => {
    setIsGeneratingPDF(true)

    // Simulating process
    setTimeout(() => {
      createPDFReport()
      setIsGeneratingPDF(false)
    }, 1000)
  }

  const createPDFReport = () => {
    // creates a new PDF using jsPDF
    const doc = new jsPDF()

    doc.setFillColor(0, 184, 148)
    doc.rect(0, 0, 220, 30, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('EXPENSE ANALYTICS REPORT', 20, 20)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)

    // Report metadata
    const reportDate = new Date().toLocaleDateString()
    const reportId = `EAR-${Date.now().toString().slice(-6)}`

    doc.text(`Report Date: ${reportDate}`, 20, 45)
    doc.text(`Report ID: ${reportId}`, 120, 45)

    // Executive Dashboard
    doc.setFontSize(16)
    doc.text('EXECUTIVE DASHBOARD', 20, 65)

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0)
    const analysis = analyzeExpenseData(expenses) // Reuse your existing function

    // Dashboard boxes
    doc.setFillColor(240, 240, 240)
    doc.rect(20, 75, 40, 25, 'F')
    doc.rect(70, 75, 40, 25, 'F')
    doc.rect(120, 75, 40, 25, 'F')
    doc.rect(170, 75, 40, 25, 'F')

    doc.setFontSize(10)
    doc.text('Total Expenses', 22, 85)
    doc.setFontSize(14)
    doc.text(`$${totalExpenses.toFixed(0)}`, 22, 95)

    doc.setFontSize(10)
    doc.text('Transactions', 72, 85)
    doc.setFontSize(14)
    doc.text(`${expenses.length}`, 72, 95)

    doc.setFontSize(10)
    doc.text('Pending', 122, 85)
    doc.setFontSize(14)
    doc.text(`${analysis.statusBreakdown.pending?.count || 0}`, 122, 95)

    doc.setFontSize(10)
    doc.text('Categories', 172, 85)
    doc.setFontSize(14)
    doc.text(`${Object.keys(analysis.categoryBreakdown).length}`, 172, 95)

    // Category Analysis Chart (text-based)
    doc.setFontSize(16)
    doc.text('SPENDING BY CATEGORY', 20, 125)

    let yPos = 140
    Object.entries(analysis.categoryBreakdown).forEach(([category, data]) => {
      const percentage = ((data.total / totalExpenses) * 100).toFixed(1)

      // Draw progress bar
      doc.setFillColor(200, 200, 200)
      doc.rect(20, yPos - 3, 100, 6, 'F')

      doc.setFillColor(0, 184, 148)
      doc.rect(20, yPos - 3, (data.total / totalExpenses) * 100, 6, 'F')

      doc.setFontSize(12)
      doc.text(`${category}`, 130, yPos)
      doc.text(`$${data.total.toFixed(2)} (${percentage}%)`, 130, yPos + 8)

      yPos += 20
    })

    // Insights and Recommendations
    yPos += 10
    doc.setFontSize(16)
    doc.text('KEY INSIGHTS & RECOMMENDATIONS', 20, yPos)

    yPos += 15
    doc.setFontSize(11)

    // Add insights
    analysis.insights.forEach((insight, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 30
      }
      doc.text(`• ${insight}`, 25, yPos)
      yPos += 10
    })

    yPos += 5
    analysis.recommendations.forEach((rec, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 30
      }
      doc.text(`→ ${rec}`, 25, yPos)
      yPos += 10
    })

    // Save advanced PDF
    const fileName = `Advanced_Expense_Analytics_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)

    alert(`PDF report "${fileName}" has been downloaded!`)
  }

  // Audit Summariser
  const generateAuditSummary = () => {
    // Analyze actual expense data
    const analysis = analyzeExpenseData(expenses)

    // Generate summary report
    const auditReport = createAuditReport(analysis)

    // Show results in modal or new section
    setAuditResults(auditReport)
    setShowAuditModal(true)
  }

  // Smart analysis of expense data
  const analyzeExpenseData = (expenses) => {
    const analysis = {
      totalExpenses: 0,
      categoryBreakdown: {},
      statusBreakdown: {},
      timeAnalysis: {},
      anomalies: [],
      insights: [],
      recommendations: []
    }

    // Calculate totals and breakdowns
    expenses.forEach(expense => {
      analysis.totalExpenses += expense.cost

      // Category breakdown
      if (!analysis.categoryBreakdown[expense.category]) {
        analysis.categoryBreakdown[expense.category] = { total: 0, count: 0 }
      }
      analysis.categoryBreakdown[expense.category].total += expense.cost
      analysis.categoryBreakdown[expense.category].count += 1

      // Status breakdown
      if (!analysis.statusBreakdown[expense.status]) {
        analysis.statusBreakdown[expense.status] = { total: 0, count: 0 }
      }
      analysis.statusBreakdown[expense.status].total += expense.cost
      analysis.statusBreakdown[expense.status].count += 1

      // Time analysis (by month)
      const month = expense.date.substring(0, 7) // YYYY-MM
      if (!analysis.timeAnalysis[month]) {
        analysis.timeAnalysis[month] = { total: 0, count: 0 }
      }
      analysis.timeAnalysis[month].total += expense.cost
      analysis.timeAnalysis[month].count += 1
    })

    // Detect anomalies
    const avgExpense = analysis.totalExpenses / expenses.length
    expenses.forEach(expense => {
      if (expense.cost > avgExpense * 2) {
        analysis.anomalies.push({
          type: 'High Cost',
          item: expense.item,
          cost: expense.cost,
          severity: expense.cost > avgExpense * 3 ? 'High' : 'Medium'
        })
      }
    })

    // Generate insights
    const topCategory = Object.keys(analysis.categoryBreakdown)
      .reduce((a, b) => analysis.categoryBreakdown[a].total > analysis.categoryBreakdown[b].total ? a : b)

    analysis.insights.push(`Highest spending category: ${topCategory} ($${analysis.categoryBreakdown[topCategory].total.toFixed(2)})`)

    const pendingTotal = analysis.statusBreakdown.pending?.total || 0
    if (pendingTotal > 0) {
      analysis.insights.push(`$${pendingTotal.toFixed(2)} in pending approvals requiring attention`)
    }

    // Generate recommendations
    if (analysis.anomalies.length > 0) {
      analysis.recommendations.push('Review high-cost expenses flagged as anomalies')
    }

    if (pendingTotal > analysis.totalExpenses * 0.3) {
      analysis.recommendations.push('Consider expediting approval process for pending expenses')
    }

    Object.keys(analysis.categoryBreakdown).forEach(category => {
      const categoryTotal = analysis.categoryBreakdown[category].total
      if (categoryTotal > analysis.totalExpenses * 0.4) {
        analysis.recommendations.push(`${category} expenses are ${((categoryTotal / analysis.totalExpenses) * 100).toFixed(1)}% of total - consider budget review`)
      }
    })

    return analysis
  }

  // Create formatted audit report
  const createAuditReport = (analysis) => {
    const currentDate = new Date().toLocaleDateString()
    const reportId = 'AUD-' + Date.now().toString().slice(-6)

    return {
      reportId,
      generatedDate: currentDate,
      period: `${Object.keys(analysis.timeAnalysis).sort()[0]} to ${Object.keys(analysis.timeAnalysis).sort().pop()}`,
      summary: {
        totalExpenses: analysis.totalExpenses,
        totalTransactions: Object.values(analysis.categoryBreakdown).reduce((sum, cat) => sum + cat.count, 0),
        pendingAmount: analysis.statusBreakdown.pending?.total || 0,
        averageExpense: analysis.totalExpenses / Object.values(analysis.categoryBreakdown).reduce((sum, cat) => sum + cat.count, 0)
      },
      categoryBreakdown: analysis.categoryBreakdown,
      statusBreakdown: analysis.statusBreakdown,
      anomalies: analysis.anomalies,
      insights: analysis.insights,
      recommendations: analysis.recommendations,
      complianceScore: calculateComplianceScore(analysis),
      riskLevel: calculateRiskLevel(analysis)
    }
  }

  // Calculate compliance score (0-100)
  const calculateComplianceScore = (analysis) => {
    let score = 100

    // Deduct points for anomalies
    score -= analysis.anomalies.length * 10

    // Deduct points for high pending ratio
    const pendingRatio = (analysis.statusBreakdown.pending?.total || 0) / analysis.totalExpenses
    if (pendingRatio > 0.3) score -= 20
    if (pendingRatio > 0.5) score -= 30

    return Math.max(0, Math.min(100, score))
  }

  // Calculate risk level
  const calculateRiskLevel = (analysis) => {
    const anomalyCount = analysis.anomalies.length
    const pendingRatio = (analysis.statusBreakdown.pending?.total || 0) / analysis.totalExpenses

    if (anomalyCount > 2 || pendingRatio > 0.5) return 'High'
    if (anomalyCount > 0 || pendingRatio > 0.3) return 'Medium'
    return 'Low'
  }

  const AuditSummaryModal = ({ auditResults, onClose }) => {
    if (!auditResults) return null
  }

  const handleGenerateSummary = () => {
    setIsGeneratingAudit(true)

    // Simulate AI proccessing
    setTimeout(() => {
      const analysis = analyzeExpenseData(expenses)
      const auditReport = createAuditReport(analysis)
      setAuditResults(auditReport)
      setIsGeneratingAudit(false)
      setShowAuditModal(true)
    }, 1500)
    // console.log('Generate Audit Summary')
    // alert('Audit Summary would generate here. This would use LLM to summarise')
  }


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

  // Handle row selection 
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
        {/* Right Panel - Reports & Export */}
        <div className='right-panel'>
          <div className='section'>
            <h3><span className="section-icon">R</span>Reports & Export</h3>

            <div className='report-section'>
              <h4>Audit Summary</h4>
              <p>Generate comprehensive expense audit</p>
              <button
                className={`btn btn-warning ${isGeneratingAudit ? 'generating-audit' : ''}`}
                onClick={handleGenerateSummary}
                disabled={isGeneratingAudit}
              >
                {isGeneratingAudit ? 'Analyzing Data...' : 'Generate Audit Summary'}
              </button>
            </div>

            <div className="divider"></div>

            <div className='report-section'>
              <h4>PDF Report</h4>
              <p>Export detailed financial report</p>
              <button className={`btn btn-success ${isGeneratingPDF ? 'generating-pdf' : ''}`}
                onClick={generatePDFReport}
                disabled={isGeneratingPDF}>
                {isGeneratingPDF ? 'Generating PDF...' : 'PDF Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal - MOVED OUTSIDE right-panel and FIXED */}
        {showAuditModal && auditResults && (
          <div className="audit-modal-overlay" onClick={() => setShowAuditModal(false)}>
            <div className="audit-modal" onClick={e => e.stopPropagation()}>
              <div className="audit-header">
                <h2>Expense Audit Summary</h2>
                <button className="close-btn" onClick={() => setShowAuditModal(false)}>×</button>
              </div>

              <div className="audit-content">
                <div className="audit-meta">
                  <div className="meta-item">
                    <strong>Report ID:</strong> {auditResults.reportId}
                  </div>
                  <div className="meta-item">
                    <strong>Generated:</strong> {auditResults.generatedDate}
                  </div>
                  <div className="meta-item">
                    <strong>Period:</strong> {auditResults.period}
                  </div>
                </div>

                <div className="audit-summary-cards">
                  <div className="summary-card">
                    <h4>Total Expenses</h4>
                    <div className="summary-value">${auditResults.summary.totalExpenses.toFixed(2)}</div>
                  </div>
                  <div className="summary-card">
                    <h4>Transactions</h4>
                    <div className="summary-value">{auditResults.summary.totalTransactions}</div>
                  </div>
                  <div className="summary-card">
                    <h4>Compliance Score</h4>
                    <div className={`summary-value score-${auditResults.complianceScore >= 80 ? 'good' : auditResults.complianceScore >= 60 ? 'fair' : 'poor'}`}>
                      {auditResults.complianceScore}%
                    </div>
                  </div>
                  <div className="summary-card">
                    <h4>Risk Level</h4>
                    <div className={`summary-value risk-${auditResults.riskLevel.toLowerCase()}`}>
                      {auditResults.riskLevel}
                    </div>
                  </div>
                </div>

                <div className="audit-section">
                  <h3>Category Breakdown</h3>
                  <div className="category-list">
                    {Object.entries(auditResults.categoryBreakdown).map(([category, data]) => (
                      <div key={category} className="category-item">
                        <span className="category-name">{category}</span>
                        <span className="category-stats">
                          ${data.total.toFixed(2)} ({data.count} items)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {auditResults.anomalies.length > 0 && (
                  <div className="audit-section">
                    <h3>Anomalies Detected</h3>
                    {auditResults.anomalies.map((anomaly, index) => (
                      <div key={index} className={`anomaly-item severity-${anomaly.severity.toLowerCase()}`}>
                        <strong>{anomaly.type}:</strong> {anomaly.item} (${anomaly.cost.toFixed(2)})
                      </div>
                    ))}
                  </div>
                )}

                <div className="audit-section">
                  <h3>Key Insights</h3>
                  <ul className="insights-list">
                    {auditResults.insights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="audit-section">
                  <h3>Recommendations</h3>
                  <ul className="recommendations-list">
                    {auditResults.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="audit-footer">
                <button className="btn btn-primary" onClick={() => setShowAuditModal(false)}>Close Report</button>
                <button className="btn btn-secondary" onClick={() => window.print()}>Print Report</button>
              </div>
            </div>
          </div>
        )}
      </div >
    </div>
  )
}

export default App