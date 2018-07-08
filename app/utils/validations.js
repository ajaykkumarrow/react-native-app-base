export const passwordStrengthValidator = newPassword => {
  const strength = {
    length: false,
    alphaNumeric: false,
    specialChar: false,
    score: 0
  };
  let regex = /[a-zA-Z]/;

  if (regex.test(newPassword) && /[0-9]/.test(newPassword)) {
    strength.alphaNumeric = true;
    strength.score += 1;
  }

  if (newPassword.length >= 8) {
    strength.length = true;
    strength.score += 1;
  }

  regex = /[$@$!%*#?&]/;
  if (regex.test(newPassword)) {
    strength.specialChar = true;
    strength.score += 1;
  }
  /**
      * regex for password
      * password length 8-15 characters
      * 1 special character
      * accepts alpha-numeric
    */
  /*
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}$/.test(newPassword)) {
      strength.length = true;
      strength.alphaNumeric = true;
      strength.specialChar = true;
    } */

  return strength;
};

export const emailValidator = email => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (email !== undefined && regex.test(email)) {
    return true;
  }
  return false;
};

export const mobileNumberValidator = mobileNumber => {
  const regex = /^[0-9]{10}$/;
  if (mobileNumber !== undefined && mobileNumber.length === 10 && regex.test(mobileNumber)) {
    return true;
  }
  return false;
};

export const pincodeValidator = value => {
  const pincode = value.toString();
  const regex = /^[0-9]{6}$/;
  if (pincode !== undefined && pincode.length === 6 && regex.test(pincode)) {
    return true;
  }
  return false;
};

export const capitalizeFirstLetter = string => {
  const value = string.replace('_', ' ');
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const isStringEmpty = value => value.length === 0;

export const isNumeric = value => {
  const regex = /^\d+$/;
  return regex.test(value);
};

export const isEquivalent = (a, b) => {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i += 1) {
    const propName = aProps[i];
    if (typeof (a[propName]) === 'object' && typeof (b[propName]) === 'object') {
      if (a[propName] instanceof Array && b[propName] instanceof Array) {
        if (a[propName].length === b[propName].length) return false;
      }
    }
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};
