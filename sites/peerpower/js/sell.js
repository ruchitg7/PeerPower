function updateSellDisplay() {
    const slider = document.getElementById('energySliderSell');
    const value = slider.value;
    document.getElementById('energyDisplaySell').textContent = `${value}%`;
    updatePrice();
    
    const batterySelect = document.getElementById('batterySelectSell');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const baseCharge = parseInt(selectedOption.getAttribute('data-charge'));
    
    const annulusBase = document.getElementById('annulusBaseSell');
    const annulusAdditional = document.getElementById('annulusAdditionalSell');
    
    // Set the base charge (green)
    annulusBase.style.setProperty('--base-charge', (baseCharge));
    
    // Set the additional charge (blue)
    annulusAdditional.style.setProperty('--additional-charge', value);
    
    document.getElementById('annulusTextSell').textContent = `${value}%`;
}

function updateBatterySell() {
    const batterySelect = document.getElementById('batterySelectSell');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const charge = parseInt(selectedOption.getAttribute('data-charge'));
    
    const slider = document.getElementById('energySliderSell');
    slider.min = 0; // Set minimum value to 0
    slider.max = charge; // Maximum value to current charge
    slider.value = 0; // Set initial value to 0
    
    updateSellDisplay();
}

function updatePrice() {
    const pricePerKWh = parseFloat(document.getElementById('price').value);
    const energyPercentage = parseFloat(document.getElementById('energySliderSell').value);
    const batterySelect = document.getElementById('batterySelectSell');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const batteryCapacity = parseFloat(selectedOption.getAttribute('data-capacity'));
    const energyAmount = (batteryCapacity * (energyPercentage / 100)).toFixed(2);
    const totalPrice = (pricePerKWh * energyAmount).toFixed(2);
    document.getElementById('totalPrice').textContent = `Total Sale Price: €${totalPrice}`;
}

function confirmSale() {
    const batterySelect = document.getElementById('batterySelectSell');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const targetPercentage = parseInt(document.getElementById('energySliderSell').value);
    const baseCharge = parseInt(selectedOption.getAttribute('data-charge'));
    const batteryCapacity = parseFloat(selectedOption.getAttribute('data-capacity'));
    const energyAmount = (batteryCapacity * (targetPercentage / 100)).toFixed(2);
    const pricePerKWh = parseFloat(document.getElementById('price').value);
    const totalPrice = (pricePerKWh * energyAmount).toFixed(2);
    
    // Update the battery display in the home screen
    const batteryType = selectedOption.value;
    const batteryElements = document.querySelectorAll('.battery');
    batteryElements.forEach(battery => {
        if (battery.querySelector('h3') && battery.querySelector('h3').textContent.toLowerCase().includes(batteryType)) {
            const progressFill = battery.querySelector('.progress-fill');
            const newCharge = baseCharge - targetPercentage;
            // Set both base and target charge values with percentages
            progressFill.style.setProperty('--base-charge', `${newCharge}%`);
            progressFill.style.setProperty('--current-charge', `${newCharge}%`);
            battery.querySelector('p').textContent = `Discharging from ${baseCharge}%`;
        }
    });
    
    // Update the select option's data-charge attribute
    selectedOption.setAttribute('data-charge', baseCharge - targetPercentage);
    
    // Show confirmation message
    alert(`Sale complete!\nSold ${energyAmount} kWh for €${totalPrice}`);
    
    // Navigate back to home
    navigate('home');
}