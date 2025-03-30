// JavaScript (script.js)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    const responseMessage = document.getElementById('responseMessage');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        try {
            // Send data to serverless function
            const response = await fetch('/.netlify/functions/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                responseMessage.textContent = 'Data submitted successfully!';
                responseMessage.style.color = 'green';
                form.reset();
            } else {
                throw new Error(result.error || 'Error submitting data');
            }
        } catch (error) {
            responseMessage.textContent = error.message;
            responseMessage.style.color = 'red';
            console.error('Error:', error);
        }
    });
});
