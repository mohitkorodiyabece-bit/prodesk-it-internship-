import { body, param, query } from 'express-validator';

const ALLOWED_MEMBERSHIP_TYPES = ['Basic', 'Standard', 'Premium'];

export const createMemberValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .bail()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must contain exactly 10 digits'),
  body('membershipType')
    .trim()
    .notEmpty()
    .withMessage('Membership type is required')
    .bail()
    .isIn(ALLOWED_MEMBERSHIP_TYPES)
    .withMessage('Membership type must be Basic, Standard, or Premium'),
  body('joiningDate')
    .trim()
    .notEmpty()
    .withMessage('Joining date is required')
    .bail()
    .isISO8601()
    .withMessage('Joining date must be a valid date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean'),
];

export const updateMemberValidationRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name must not be empty')
    .bail()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address'),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number must not be empty')
    .bail()
    .matches(/^\d{10}$/)
    .withMessage('Phone number must contain exactly 10 digits'),
  body('membershipType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Membership type must not be empty')
    .bail()
    .isIn(ALLOWED_MEMBERSHIP_TYPES)
    .withMessage('Membership type must be Basic, Standard, or Premium'),
  body('joiningDate')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Joining date must not be empty')
    .bail()
    .isISO8601()
    .withMessage('Joining date must be a valid date'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean'),
];

export const memberIdValidationRules = [
  param('id').trim().notEmpty().withMessage('Member ID is required'),
];

export const memberQueryValidationRules = [
  query('search').optional().trim(),
  query('membershipType')
    .optional()
    .trim()
    .isIn(ALLOWED_MEMBERSHIP_TYPES)
    .withMessage('Membership type filter must be Basic, Standard, or Premium'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('Active status filter must be a boolean'),
];

export { ALLOWED_MEMBERSHIP_TYPES };