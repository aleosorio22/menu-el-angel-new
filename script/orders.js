// Escuchar el evento 'DOMContentLoaded' para asegurar que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.querySelector('.reservation-form');

    // Asignar un event listener al formulario para cuando se envíe
    reservationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener valores de los campos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value || 'No proporcionado'; // Si no hay correo, se establece "No proporcionado"
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;

        // Verificar si todos los campos requeridos están completos
        if (!name || !phone || !date || !time || !guests) {
            // Mostrar mensaje de error con SweetAlert2 si faltan campos
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos requeridos antes de enviar.',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Construir el mensaje de WhatsApp con un formato más profesional y con emojis
        const message = `
🌟 *Solicitud de Reservación* 🌟

👤 *Nombre:* ${name}
📧 *Correo:* ${email}
📱 *Teléfono:* ${phone}

📅 *Fecha de reservación:* ${date}
⏰ *Hora de reservación:* ${time}
👥 *Número de personas:* ${guests}

Estoy interesado(a) en realizar esta reservación. ¿Podrían confirmarla, por favor? 😊
        `;

        // Convertir el mensaje a formato URI para WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?phone=50231667151&text=${encodeURIComponent(message)}`;

        // Mostrar mensaje de confirmación con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: '¡Reservación Lista para Enviar!',
            text: 'Presiona "Enviar" para confirmar tu reservación a través de WhatsApp.',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir al usuario a la URL de WhatsApp si confirma
                window.open(whatsappURL, '_blank');
                Swal.fire({
                    icon: 'info',
                    title: '¡Gracias!',
                    text: 'Te hemos redirigido a WhatsApp para que completes tu reservación.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        });
    });
});