document.addEventListener('DOMContentLoaded', function() {

    const calendarContainer = document.getElementById('calendar-container');
    const sessionAccordion = document.getElementById('sessionAccordion');

    // Fechas de las sesiones (Formato YYYY-MM-DD)
    const sessionDates = [
        '2025-04-08', '2025-04-15', '2025-04-22', '2025-04-29',
        '2025-05-06', '2025-05-13', '2025-05-20', '2025-05-27',
        '2025-06-03', '2025-06-10', '2025-06-17', '2025-06-24'
    ];

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]; // Empezar en Domingo por getDay()

    function generateCalendar(year, month) { // month es 0-indexado (0=Enero, 1=Febrero...)
        const monthName = months[month];
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Domingo, 1=Lunes...

        // Crear estructura de tarjeta para cada mes
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-3'; // Añadido shadow-sm

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.textContent = `${monthName} ${year}`;
        card.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body p-0'; // Quita padding del body para ajustar tabla

        const table = document.createElement('table');
        table.className = 'table table-bordered table-sm mb-0'; // mb-0 para quitar margen

        // Encabezado con días de la semana (Lunes a Domingo)
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
         // Ajustar orden de días de semana a Lunes-Domingo
        const displayDaysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
        displayDaysOfWeek.forEach(day => {
             const th = document.createElement('th');
             th.textContent = day;
             headerRow.appendChild(th);
         });


        // Cuerpo del calendario
        const tbody = table.createTBody();
        let date = 1;
        let currentDay = 0; // Contador para días de la semana (0=Lunes, 6=Domingo)

         // Ajustar el primer día (si 0=Domingo, convertir a 6 para nuestro display L-D)
         let adjustedFirstDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;


        for (let i = 0; i < 6; i++) { // Máximo 6 filas
            const row = tbody.insertRow();
            for (let j = 0; j < 7; j++) { // 7 días por semana
                const cell = row.insertCell();
                if (i === 0 && j < adjustedFirstDay) {
                    // Celdas vacías antes del primer día del mes
                    cell.classList.add('other-month');
                } else if (date > daysInMonth) {
                    // Celdas vacías después del último día del mes
                     cell.classList.add('other-month');
                } else {
                    // Día actual del mes
                    cell.textContent = date;
                    const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                    // Resaltar si es día de sesión
                    if (sessionDates.includes(currentDateStr)) {
                        cell.classList.add('session-day');
                        cell.dataset.date = currentDateStr; // Guardar fecha para click
                    }
                    date++;
                }
            }
            if (date > daysInMonth && i < 5) { // No añadir más filas si ya se llenaron los días
                 // Opcional: podrías romper el loop aquí si prefieres no tener filas vacías al final
                 // if (row.querySelectorAll('td:not(.other-month)').length === 0) {
                 //    tbody.removeChild(row); // Experimental: quitar fila si está completamente vacía
                // }
            }
             if (date > daysInMonth) break; // Salir si ya no hay más días que poner
        }

        cardBody.appendChild(table);
        card.appendChild(cardBody);
        calendarContainer.appendChild(card); // Añade la tarjeta del mes al contenedor
    }

    // Generar calendarios para Abril, Mayo y Junio 2025
    generateCalendar(2025, 3); // Abril (mes 3)
    generateCalendar(2025, 4); // Mayo (mes 4)
    generateCalendar(2025, 5); // Junio (mes 5)

    // --- Interacción Calendario -> Acordeón ---
    calendarContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('session-day')) {
            const dateClicked = event.target.dataset.date;
            const targetButton = sessionAccordion.querySelector(`.accordion-button[data-date="${dateClicked}"]`);

            if (targetButton) {
                const targetCollapseId = targetButton.getAttribute('data-bs-target');
                const targetCollapseElement = document.querySelector(targetCollapseId);

                if (targetCollapseElement) {
                    // 1. Scroll hacia el elemento del acordeón
                    targetButton.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest' // 'start' o 'center' o 'nearest'
                    });

                     // Espera un poco para que termine el scroll antes de abrir (opcional, puede mejorar UX)
                    setTimeout(() => {
                         // 2. Abrir el panel del acordeón correspondiente usando la API de Bootstrap
                        const bsCollapse = new bootstrap.Collapse(targetCollapseElement, {
                           toggle: false // Asegura que no se cierre si ya está abierto por casualidad
                         });
                         bsCollapse.show(); // Muestra el panel

                        // 3. Breve resaltado visual (opcional)
                        targetButton.classList.add('focus-highlight');
                        setTimeout(() => targetButton.classList.remove('focus-highlight'), 1500); // Quita resaltado después de 1.5s

                    }, 300); // 300ms de espera

                }
            }
        }
    });

    // CSS para el resaltado temporal (añadir esto también a style.css si se prefiere)
    const style = document.createElement('style');
    style.textContent = `
        .focus-highlight {
            box-shadow: 0 0 15px 3px rgba(0, 123, 255, 0.5) !important; /* Sombra azul más pronunciada */
            transition: box-shadow 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);

});
