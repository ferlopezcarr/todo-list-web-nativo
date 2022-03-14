const taskValidator = {
    validator: validator,

    NAME: "name",
    MIN_NAME_LENGTH: 5,
    MAX_NAME_LENGTH: 50,

    DESCRIPTION: "description",
    MAX_DESCRIPTION_LENGTH: 250,
    
    STATUS: "status",

    validateName(name, tasks) {
        if (
            this.validator.isStringFilled(this.NAME, name) &&
            this.validator.hasStringMinLength(this.NAME, name, this.MIN_NAME_LENGTH) &&
            this.validator.hasStringMaxLength(this.NAME, name, this.MAX_NAME_LENGTH) &&
            !tasks.find(task => task?.name === name)
        ) {
            return true;
        }
        return this.validator.throwError(this.NAME, `Task with ${this.NAME} "${name}" already exists`);
    },

    validateDescription(description) {
        if (description !== undefined && description !== null) {
            return this.validator.isStringFilled(this.DESCRIPTION, description) &&
                this.validator.hasStringMaxLength(this.DESCRIPTION, description, this.MAX_NAME_LENGTH);
        }
        return true;
    },

    validateStatus(status) {
        if (
            this.validator.hasValue(this.STATUS, status) &&
            !!states && states.length >= 0 &&
            !!states.find(state => state?.value === status)
        ) {
            return true;
        }
        return this.validator.throwError(this.STATUS, `${this.STATUS} provided does not exist`);
    }
    
};