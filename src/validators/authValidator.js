const { body } = require("express-validator");

exports.signupValidationRules = [
    body("first_name")
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ max: 50 }),

    body("last_name")
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ max: 50 }),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("phone")
        .optional()
        .isMobilePhone("en-IN")
        .withMessage("Invalid phone number"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

exports.loginValidationRules = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];
