class AppError {
    parameter;
    message;
    constructor(parameter, message) {
        this.parameter = parameter;
        this.message = message;
    }
}

const validator = {

    /* ERROR */

    throwError(parameter, message) {
        throw new Error(JSON.stringify(new AppError(parameter, message)));
    },

    getError(error) {
        const {parameter, message} = JSON.parse(error?.message);
        return new AppError(parameter, message);
    },

    /* BASIC VALIDATION */

    hasValue(parameter, value) {
        if (value !== undefined && value !== null) {
            return true;
        }
        this.throwError(parameter, `${parameter} not provided`);
    },
    

    /* ARRAY VALIDATION */

    isArray(parameter, value) {
        if (this.hasValue(parameter, value) && Array.isArray(value)) {
            return true;
        }
        this.throwError(parameter, `${parameter} contains not allowed values`);
    },

    isArrayFilled(parameter, value) {
        if (this.isArray(parameter, value) && value.length > 0) {
            return true;
        }
        this.throwError(parameter, `${parameter} contains not allowed values`);
    },


    /* STRING VALIDATION */
    
    isString(parameter, value) {
        if (this.hasValue(parameter, value) && (typeof value === "string")) {
            return true;
        }
        this.throwError(parameter, `${parameter} contains not allowed values`);
    },

    isStringFilled(parameter, value) {
        if (this.isString(parameter, value) && value.length > 0) {
            return true;
        }
        this.throwError(parameter, `${parameter} is empty`);
    },

    hasStringMinLength(parameter, value, min) {
        if (this.isString(parameter, value) && value.length >= min) {
            return true;
        }
        this.throwError(parameter, `${parameter} must be at least ${min} characters long`);
    },

    hasStringMaxLength(parameter, value, max) {
        if (this.isString(parameter, value) && value.length <= max) {
            return true;
        }
        this.throwError(parameter, `${parameter} must be a maximum of ${max} characters long`);
    }
    
};