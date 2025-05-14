function openModal() {
    const batterySelect = document.getElementById('batterySelect');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const baseCharge = parseInt(selectedOption.getAttribute('data-charge'));
    const targetCharge = parseInt(document.getElementById('energySlider').value);
    
    
    document.getElementById('modalBar').style.setProperty('--base-charge', `${baseCharge}%`);
    document.getElementById('modalBar').style.setProperty('--current-charge', `${targetCharge}%`);
    
    // Update charging status
    document.getElementById('charging-status').textContent = `Charging to ${targetCharge}%`;

    document.getElementById('buyModal').style.display = 'flex';
}


function closeModal() {
    document.getElementById('buyModal').style.display = 'none';
}

function completePurchase(seller, price) {
    console.log(price)
    const batterySelect = document.getElementById('batterySelect');
    const selectedOption = batterySelect.options[batterySelect.selectedIndex];
    const targetCharge = parseInt(document.getElementById('energySlider').value);
    const baseCharge = parseInt(selectedOption.getAttribute('data-charge'));
    const additionalCharge = targetCharge - baseCharge;
    
    // Calculate total cost
    const totalCost = (additionalCharge / 100 * 50) * price;
    
    // Update the battery display in the home screen
    const batteryType = selectedOption.value;
    const batteryElements = document.querySelectorAll('.battery');
    batteryElements.forEach(battery => {
        if (battery.querySelector('h3') && battery.querySelector('h3').textContent.toLowerCase().includes(batteryType)) {
            const progressFill = battery.querySelector('.progress-fill');
            // Set both base and target charge values with percentages
            progressFill.style.setProperty('--base-charge', `${baseCharge}%`);
            progressFill.style.setProperty('--current-charge', `${targetCharge}%`);
            battery.querySelector('p').textContent = (seller === 'Limit') ? `Charging to ${targetCharge}% when price is below €${price}` : `Charging to ${targetCharge}%`;
        }
    });
    
    // Update the select option's data-charge attribute
    selectedOption.setAttribute('data-charge', targetCharge);
    if(seller === 'Limit') 
    {
        alert(`Order complete!\nWill buy ${additionalCharge}% charge for a total cost of: €${totalCost.toFixed(2)} when the per kWh price is below €${price}`);
    }
    else
    {
        
        // Show confirmation message
        alert(`Purchase complete!\nBought ${additionalCharge}% charge from ${seller}\nTotal cost: €${totalCost.toFixed(2)}`);
    }
    // Close modal
    closeModal();
    
    // Navigate back to home
    navigate('home');
}

function updateBuyDisplay() {
    const slider = document.getElementById('energySlider');
    const batterySelect = document.getElementById('batterySelect');
    const baseCharge = parseInt(batterySelect.options[batterySelect.selectedIndex].getAttribute('data-charge'));
    
    const value = parseInt(slider.value);
    const annulusBase = document.getElementById('annulusBase');
    const annulusAdditional = document.getElementById('annulusAdditional');
    
    // Set the base charge (green)
    annulusBase.style.setProperty('--base-charge', baseCharge);
    
    // Set the additional charge (blue)
    annulusAdditional.style.setProperty('--base-charge', baseCharge);
    annulusAdditional.style.setProperty('--additional-charge', value);
    
    document.getElementById('annulusText').textContent = `${value}%`;

    // Update equivalency text based on additional charge only
    const additionalCharge = value - baseCharge;
    let equivalency;
    if (additionalCharge < 20) {
        equivalency = "Equivalent to 2 kettles boiled";
    } else if (additionalCharge < 50) {
        equivalency = "Equivalent to 5 kettles boiled";
    } else if (additionalCharge < 80) {
        equivalency = "Equivalent to 20 phones charged";
    } else {
        equivalency = "Equivalent to 3 full laundry cycles";
    }
    
    document.getElementById('equivalencyText').textContent = equivalency;
}
