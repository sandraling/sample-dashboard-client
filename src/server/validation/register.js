const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};
    // Convert empty fields to an empty string so we can use validator functions
    data.username = !isEmpty(data.username) ? data.username : "";
    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.tos = data.tos ? data.tos : false;
    // Name checks
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username field is required";
    } else if (!Validator.isLength(data.username, { min: 2, max: 20 })) {
        errors.username = "Username must be between 2 to 20 characters";
    }
    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = "First name field is required";
    } else if (!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
        errors.firstName = "First name must be between 2 to 20 characters";
    }
    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = "Last name field is required";
    } else if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
        errors.lastName = "Last name must be between 2 to 20 characters";
    }  
    
    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    } else if (!Validator.isLength(data.email, { min: 4, max: 30 })) {
        errors.email = "Email must be between 2 to 20 characters";
    }
    
    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    } else if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = "Password must be at least 8 characters";
    } // Ideally a password complexity check here but we will omit it for now
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    } else if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Confirm password must match password";
    }    
    
    // Terms of service check
    if (typeof(data.tos) !== "boolean" || data.tos !== true) {
        errors.tos = "To proceed, please agree to our terms of service."
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};