document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("Formularioinicio"); 
    const emailInput = document.getElementById("Correo");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const showError = (element, message) => {
        element.textContent = message;
        element.style.display = "block";
    };

    const hideError = (element) => {
        element.textContent = "";
        element.style.display = "none";
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        let isValid = true;

        const emailValue = emailInput.value.trim();
        if (emailValue === "") {
            showError(emailError, "El correo es obligatorio");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
            showError(emailError, "El correo no es válido");
            isValid = false;
        } else {
            hideError(emailError);
        }

    
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            showError(passwordError, "La contraseña es obligatoria");
            isValid = false;
        } else if (passwordValue.length < 6) {
            showError(passwordError, "La contraseña debe tener al menos 6 caracteres");
            isValid = false;
        } else {
            hideError(passwordError);
        }

     
        if (isValid) {
            form.submit(); 
        } else {
            alert("Existen errores en el formulario.");
        }
    });
});
