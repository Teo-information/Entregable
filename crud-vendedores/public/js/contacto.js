document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formContacto");
  
  // Comprobamos que el formulario existe antes de continuar
  if (!form) {
    console.error("El formulario #formContacto no se encontró en la página");
    return;
  }
  
  // Limpiar cualquier autocompletado al cargar la página
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
  inputs.forEach(input => {
    // Desactivar autocompletado del navegador
    input.setAttribute('autocomplete', 'off');
    
    // Limpiar el input al hacer focus
    input.addEventListener('focus', function() {
      if (this.value === this.defaultValue) {
        this.value = '';
      }
    });
  });
  
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Obtenemos los valores de los campos
    const nombre = document.getElementById("nama").value.trim();
    const correo = document.getElementById("email").value.trim();
    const telefono = document.getElementById("no_hp").value.trim();
    
    // Validación básica
    if (!nombre || !correo || !telefono) {
      mostrarMensajeFlotante("Por favor complete todos los campos", "error");
      return;
    }
    
    // Obtener el valor de la valoración (rating) seleccionada
    let rating = 0;
    const ratingSelected = document.querySelector('input[name="rating"]:checked');
    if (ratingSelected) {
      rating = ratingSelected.value;
    }
    
    console.log("Enviando:", { nombre, correo, telefono, rating });
    
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, telefono, rating }),
      });
      
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Mostramos el mensaje flotante
      mostrarMensajeFlotante(data.mensaje || "Contacto guardado con éxito", "success");
      
      // Limpiamos FORZOSAMENTE los campos del formulario
      document.getElementById("nama").value = "";
      document.getElementById("email").value = "";
      document.getElementById("no_hp").value = "";
      
      // Reestablecemos la valoración a 0 estrellas
      const noRate = document.getElementById("no-rate");
      if (noRate) {
        noRate.checked = true;
      }
      
      // Además del reset del formulario
      setTimeout(() => {
        form.reset();
      }, 100);
      
    } catch (err) {
      console.error("Error al enviar:", err);
      mostrarMensajeFlotante("Error al guardar el contacto: " + err.message, "error");
    }
  });
});

/**
 * Función para mostrar un mensaje flotante
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} tipo - El tipo de mensaje ('success', 'error', 'info')
 */
function mostrarMensajeFlotante(mensaje, tipo = 'success') {
  // Eliminamos cualquier mensaje flotante anterior
  const mensajesAnteriores = document.querySelectorAll('.mensaje-flotante');
  mensajesAnteriores.forEach(msg => msg.remove());
  
  // Creamos el nuevo elemento de mensaje
  const mensajeElement = document.createElement('div');
  mensajeElement.className = `mensaje-flotante mensaje-${tipo}`;
  
  // Contenedor para el texto
  const textoMensaje = document.createElement('div');
  textoMensaje.textContent = mensaje;
  mensajeElement.appendChild(textoMensaje);
  
  // Aplicamos estilos al mensaje
  Object.assign(mensajeElement.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 25px',
    borderRadius: '5px',
    zIndex: '9999',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.3s ease-out forwards',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    maxWidth: '300px'
  });
  
  // Aplicamos estilos según el tipo de mensaje
  if (tipo === 'success') {
    Object.assign(mensajeElement.style, {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderLeft: '5px solid #2E7D32'
    });
  } else if (tipo === 'error') {
    Object.assign(mensajeElement.style, {
      backgroundColor: '#F44336',
      color: 'white',
      borderLeft: '5px solid #B71C1C'
    });
  } else {
    Object.assign(mensajeElement.style, {
      backgroundColor: '#2196F3',
      color: 'white',
      borderLeft: '5px solid #0D47A1'
    });
  }
  
  // Añadimos el mensaje al DOM
  document.body.appendChild(mensajeElement);
  
  // Creamos un botón de cierre
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  Object.assign(closeButton.style, {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '22px',
    fontWeight: 'bold'
  });
  closeButton.addEventListener('click', () => mensajeElement.remove());
  mensajeElement.appendChild(closeButton);
  
  // Hacemos que el mensaje sea visible incluso después de la redirección
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && mensajeElement.parentNode) {
      mensajeElement.style.display = 'block';
    }
  });
  
  // Eliminamos el mensaje después de 5 segundos
  setTimeout(() => {
    mensajeElement.style.animation = 'fadeOut 0.5s ease-out forwards';
    setTimeout(() => {
      if (mensajeElement.parentNode) {
        mensajeElement.remove();
      }
    }, 500);
  }, 5000);
}

// Definimos las animaciones CSS para el mensaje flotante
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
  .mensaje-flotante {
    opacity: 1 !important;
    display: block !important;
  }
`;
document.head.appendChild(style);