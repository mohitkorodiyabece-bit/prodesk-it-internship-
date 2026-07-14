import validator from 'validator';

export const sanitizeText = (value) => validator.escape(validator.trim(String(value)));

export const sanitizeEmail = (value) => {
  const trimmed = validator.trim(String(value)).toLowerCase();
  const normalized = validator.normalizeEmail(trimmed);
  return normalized || trimmed;
};

export const sanitizePhone = (value) => validator.trim(String(value));

export const buildSanitizedMemberData = (input) => {
  const sanitized = {};

  if (input.name !== undefined) sanitized.name = sanitizeText(input.name);
  if (input.email !== undefined) sanitized.email = sanitizeEmail(input.email);
  if (input.phone !== undefined) sanitized.phone = sanitizePhone(input.phone);
  if (input.membershipType !== undefined) sanitized.membershipType = sanitizeText(input.membershipType);
  if (input.joiningDate !== undefined) sanitized.joiningDate = sanitizeText(input.joiningDate);
  if (input.isActive !== undefined) sanitized.isActive = input.isActive;

  return sanitized;
};