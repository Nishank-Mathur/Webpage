(function() {
    const token = 'YOUR_SERVER_PROVIDED_TOKEN';  // Dynamic injection ka option bhi hai

    function loadWidget() {
        const widget = document.createElement('div');
        widget.id = 'bolna-widget';
        widget.innerHTML = `
            <button id="btnDialpad">Open Dialpad</button>
            <button id="btnPopup">Open Popup Form</button>
            <button id="btnSchedule">Schedule Call</button>
        `;
        document.body.appendChild(widget);

        document.getElementById('btnDialpad').onclick = openDialpad;
        document.getElementById('btnPopup').onclick = openPopupForm;
        document.getElementById('btnSchedule').onclick = openScheduleForm;
    }

    function openDialpad() {
        window.location.href = 'tel:+19876543007';  // AI Agent number
    }

    function openPopupForm() {
        showPopup(`
            <h3>Start AI Agent Call</h3>
            <input id="recipientPhone" placeholder="Recipient Phone">
            <input id="var1" placeholder="Variable 1">
            <input id="var2" placeholder="Variable 2">
            <input id="var3" placeholder="Variable 3">
            <button id="callNow">Call Now</button>
        `, () => {
            const data = {
                agent_id: "123e4567-e89b-12d3-a456-426655440000",
                recipient_phone_number: document.getElementById('recipientPhone').value,
                from_phone_number: "+19876543007",
                user_data: {
                    variable1: document.getElementById('var1').value,
                    variable2: document.getElementById('var2').value,
                    variable3: document.getElementById('var3').value
                }
            };

            fetch('https://api.bolna.dev/call', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
              .then(response => {
                  alert("Call Initiated: " + JSON.stringify(response));
                  closePopup();
              }).catch(err => {
                  alert("Error: " + err.message);
              });
        });
    }

    function openScheduleForm() {
        showPopup(`
            <h3>Schedule AI Agent Call</h3>
            <input id="schedulePhone" placeholder="Recipient Phone">
            <input type="datetime-local" id="scheduleTime">
            <button id="scheduleNow">Schedule</button>
        `, () => {
            const phone = document.getElementById('schedulePhone').value;
            const time = document.getElementById('scheduleTime').value;

            console.log(`Schedule Call for ${phone} at ${time}`);
            alert(`Call Scheduled for ${time}`);
            closePopup();
        });
    }

    function showPopup(innerHtml, onSubmit) {
        let popup = document.createElement('div');
        popup.className = 'bolna-popup';
        popup.innerHTML = innerHtml + `<br><button onclick="document.querySelector('.bolna-popup').remove()">Close</button>`;
        document.body.appendChild(popup);

        const submitButton = popup.querySelector('button:not([onclick])');
        submitButton.onclick = onSubmit;
    }

    function closePopup() {
        document.querySelector('.bolna-popup').remove();
    }

    // Token Validation (Optional)
    fetch(`https://yourserver.com/validate-widget?token=${token}`)
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                loadWidget();
            } else {
                console.error("Invalid token - Widget not loaded.");
            }
        })
        .catch(() => console.error("Token validation failed - Widget not loaded."));
})();
