/**
 * Validates a registration form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors
 */
export function validateRegistrationForm(formData) {
  const errors = {};

  // Validate first name
  if (!formData.firstName) {
    errors.firstName = 'First name is required';
  }

  // Validate last name
  if (!formData.lastName) {
    errors.lastName = 'Last name is required';
  }

  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  // Validate phone
  if (formData.phone && !/^\+?[0-9\s-()]{8,}$/.test(formData.phone)) {
    errors.phone = 'Invalid phone number format';
  }

  // These fields are optional in the database, so we'll make them optional in the form too
  // Only validate if they're not the default placeholder values
  if (formData.country !== 'Country' && formData.country.trim() === '') {
    errors.country = 'Country cannot be empty if selected';
  }

  if (formData.city !== 'City' && formData.city.trim() === '') {
    errors.city = 'City cannot be empty if selected';
  }

  if (formData.region !== 'Region/State' && formData.region.trim() === '') {
    errors.region = 'Region/State cannot be empty if selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates a login form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result with errors
 */
export function validateLoginForm(formData) {
  const errors = {};

  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
