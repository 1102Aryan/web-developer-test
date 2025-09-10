# Web Developer Test 

**Submission Date:** Wednesday 10th September 2025  
**Developer:** Aryan  
**Technology Stack:** React + Vite, JavaScript, CSS, jsPDF

Click [link](https://1102aryan.github.io/web-developer-test/) to view application

## Project Overview

This project is a comprehensive **Enterprise Expense Management System** built as a single-page React application. It demonstrates full-stack web development capabilities including data management, visualization, file processing, and report generation.

---

## ✅ Requirements Completion Status

| Requirement | Status | Implementation Details |
|-------------|---------|----------------------|
| **Table Creation** | ✅ Complete | Interactive data table with expense records |
| **Add New Line Button** | ✅ Complete | "Add New Entry" button with inline editing |
| **Input Fields & Cost Figures** | ✅ Complete | Date, Item, Description, Category, Cost, Status fields |
| **Graph/Chart Visualization** | ✅ Complete | Multiple chart types showing expense data |
| **File Upload Button** | ✅ Complete | Drag & drop + click upload with validation |
| **Test PDF Document** | ✅ Complete | Mock receipt/invoice processing |
| **OCR Implementation** | ✅ Complete | Simulated OCR with realistic data extraction |
| **Audit Summary** | ✅ Complete | Comprehensive analysis with insights & recommendations |
| **External PDF Report** | ✅ Complete | Professional PDF generation with jsPDF |

---
## Feature Breakdown

### 1. **Data Table (Requirement 1-3)**
- **Interactive Table**: Click-to-select rows with visual feedback
- **CRUD Operations**: Create, Read, Update, Delete expense records
- **Inline Editing**: Edit directly in table cells with form validation
- **Field Types**: Date picker, text inputs, dropdowns, number inputs
- **Cost Management**: Proper currency formatting and validation

**Key Features:**
- Row selection highlighting
- Edit mode with save/cancel options
- Input validation for cost figures
- Category dropdown (Office, Travel, Meals, Software, Equipment)
- Status management (Pending, Approved)

### 2. **Data Visualization (Requirement 4)**
- **Chart Container Component**: Modular chart system
- **Multiple Chart Types**: Bar charts, pie charts
- **Real-time Updates**: Charts automatically update when data changes
- **Category Breakdown**: Visual representation of spending by category

### 3. **File Upload & OCR (Requirements 5-7)**
**Upload Features:**
- Drag & drop interface
- Click-to-upload functionality
- File type validation (PDF, JPG, PNG)
- File size validation (10MB limit)
- Visual feedback during processing

**OCR Simulation:**
- Realistic processing delay simulation
- Text extraction from uploaded files
- Intelligent data parsing for expense fields
- Automatic expense record creation
- Error handling for unsupported files

**Mock OCR Results:**
```javascript
// Example extracted data
{
  text: "RECEIPT\n\nOffice Depot\nDate: 2025-09-08\nNotebooks: $15.99...",
  extractedExpense: {
    item: "Office Supplies",
    description: "Notebooks and pens from Office Depot",
    category: "Office",
    cost: 26.94,
    date: "2025-09-08",
    status: "pending"
  }
}
```

### 4. **Audit Summary (Requirement 8)**
**Smart Analytics Engine:**
- Expense categorization analysis
- Anomaly detection (expenses > 2x average)
- Compliance score calculation (0-100)
- Risk assessment (Low/Medium/High)
- Spending pattern insights

**Generated Insights:**
- Highest spending categories
- Pending approval amounts
- Budget variance analysis
- Expense trend identification

**Modal Report Display:**
- Professional audit report layout
- Interactive compliance scoring
- Detailed recommendations
- Exportable summary data

### 5. **PDF Report Generation (Requirement 9)**
**Professional PDF Reports:**
- Executive summary dashboard
- Category breakdown with progress bars
- Visual spending analysis
- Key insights and recommendations
- Branded report design

**Report Features:**
- Automatic report ID generation
- Date stamping
- Multi-page support
- Professional formatting
- Download functionality

---

## Production Considerations

### Current Limitations (Simulation vs Real Implementation)
Due to time limitations and a busy schedule, I had to simulate processes such as OCR, Dashboard Overview, and Audit Summariser.

#### OCR Service Integration
**Current:** Simulated OCR processing with mock data  
**Production Required:**
```javascript
// Would integrate with services like:
// - Google Cloud Vision API
// - AWS Textract
// - Azure Computer Vision
// - Tesseract.js for client-side processing

const processOCR = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/ocr', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};
```

#### Backend Integration
**Current:** Client-side data storage  
**Production Required:**
- RESTful API endpoints
- Database integration (PostgreSQL/MongoDB)
- File storage (AWS S3/Google Cloud Storage)
- Authentication and authorization

#### Real-time Features
**Production Enhancements:**
- WebSocket connections for real-time updates
- Push notifications for approval workflows
- Email integration for audit reports
- Advanced analytics with machine learning

---

## Demo Data

The application includes realistic sample data:
- Office supplies and equipment purchases
- Business meals and travel expenses
- Software subscriptions
- Various approval statuses and categories

---

