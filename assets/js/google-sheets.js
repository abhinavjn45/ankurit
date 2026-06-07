/* assets/js/google-sheets.js */
/**
 * Module to handle dynamic data loading from Google Sheets.
 * Google Sheets can be published to web as CSV or accessed via Google Apps Script API.
 */

const SHEET_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

/**
 * Fetch data from a specific sub-sheet
 * @param {string} sheetName - The name of the sub-sheet to fetch
 * @returns {Promise<Array>} - Array of row objects
 */
async function fetchSheetData(sheetName) {
    try {
        // Example logic for Google Apps Script Web App that returns JSON
        /*
        const response = await fetch(`${SHEET_API_URL}?sheet=${sheetName}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
        */
        
        // Mock data for demonstration purposes until URL is provided
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: 'Project Alpha', description: 'A sleek e-commerce platform.', category: 'Web Dev' },
                    { id: 2, title: 'Brand Identity', description: 'Modern logo and branding.', category: 'Design' },
                    { id: 3, title: 'Marketing Campaign', description: 'High converting landing page.', category: 'Marketing' }
                ]);
            }, 1000);
        });
    } catch (error) {
        console.error(`Error fetching data from ${sheetName}:`, error);
        return [];
    }
}

/**
 * Render data to the DOM
 * @param {Array} data - The array of data objects to render
 * @param {HTMLElement} container - The container to render into
 */
function renderData(data, container) {
    container.innerHTML = ''; // Clear loading spinner
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data available.</p>';
        return;
    }
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <p style="color: var(--text-secondary); margin: 0.5rem 0;">${item.category}</p>
            <p>${item.description}</p>
        `;
        container.appendChild(card);
    });
}
