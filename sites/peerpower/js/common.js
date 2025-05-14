function navigate(screen) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('buy').style.display = 'none';
    document.getElementById('sell').style.display = 'none';

    document.getElementById(screen).style.display = 'block';

// Update battery display when navigating to buy screen
    if(screen === 'buy') {
        updateBattery();
    }
}

function updateSliderValue() {
    const slider = document.getElementById('battery-percentage');
    const value = slider.value;
    const sliderValue = document.getElementById('slider-value');
    sliderValue.textContent = `${value}%`;

    const totalEnergy = (value / 100) * 50; // Assuming the battery capacity is 50 kWh

    const maryCost = totalEnergy * 0.50;
    const johnCost = totalEnergy * 0.45;

    document.getElementById('mary-cost').textContent = `Total: €${maryCost.toFixed(2)}`;
    document.getElementById('john-cost').textContent = `Total: €${johnCost.toFixed(2)}`;
}




function updateBattery() {
const batterySelect = document.getElementById('batterySelect');
const selectedOption = batterySelect.options[batterySelect.selectedIndex];
const charge = parseInt(selectedOption.getAttribute('data-charge'));

const slider = document.getElementById('energySlider');
slider.min = charge; // Set minimum value to 0
slider.max = 100; // Maximum battery capacity
slider.value = charge; // Set initial value to current charge

updateSellDisplay();
updateBuyDisplay();
}

//window.onload = updateBattery;

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndDisplay();
    updateBattery();
    updateBatterySell();
    navigate("home");
});

document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        event.target.focus();
    }
}, false);