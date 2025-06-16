// Chart instances
const charts = {
    overview: null,
    lipids: null,
    vitamins: null,
    metabolic: null,
    trends: null
};

// Biomarker configurations
const biomarkerConfig = {
    // Lipid Profile
    'Total Cholesterol': {
        label: 'Total Cholesterol',
        unit: 'mg/dL',
        color: '#3498db',
        normal: { min: 100, max: 200 },
        borderline: { min: 200, max: 240 },
        high: { min: 240, max: 500 },
        category: 'lipids'
    },
    'HDL': {
        label: 'HDL Cholesterol',
        unit: 'mg/dL',
        color: '#2ecc71',
        low: { min: 0, max: 40 },
        normal: { min: 40, max: 60 },
        high: { min: 60, max: 100 },
        category: 'lipids'
    },
    'LDL': {
        label: 'LDL Cholesterol',
        unit: 'mg/dL',
        color: '#e74c3c',
        normal: { min: 0, max: 100 },
        borderline: { min: 100, max: 160 },
        high: { min: 160, max: 300 },
        category: 'lipids'
    },
    'Triglycerides': {
        label: 'Triglycerides',
        unit: 'mg/dL',
        color: '#9b59b6',
        normal: { min: 0, max: 150 },
        borderline: { min: 150, max: 200 },
        high: { min: 200, max: 1000 },
        category: 'lipids'
    },
    // Vitamins & Minerals
    'Vitamin D': {
        label: 'Vitamin D',
        unit: 'ng/mL',
        color: '#f1c40f',
        deficient: { min: 0, max: 20 },
        insufficient: { min: 20, max: 30 },
        normal: { min: 30, max: 100 },
        category: 'vitamins'
    },
    'Vitamin B12': {
        label: 'Vitamin B12',
        unit: 'pg/mL',
        color: '#27ae60',
        low: { min: 0, max: 200 },
        normal: { min: 200, max: 900 },
        high: { min: 900, max: 2000 },
        category: 'vitamins'
    },
    // Metabolic Markers
    'HbA1c': {
        label: 'HbA1c',
        unit: '%',
        color: '#e67e22',
        normal: { min: 4, max: 5.7 },
        prediabetic: { min: 5.7, max: 6.5 },
        diabetic: { min: 6.5, max: 15 },
        category: 'metabolic'
    },
    'Creatinine': {
        label: 'Creatinine',
        unit: 'mg/dL',
        color: '#16a085',
        normal: { min: 0.6, max: 1.2 },
        high: { min: 1.2, max: 4.0 },
        category: 'metabolic'
    }
};

// Function to format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Function to get status class based on value and ranges
function getValueStatus(value, ranges) {
    if (!ranges) return '';
    if (ranges.normal && value <= ranges.normal.max && value >= ranges.normal.min) return 'normal';
    if (ranges.high && value >= ranges.high.min) return 'high';
    if (ranges.low && value <= ranges.low.max) return 'low';
    return '';
}

// Function to create a chart
function createChart(ctx, data, biomarkers) {
    const datasets = biomarkers.map(marker => {
        const config = biomarkerConfig[marker];
        return {
            label: config.label,
            data: data.map(d => ({ x: d.date, y: d[marker] })),
            borderColor: config.color,
            backgroundColor: `${config.color}33`,
            tension: 0.4,
            fill: true
        };
    });

    return new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM D, YYYY'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const marker = biomarkers[context.datasetIndex];
                            const config = biomarkerConfig[marker];
                            return `${config.label}: ${context.parsed.y} ${config.unit}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to create biomarker cards
function createBiomarkerCards(data) {
    const categorizedMarkers = {
        lipids: [],
        vitamins: [],
        metabolic: []
    };

    // Categorize biomarkers
    Object.entries(biomarkerConfig).forEach(([key, config]) => {
        if (config.category && categorizedMarkers[config.category]) {
            categorizedMarkers[config.category].push(key);
        }
    });

    // Create cards for each category
    Object.entries(categorizedMarkers).forEach(([category, markers]) => {
        const container = document.getElementById(`${category}Cards`);
        if (!container) return;

        markers.forEach(marker => {
            const latestData = data[data.length - 1];
            const value = latestData[marker];
            const config = biomarkerConfig[marker];
            
            if (value === undefined) return;

            const card = document.createElement('div');
            card.className = 'biomarker-card';
            card.innerHTML = `
                <h5>${config.label}</h5>
                <div class="value-display">
                    <span class="value ${getValueStatus(value, config)}">${value}</span>
                    <span class="unit">${config.unit}</span>
                </div>
                <div class="reference-ranges">
                    ${Object.entries(config)
                        .filter(([key, range]) => typeof range === 'object' && 'min' in range)
                        .map(([key, range]) => `
                            <div class="reference-range-item">
                                <span>${key}:</span>
                                <span>${range.min} - ${range.max}</span>
                            </div>
                        `).join('')}
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// Function to initialize all charts
async function initializeCharts() {
    try {
        const response = await fetch('/static/extracted_data.json');
        const data = await response.json();

        // Sort data by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Initialize date range picker
        $('#dateRange').daterangepicker({
            startDate: moment(data[0].date),
            endDate: moment(data[data.length - 1].date),
            ranges: {
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'Last 3 Months': [moment().subtract(3, 'months'), moment()],
               'Last 6 Months': [moment().subtract(6, 'months'), moment()],
               'Last Year': [moment().subtract(1, 'year'), moment()],
               'All Time': [moment(data[0].date), moment(data[data.length - 1].date)]
            }
        });

        // Create charts for each section
        const contexts = {
            overview: document.getElementById('overviewChart'),
            lipids: document.getElementById('lipidsChart'),
            vitamins: document.getElementById('vitaminsChart'),
            metabolic: document.getElementById('metabolicChart'),
            trends: document.getElementById('trendsChart')
        };

        // Create section-specific charts
        charts.overview = createChart(contexts.overview, data, 
            ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'Vitamin D', 'Vitamin B12', 'HbA1c']);
        charts.lipids = createChart(contexts.lipids, data, 
            ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides']);
        charts.vitamins = createChart(contexts.vitamins, data, 
            ['Vitamin D', 'Vitamin B12']);
        charts.metabolic = createChart(contexts.metabolic, data, 
            ['HbA1c', 'Creatinine']);
        
        // Create trend analysis chart (simplified version)
        charts.trends = createChart(contexts.trends, data, 
            ['Total Cholesterol', 'HDL', 'LDL']);

        // Create biomarker cards
        createBiomarkerCards(data);

        // Add smooth scrolling for bookmarks
        document.querySelectorAll('.bookmark-list a').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCharts);