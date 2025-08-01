const { body } = require("express-validator");

exports.profileValidationRules = [
    body("about_me").optional().isString().isLength({ max: 500 }).withMessage("about_me must be max 500 chars"),
    body("preferred_role").optional().isString(),
    body("key_skills").optional().isString(),
    body("education").optional().isString(),
    body("work_experience").optional().isString(),
    body("certifications").optional().isString(),
    body("projects").optional().isString(),
    body("languages").optional().isString(),
    body("city").optional().isString(),
    body("pincode").optional().isPostalCode("IN").withMessage("Invalid pincode"),
    body("dob").optional().isISO8601().toDate().withMessage("Invalid date of birth"),
    body("marital_status").optional().isString(),
    body("work_permit").optional().isBoolean(),
];
