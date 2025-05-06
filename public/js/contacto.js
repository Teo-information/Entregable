document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formContacto");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const nombre = document.getElementById("nama").value;
      const correo = document.getElementById("email").value;
      const telefono = document.getElementById("no_hp").value;
  
      console.log("Enviando:", { nombre, correo, telefono });
  
      try {
        const res = await fetch("/api/contacto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre, correo, telefono }),
        });
  
        const data = await res.json();
        alert(data.mensaje || "Contacto guardado");
      } catch (err) {
        console.error("Error al enviar:", err);
        alert("Error al guardar el contacto");
      }
    });
  });
  