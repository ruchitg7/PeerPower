Energy Trading Platform:

This project implements a front-end interface for an energy trading platform that allows users to interact with virtual battery storage, track energy demand and wind generation, and manage energy purchases. It utilizes HTML, CSS, and JavaScript to create a user-friendly experience where users can select batteries, set energy levels, and make purchases from sellers, as well as view real-time data updates related to demand and wind generation.

Features:
Battery Management: Users can select a battery and adjust its charge level using a slider.

Energy Purchase: Users can buy energy from different sellers at varying prices based on energy demand.

Dynamic Updates: The UI dynamically updates battery charge levels, calculates costs, and displays real-time information about demand and wind generation.

Equivalency Information: Displays real-world equivalencies for energy levels, such as "Equivalent to 5 kettles boiled" or "Equivalent to 3 full laundry cycles."

Real-Time Data Fetching: Fetches demand and wind generation data from an API and displays it in the form of graphs and status updates.

Modals for Confirmation: Modal windows appear for users to confirm their energy purchases.

Technologies Used:
HTML: Structuring the user interface.

CSS: Styling the UI components.

JavaScript: Handling user interactions, updating UI elements, and fetching data from APIs.

Canvas API: Used for rendering graphs of demand vs. wind generation over time.

API Endpoints:
The application expects two API endpoints for real-time data updates:

/api/demand: Fetches energy demand data.

/api/wind: Fetches wind generation data.

Key Functions:
openModal(): Opens the modal to confirm energy purchase based on the selected battery charge and target charge level.

closeModal(): Closes the modal window.

completePurchase(): Finalizes the energy purchase and updates the battery charge and UI.

updateSliderValue(): Updates the display of energy prices based on the selected slider value.

fetchDataAndDisplay(): Fetches and displays the real-time demand and wind data, and updates the UI accordingly.

renderGraph(): Renders a graph comparing demand vs. wind generation over time.
