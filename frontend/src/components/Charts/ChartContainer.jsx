import React, { useState } from 'react';

const ChartContainer = ({ expenses }) => {
  const [activeChart, setActiveChart] = useState('category');
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="charts-container">
        <div className="no-data-message">
          <div className="no-data-icon">CHART</div>
          <h4>No Data Available</h4>
          <p>Add some expenses to see analytics and insights</p>
        </div>
      </div>
    );
  }

  // Calculate data for different chart types
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.cost;
    return acc;
  }, {});

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.cost, 0);
  const maxCategoryValue = Math.max(...Object.values(categoryData));

  // Monthly data
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + expense.cost;
    return acc;
  }, {});

  const maxMonthlyValue = Math.max(...Object.values(monthlyData));

  const colors = ['#00b894', '#74b9ff', '#fdcb6e', '#e17055', '#6c5ce7', '#2d3436'];

  const renderCategoryChart = () => (
    <div className="chart-content">
      <h4>Expenses by Category</h4>
      <div className="bar-chart">
        {Object.entries(categoryData).map(([category, amount], index) => {
          const percentage = (amount / maxCategoryValue) * 100;
          
          return (
            <div key={category} className="bar-item">
              <div className="bar-label">{category}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                ></div>
              </div>
              <div className="bar-value">${amount.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPieChart = () => {
    let currentAngle = 0;
    
    return (
      <div className="chart-content">
        <h4>Category Distribution</h4>
        <div className="pie-chart-container">
          <div className="pie-chart">
            <svg width="250" height="250" viewBox="0 0 250 250">
              {/* Center circle for total */}
              <circle 
                cx="125" 
                cy="125" 
                r="50" 
                fill="#ffffff" 
                stroke="#e1e5e9" 
                strokeWidth="2"
              />
              {Object.entries(categoryData).map(([category, amount], index) => {
                const percentage = amount / totalExpenses;
                const angle = percentage * 360;
                
                // Calculate path for pie slice
                const startAngle = (currentAngle * Math.PI) / 180;
                const endAngle = ((currentAngle + angle) * Math.PI) / 180;
                
                const x1 = 125 + 90 * Math.cos(startAngle);
                const y1 = 125 + 90 * Math.sin(startAngle);
                const x2 = 125 + 90 * Math.cos(endAngle);
                const y2 = 125 + 90 * Math.sin(endAngle);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 125 125`,
                  `L ${x1} ${y1}`,
                  `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                currentAngle += angle;
                
                return (
                  <path
                    key={category}
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                );
              })}
              {/* Center text */}
              <text 
                x="125" 
                y="120" 
                textAnchor="middle" 
                fontSize="16" 
                fontWeight="bold" 
                fill="#1d1f1eff"
              >
                ${totalExpenses.toFixed(0)}
              </text>
              <text 
                x="125" 
                y="135" 
                textAnchor="middle" 
                fontSize="10" 
                fill="#636e72"
              >
                TOTAL
              </text>
            </svg>
          </div>
          <div className="pie-legend">
            {Object.entries(categoryData).map(([category, amount], index) => {
              const percentage = ((amount / totalExpenses) * 100).toFixed(1);
              
              return (
                <div key={category} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <span className="legend-text">
                    {category}: ${amount.toFixed(2)} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlyChart = () => (
    <div className="chart-content">
      <h4>Monthly Expenses</h4>
      <div className="bar-chart">
        {Object.entries(monthlyData).map(([month, amount], index) => {
          const percentage = (amount / maxMonthlyValue) * 100;
          
          return (
            <div key={month} className="bar-item">
              <div className="bar-label">{month}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: '#00b894'
                  }}
                ></div>
              </div>
              <div className="bar-value">${amount.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="charts-container">
      <div className="chart-controls">
        <button 
          className={`chart-btn ${activeChart === 'category' ? 'active' : ''}`}
          onClick={() => setActiveChart('category')}
        >
          Bar Chart
        </button>
        <button 
          className={`chart-btn ${activeChart === 'pie' ? 'active' : ''}`}
          onClick={() => setActiveChart('pie')}
        >
          Pie Chart
        </button>
        <button 
          className={`chart-btn ${activeChart === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveChart('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className="chart-display">
        {activeChart === 'category' && renderCategoryChart()}
        {activeChart === 'pie' && renderPieChart()}
        {activeChart === 'monthly' && renderMonthlyChart()}
      </div>

      {/* Quick Stats */}
      <div className="chart-insights">
        <div className="insight-card">
          <span className="insight-icon">$</span>
          <div className="insight-content">
            <strong>Total Spent</strong>
            <span>${totalExpenses.toFixed(2)}</span>
          </div>
        </div>
        <div className="insight-card">
          <span className="insight-icon">AVG</span>
          <div className="insight-content">
            <strong>Average Expense</strong>
            <span>${(totalExpenses / expenses.length).toFixed(2)}</span>
          </div>
        </div>
        <div className="insight-card">
          <span className="insight-icon">TOP</span>
          <div className="insight-content">
            <strong>Top Category</strong>
            <span>{Object.entries(categoryData).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}</span>
          </div>
        </div>
        <div className="insight-card">
          <span className="insight-icon">#</span>
          <div className="insight-content">
            <strong>Categories</strong>
            <span>{Object.keys(categoryData).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;