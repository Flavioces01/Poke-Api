document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("FormularioRegistro");
    const nameInput = document.getElementById("Nombre");
    const emailInput = document.getElementById("Correo");
    const passInput = document.getElementById("password");
    const cpassInput = document.getElementById("cpassword");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passError = document.getElementById("passwordError");
    const cpassError = document.getElementById("cpasswordError");

    const showError = (el, msg) => {
        if (el) {
            el.textContent = msg;
            el.style.display = "block";
        }
    };

    const hideError = el => {
        if (el) {
            el.textContent = "";
            el.style.display = "none";
        }
    };

    form.addEventListener("submit", e => {
        let valid = true;
        e.preventDefault(); 

        if (nameInput.value.trim().length < 3) {
            showError(nameError, "El nombre debe tener al menos 3 caracteres");
            valid = false;
        } else hideError(nameError);

        if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
            showError(emailError, "El correo no es válido");
            valid = false;
        } else hideError(emailError);

        const pw = passInput.value.trim();
        if (pw.length < 6) {
            showError(passError, "La contraseña debe tener ≥ 6 caracteres");
            valid = false;
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(pw)) {
            showError(passError, "Debe incluir mayúscula, número y símbolo");
            valid = false;
        } else hideError(passError);

     
        if (cpassInput.value.trim() !== pw) {
            showError(cpassError, "Las contraseñas no coinciden");
            valid = false;
        } else hideError(cpassError);

       
        if (valid) form.submit();
    });
});
