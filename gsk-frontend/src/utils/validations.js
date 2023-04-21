import moment from "moment";

// Validation checking function called in components runValidator(field, this.INPUTS[field])
export const runValidator = (value, validation) => {
  let d1 = moment(), d2 = moment();
  let errors = [];
  value = value === null || value === undefined ? "" : value.toString().trim();

  let validator = validation.rules
  let errMsg = validation.errorMessage

  for (let rule in validator) {
    let error = "";
    switch (rule) {
      case "requiredIndex":
        if (value < 0) {
          error = errMsg ?? "Please enter a value. ";
          errors.push(error);
        }
        break;
      case "required":
        if (validator.required === true && value.length < 1) {
          error = errMsg ?? "Please provide your input here. ";
          errors.push(error);
        }
        break;
      case "min":
        value = parseFloat(value);
        if (isNaN(value) || !value) {
          error = "Please provide a value. ";
          errors.push(error);
        } else if (value < parseFloat(validator[rule])) {
          error = errMsg ?? "Please enter a value of at-least " + validator[rule] + ". ";
          errors.push(error);
        }
        break;
      case "max":
        value = parseFloat(value);
        if (isNaN(value) || !value) {
          error = "Please provide a value. ";
          errors.push(error);
        } else if (value > parseFloat(validator[rule])) {
          error = errMsg ?? "Please enter a value of at-most " + validator[rule] + ". ";
          errors.push(error);
        }
        break;
      case "minDate":
        d1 = moment(value);
        d2 = validator[rule];
        if (d1.isSameOrBefore(d2)) {
          error = errMsg.includes('ID') ? "Your card is expired. " : "Provide a valid date. Check the calendar for available dates.  ";
          errors.push(error);
        }
        break;
      case "maxDate":
        d1 = moment(value);
        d2 = validator[rule];
        if (d1.isSameOrAfter(d2)) {
          error = errMsg.includes('birth') ? "Age must be more than 18 years old. " : "Provide a valid date. Check the calendar for available dates. ";
          errors.push(error);
        }
        break;
      case "minLength":
        if ((validator.required === true || value) && value.length < validator[rule]) {
          error = "Please enter at-least " + validator[rule] + " characters. ";
          errors.push(error);
        }
        break;
      case "maxLength":
        if ((validator.required === true || value) && value.length > validator[rule]) {
          error = "Please enter at-most " + validator[rule] + " characters. ";
          errors.push(error);
        }
        break;
      case "email":
        if (
          value !== "" &&
          //eslint-disable-next-line
          value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) === null
        ) {
          error = "Please enter a valid email address. ";
          errors.push(error);
        }
        break;
      case "date":
        if (value)
          if (validator.date === true && moment(value).format("MM/DD/YYYY") === "Invalid date") {
            error = "Invalid Date Format (format: MM/DD/YYYY). ";
            errors.push(error);
          }
        break;
      case "url":
        if (
          value !== "" &&
          value.match(
            //eslint-disable-next-line
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
          ) === null
        ) {
          error = errMsg ?? "Provide a valid url. ";
          errors.push(error);
        }
        break;
      case "name":
        if (value !== "" && value.match(/^[a-zA-Z-\s]+$/) === null) {
          error = "Provide a valid name. ";
          errors.push(error);
        }
        break;
      case "alphabets":
        if (value !== "" && value.match(/^[a-zA-Z]+$/) === null) {
          error = errMsg ?? "Please enter alphabets only. ";
          errors.push(error);
        }
        break;
      case "alphanumeric":
        if (value !== "" && value.match(/^[a-zA-Z\s0-9]+$/) === null) {
          error = "Aphabets, digits and spaces allowed only. ";
          errors.push(error);
        }
        break;
      case "regex":
        let regex = validator[rule];
        if (regex.test(value) === false && value !== "") {
          error = errMsg.includes('password') ? "Password must contain one capital letter, a number and atleast 8 digits." : "Kindly fix the formatting. ";
          errors.push(error);
        }
        break;
      case "pattern":
        if (value !== "" && value.match(validator[rule]) === null) {
          error = errMsg ?? "Kindly fix the formatting. ";
          errors.push(error);
        }
        break;
      case "integer":
        if (Number.isInteger(parseFloat(value)) === false) {
          error = "Provide a number without decimal points. ";
          errors.push(error);
        }
        break;
      case "decimal":
        if (isNaN(value) === true) {
          error = errMsg ?? "Kindly fix the formatting. ";
          errors.push(error);
        }
        break;
      default:
        break;
    }
  }
  // To manipulate the multiple err msgs
  if (errors.length === 2) return errors.join('').replace(". Please enter", " of")
  else return errors; // supposed to be an errors array, Changing the way we return messages to components.
};