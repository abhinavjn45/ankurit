document.addEventListener('DOMContentLoaded', () => {
    // Determine the Google Sheet GID from the body tag
    const sheetGid = document.body.dataset.sheetGid;
    if (!sheetGid) {
        return; // No dynamic content defined for this page
    }

    // URL to the published CSV
    // Added cache-busting parameter so updates show immediately
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT05Mju4ACXBCF2Jjg17R-_BtKWTVx6g2zORt6VryO9RaZirjCoawfz-EB-hd4asn_F67hOvsL21Gti/pub?output=csv&gid=' + sheetGid + '&t=' + new Date().getTime();

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            const data = parseCSV(csvText);
            
            if(data.length < 2) {
                console.error('Dynamic Content: CSV data is empty or too short');
                return;
            }
            
            const headers = data[0].map(h => h ? h.trim() : '');
            
            // Allow for different column name prefixes (hp_option_key vs fp_option_key)
            let keyIndex = headers.findIndex(h => h.endsWith('option_key'));
            let valueIndex = headers.findIndex(h => h.endsWith('option_value'));

            if (keyIndex === -1 || valueIndex === -1) {
                console.error('Dynamic Content: Could not find required columns in the sheet. Headers found:', headers);
                return;
            }

            // Create a map of key -> value
            const contentMap = {};
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                if (row.length > keyIndex && row.length > valueIndex) {
                    contentMap[row[keyIndex].trim()] = row[valueIndex];
                }
            }
            
            console.log('Dynamic Content mapped from sheets:', contentMap);

            // Flood the DOM with values based on element IDs matching the keys
            for (const [key, value] of Object.entries(contentMap)) {
                if (!key || !value) continue; // Skip empty keys or values
                
                const element = document.getElementById(key);
                if (element) {
                    if (key.endsWith('_link')) {
                        // For keys ending in _link, we update the href attribute
                        element.href = value;
                    } else if (key.endsWith('_image')) {
                        // For keys ending in _image, we update the src attribute
                        element.src = value;
                    } else {
                        // Otherwise, we update the innerHTML to support span/br tags from the sheet
                        element.innerHTML = value;
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching Google Sheet content:', error));

    /**
     * A robust CSV parser that correctly handles quoted strings and newlines within cells.
     */
    function parseCSV(str) {
        const arr = [];
        let quote = false;
        let row = 0, col = 0;
        
        for (let c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c+1];
            arr[row] = arr[row] || [];
            arr[row][col] = arr[row][col] || '';

            // Handle escaped quotes inside quoted strings
            if (cc === '"' && quote && nc === '"') {
                arr[row][col] += cc; 
                ++c; 
                continue;
            }
            // Toggle quote flag
            if (cc === '"') {
                quote = !quote; 
                continue;
            }
            // Handle column separator (comma)
            if (cc === ',' && !quote) {
                ++col; 
                continue;
            }
            // Handle row separators (CRLF, LF, CR)
            if (cc === '\r' && nc === '\n' && !quote) {
                ++row; col = 0; ++c; 
                continue;
            }
            if (cc === '\n' && !quote) {
                ++row; col = 0; 
                continue;
            }
            if (cc === '\r' && !quote) {
                ++row; col = 0; 
                continue;
            }
            
            // Regular character
            arr[row][col] += cc;
        }
        return arr;
    }
});
