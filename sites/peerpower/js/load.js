const fetchDataAndDisplay = async () => {
    const demandUrl = '/api/demand';
    const windUrl = '/api/wind';

    try {
        const [demandResponse, windResponse] = await Promise.all([
            fetch(demandUrl),
            fetch(windUrl)
        ]);

        const demandData = await demandResponse.json();
        const windData = await windResponse.json();

        // Validate data structures
        if (!demandData.Rows || !Array.isArray(demandData.Rows)) {
            throw new Error('Invalid demand data structure');
        }
        if (!windData.Rows || !Array.isArray(windData.Rows)) {
            throw new Error('Invalid wind data structure');
        }

        // Create promises for finding latest values
        const findLatestDemand = new Promise((resolve, reject) => {
            let found = false;
            for (let i = demandData.Rows.length - 1; i >= 0; i--) {
                if (demandData.Rows[i].Value !== null) {
                    found = true;
                    resolve(demandData.Rows[i]);
                    break;
                }
            }
            if (!found) {
                reject(new Error('No valid demand value found'));
            }
        });

        const findLatestWind = new Promise((resolve, reject) => {
            let found = false;
            for (let i = windData.Rows.length - 1; i >= 0; i--) {
                if (windData.Rows[i].Value !== null) {
                    found = true;
                    resolve(windData.Rows[i]);
                    break;
                }
            }
            if (!found) {
                reject(new Error('No valid wind value found'));
            }
        });

        // Wait for both loops to complete
        const [latestDemand, latestWind] = await Promise.all([
            findLatestDemand,
            findLatestWind
        ]);

        // Now we can safely access the values
        const demandValue = (await latestDemand).Value;
        const windValue = (await latestWind).Value;

        // Validate the values are numbers
        if (typeof demandValue !== 'number' || typeof windValue !== 'number') {
            throw new Error('Invalid value types for demand or wind');
        }

        // Update DOM elements
        document.getElementById('demand-value').textContent = demandValue;
        document.getElementById('wind-value').textContent = windValue;

        const percentage = (demandValue / windValue) * 100;
        const progressBar = document.getElementById('progress-fill');

        if (percentage >= 100) {
            progressBar.style.width = '100%';
            progressBar.classList.add('red');
        } else {
            progressBar.style.width = `${percentage}%`;
            progressBar.classList.remove('red');
        }

        const message = windValue > demandValue
            ? "Good news! Wind generation exceeds demand."
            : "Bad news! Demand exceeds wind generation.";

        document.getElementById('message').textContent = message;

        // Prepare data for the graph
        const demandValues = demandData.Rows.filter(row => row.Value != null).map(row => row.Value);
        const windValues = windData.Rows.filter(row => row.Value != null).map(row => row.Value);
        const times = demandData.Rows.filter(row => row.Value != null).map(row => row.EffectiveTime);

        renderGraph(times, await demandValues, await windValues);

    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
};

const renderGraph = (times, demandValues, windValues) => {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define margins and scales
    const margin = 30;
    const graphWidth = canvas.width - 2 * margin;
    const graphHeight = canvas.height - 2 * margin;

    const maxValue = Math.max(...demandValues, ...windValues);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, canvas.height - margin);
    ctx.lineTo(canvas.width - margin, canvas.height - margin);
    ctx.stroke();

    // Scale and plot data points
    const scaleX = graphWidth / (times.length - 1);
    const scaleY = graphHeight / maxValue;

    const plotLine = (data, color) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        data.forEach((value, index) => {
            const x = margin + index * scaleX;
            const y = canvas.height - margin - value * scaleY;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Add data points
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = margin + index * scaleX;
            const y = canvas.height - margin - value * scaleY;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    plotLine(demandValues, 'blue'); // Demand line
    plotLine(windValues, 'green'); // Wind generation line

    // Add labels
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Time', canvas.width / 2, canvas.height - margin / 2 + 20);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('MW', -canvas.height / 2, margin / 2 - 10);
    ctx.restore();

    // Add grid lines
    for (let i = 0; i <= 5; i++) 
    {
        const y = canvas.height - margin - (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.strokeStyle = '#ddd';
        ctx.moveTo(margin, y);
        ctx.lineTo(canvas.width - margin, y);
        ctx.stroke();

        const label = Math.round((maxValue / 5) * i);
        ctx.fillStyle = '#333';
        ctx.fillText(label, margin - 15, y);
    }

    const renderWatermark = (ctx, svgPath) => {
        ctx.globalAlpha = 0.5; // Set half opacity
        ctx.font = '11px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        ctx.fillText('Data supplied by:', 285, 255);

        const img = new Image();
        img.src = svgPath;
        img.onload = () => {
            ctx.drawImage(img, 210, 230, 100, 100); // Adjust size (100x100)
        };
    };
    
    renderWatermark(ctx, './eirgrid.svg');
};

