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
    
    // Validación de campos vacíos
    if (!nombre || !correo || !telefono) {
      mostrarMensajeFlotante("Por favor, complete todos los campos obligatorios", "error");
      
      // Marcar visualmente los campos vacíos
      if (!nombre) marcarCampoInvalido("nama");
      if (!correo) marcarCampoInvalido("email");
      if (!telefono) marcarCampoInvalido("no_hp");
      
      return; // Detener el envío del formulario
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
      
      // Mostramos el mensaje flotante de éxito
      mostrarMensajeFlotante(data.mensaje || "Contacto guardado con éxito", "success");
      
      // Guardamos el mensaje de éxito en sessionStorage para recuperarlo después del refresh
      sessionStorage.setItem('mensajeExito', data.mensaje || "Contacto guardado con éxito");
      
      // Esperamos un momento para que el usuario pueda ver el mensaje antes del refresh
      setTimeout(() => {
        // Refrescamos la página para limpiar completamente el formulario
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      console.error("Error al enviar:", err);
      mostrarMensajeFlotante("Error al guardar el contacto: " + err.message, "error");
    }
  });
  
  // Eliminar el estado de inválido cuando el usuario comienza a escribir
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      this.classList.remove('campo-invalido');
    });
  });
  
  // Verificar si hay un mensaje de éxito guardado de un envío previo
  window.addEventListener('load', function() {
    const mensajeGuardado = sessionStorage.getItem('mensajeExito');
    if (mensajeGuardado) {
      // Mostrar el mensaje guardado
      mostrarMensajeFlotante(mensajeGuardado, "success");
      // Eliminar el mensaje guardado para que no aparezca en futuros recargas
      sessionStorage.removeItem('mensajeExito');
    }
  });
});

/**
 * Función para marcar visualmente un campo como inválido
 * @param {string} id - El ID del campo a marcar
 */
function marcarCampoInvalido(id) {
  const campo = document.getElementById(id);
  if (campo) {
    campo.classList.add('campo-invalido');
    campo.focus();
  }
}

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
  .campo-invalido {
    border: 2px solid #F44336 !important;
    background-color: rgba(244, 67, 54, 0.05) !important;
  }
`;
document.head.appendChild(style);