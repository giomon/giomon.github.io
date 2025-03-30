/**
 * script.js - Maneja la interacción del formulario
 * Este script gestiona el envío del formulario y se comunica con la función serverless de Netlify
 * para guardar los datos en la base de datos Supabase.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el formulario y el elemento donde mostraremos mensajes de respuesta
    const form = document.getElementById('dataForm');
    const responseMessage = document.getElementById('responseMessage');
    
    // Agregar un evento de escucha para el envío del formulario
    form.addEventListener('submit', async function(e) {
        // Prevenir el comportamiento predeterminado del formulario (recargar la página)
        e.preventDefault();
        
        // Mostrar un mensaje de carga
        responseMessage.textContent = 'Enviando datos...';
        responseMessage.style.color = 'blue';
        
        // Obtener los datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString() // Añadir la fecha y hora actual
        };
        
        try {
            // Enviar los datos a la función serverless de Netlify
            const response = await fetch('/.netlify/functions/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Convertir la respuesta a JSON
            const result = await response.json();
            
            // Comprobar si la respuesta es exitosa
            if (response.ok) {
                // Mostrar mensaje de éxito
                responseMessage.textContent = '¡Datos enviados correctamente!';
                responseMessage.style.color = 'green';
                
                // Limpiar el formulario
                form.reset();
            } else {
                // Lanzar un error con el mensaje recibido del servidor
                throw new Error(result.error || 'Error al enviar los datos');
            }
        } catch (error) {
            // Mostrar mensaje de error
            responseMessage.textContent = error.message;
            responseMessage.style.color = 'red';
            console.error('Error:', error);
        }
    });
});