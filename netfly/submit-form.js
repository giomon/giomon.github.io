/**
 * submit-form.js - Función serverless para Netlify
 * Esta función procesa los datos del formulario y los guarda en Supabase
 * Ubicación: netlify/functions/submit-form.js
 */

// Importar el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

// Obtener credenciales de Supabase desde las variables de entorno
const supabaseUrl = process.env.https://qxyveiocaqweonxfwvxl.supabase.co;
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4eXZlaW9jYXF3ZW9ueGZ3dnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjIyMDcsImV4cCI6MjA1ODkzODIwN30.qRKZzMarK3cc-Q-AToHdKJPKgmKDtLCsOG9FD6vPxOI;

exports.handler = async (event, context) => {
    // Solo permitir solicitudes POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }
    
    try {
        // Analizar los datos entrantes
        const data = JSON.parse(event.body);
        
        // Validar los datos
        if (!data.name || !data.email || !data.message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Faltan campos requeridos' })
            };
        }
        
        // Inicializar el cliente de Supabase
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Verificar la conexión con Supabase
        if (!supabase) {
            throw new Error('No se pudo conectar a Supabase');
        }
        
        // Insertar datos en la base de datos
        const { data: insertData, error } = await supabase
            .from('form_submissions')
            .insert([
                {
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    created_at: new Date().toISOString()
                }
            ]);
        
        // Verificar si hubo un error durante la inserción
        if (error) {
            console.error('Error de Supabase:', error);
            throw new Error('Error al guardar en la base de datos');
        }
        
        // Retornar respuesta exitosa
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Datos enviados correctamente',
                id: insertData?.[0]?.id
            })
        };
    } catch (error) {
        // Registrar el error y devolver un mensaje de error
        console.error('Error en la función:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al enviar datos a la base de datos' })
        };
    }
};
