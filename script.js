function mostrarDatos() {
    // Obtener el formulario por su ID
    const formulario = document.getElementById("formulario");
    
    // Obtener los valores de los campos del formulario
    const nombres = formulario.elements["txt_nombres"].value;
    const apellidos = formulario.elements["txt_apellidos"].value;
    const telefono = formulario.elements["txt_telefono"].value;
    const correo = formulario.elements["txt_correo"].value;
    const fechaNacimiento = formulario.elements["txt_fn"].value;
    const mensaje = formulario.elements["txt_mensaje"].value;
  
    // Mostrar los valores en un alert
    alert("Datos ingresados:\n\n" +
          "Nombres: " + nombres + "\n" +
          "Apellidos: " + apellidos + "\n" +
          "Número telefónico: " + telefono + "\n" +
          "Correo electrónico: " + correo + "\n" +
          "Fecha de nacimiento: " + fechaNacimiento + "\n" +
          "Mensaje: " + mensaje);
  }
  
  
  
  
  