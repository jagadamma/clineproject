// const { PrismaClient } = require("@prisma/client");
// const Joi = require('joi');
// const winston = require('winston');
// // Logger similar to zap
// const logger = winston.createLogger({
//     transports: [new winston.transports.Console()]
// });
// // Validation schema like Go's validator
// const languageSchema = Joi.object({
//     id: Joi.string().required(),
//     lang_id: Joi.string().required(),
//     lang_name: Joi.string().required()
// });
// // Error response function
// function respondWithError(res, statusCode, errorCode, message) {
//     res.status(statusCode).json({
//         error_code: errorCode,
//         message
//     });
// }
// // Success JSON response
// function respondWithJSON(res, statusCode, payload) {
//     res.status(statusCode).json(payload);
// }
// // Main logic for adding languages
// async function addLanguages(req, res) {
//     const { error, value } = languageSchema.validate(req.body);
//     if (error) {
//         return respondWithError(res, 400, 'ERR_INVALID_INPUT', error.details[0].message);
//     }
//     const { u_id, lang_id, lang_name } = value;
//     const languageIds = lang_id.split(',').map(id => id.trim());
//     const languageNames = lang_name.split(',').map(name => name.trim());
//     if (languageIds.length !== languageNames.length) {
//         return respondWithError(res, 400, 'ERR_INVALID_INPUT', 'Mismatch between language IDs and language names');
//     }
//     const conn = await db.getConnection();
//     try {
//         await conn.beginTransaction();
//         // Check user existence
//         const [userRows] = await conn.query('SELECT EXISTS(SELECT 1 FROM User WHERE id = ?) AS userExists', [id]);
//         if (!userRows[0].userExists) {
//             return respondWithError(res, 400, 'ERR_INVALID_ID', 'The provided id does not belong to the user');
//         }
//         const insertQuery = `
//       INSERT INTO JS_languages (id, lang_id, lang_name)
//       VALUES (?, ?, ?)
//       ON DUPLICATE KEY UPDATE lang_name = VALUES(lang_name)
//     `;
//         for (let i = 0; i < languageIds.length; i++) {
//             await conn.query(insertQuery, [id, languageIds[i], languageNames[i]]);
//         }
//         await conn.commit();
//         logger.info('Language added successfully', { id: id });
//         respondWithJSON(res, 200, { message: 'Language added successfully' });
//     } catch (err) {
//         await conn.rollback();
//         logger.error('Failed to add languages', { error: err });
//         respondWithError(res, 500, 'ERR_INTERNAL', 'An internal error occurred');
//     } finally {
//         conn.release();
//     }
// }
// module.exports = {
//     addLanguages
// };


// const { PrismaClient } = require("@prisma/client");
// const Joi = require('joi');
// const winston = require('winston');

// // Initialize Prisma
// const prisma = new PrismaClient();

// // Logger
// const logger = winston.createLogger({
//     transports: [new winston.transports.Console()]
// });

// // Joi validation schema
// const languageSchema = Joi.object({
//     id: Joi.number().required(), // should be number (User.id is Int)
//     lang_id: Joi.string().required(),
//     lang_name: Joi.string().required()
// });

// // Error response function
// function respondWithError(res, statusCode, errorCode, message) {
//     res.status(statusCode).json({
//         error_code: errorCode,
//         message
//     });
// }

// // Success response
// function respondWithJSON(res, statusCode, payload) {
//     res.status(statusCode).json(payload);
// }

// // Main logic
// async function addLanguages(req, res) {
//     const { error, value } = languageSchema.validate(req.body);
//     if (error) {
//         return respondWithError(res, 400, 'ERR_INVALID_INPUT', error.details[0].message);
//     }

//     const { id, lang_id, lang_name } = value;

//     const languageIds = lang_id.split(',').map(id => parseInt(id.trim(), 10));
//     const languageNames = lang_name.split(',').map(name => name.trim());

//     if (languageIds.length !== languageNames.length) {
//         return respondWithError(res, 400, 'ERR_INVALID_INPUT', 'Mismatch between language IDs and names');
//     }

//     try {
//         // Check if user exists
//         const userExists = await prisma.user.findUnique({
//             where: { id },
//         });

//         if (!userExists) {
//             return respondWithError(res, 400, 'ERR_INVALID_ID', 'User does not exist');
//         }

//         // Upsert each language for the user
//         for (let i = 0; i < languageIds.length; i++) {
//             await prisma.jS_languages.upsert({
//                 where: {
//                     user_id_lang_id: {
//                         user_id: id,
//                         lang_id: languageIds[i],
//                     }
//                 },
//                 update: {
//                     lang_name: languageNames[i],
//                     updated_at: new Date(),
//                 },
//                 create: {
//                     user_id: id,
//                     lang_id: languageIds[i],
//                     lang_name: languageNames[i],
//                 }
//             });
//         }

//         logger.info('Languages added successfully', { userId: id });
//         respondWithJSON(res, 200, { message: 'Languages added successfully' });

//     } catch (err) {
//         logger.error('Failed to add languages', { error: err.message });
//         respondWithError(res, 500, 'ERR_INTERNAL', 'An internal error occurred');
//     }
// }

// module.exports = {
//     addLanguages
// };


const { PrismaClient } = require("@prisma/client");
const Joi = require('joi');
const winston = require('winston');

// Initialize Prisma
const prisma = new PrismaClient();

// Logger
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

// Joi validation schema
const languageSchema = Joi.object({
    id: Joi.number().required(), // should be number (User.id is Int)
    lang_id: Joi.string().required(),
    lang_name: Joi.string().required()
});

// Error response function
function respondWithError(res, statusCode, errorCode, message) {
    res.status(statusCode).json({
        error_code: errorCode,
        message
    });
}

// Success response
function respondWithJSON(res, statusCode, payload) {
    res.status(statusCode).json(payload);
}

// Main logic
async function addLanguages(req, res) {
    const { error, value } = languageSchema.validate(req.body);
    if (error) {
        return respondWithError(res, 400, 'ERR_INVALID_INPUT', error.details[0].message);
    }

    const { id, lang_id, lang_name } = value;

    const languageIds = lang_id.split(',').map(id => parseInt(id.trim(), 10));
    const languageNames = lang_name.split(',').map(name => name.trim());

    if (languageIds.length !== languageNames.length) {
        return respondWithError(res, 400, 'ERR_INVALID_INPUT', 'Mismatch between language IDs and names');
    }

    try {
        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id },
        });

        if (!userExists) {
            return respondWithError(res, 400, 'ERR_INVALID_ID', 'User does not exist');
        }

        // Upsert each language for the user after checking if lang_id exists
        for (let i = 0; i < languageIds.length; i++) {
            const langCheck = await prisma.languages.findUnique({
                where: { lang_id: languageIds[i] },
            });

            if (!langCheck) {
                return respondWithError(res, 400, 'ERR_INVALID_LANG_ID', `Language ID ${languageIds[i]} does not exist`);
            }

            await prisma.jS_languages.upsert({
                where: {
                    user_id_lang_id: {
                        user_id: id,
                        lang_id: languageIds[i],
                    }
                },
                update: {
                    lang_name: languageNames[i],
                    updated_at: new Date(),
                },
                create: {
                    user_id: id,
                    lang_id: languageIds[i],
                    lang_name: languageNames[i],
                }
            });
        }

        logger.info('Languages added successfully', { userId: id });
        respondWithJSON(res, 200, { message: 'Languages added successfully' });

    } catch (err) {
        logger.error('Failed to add languages', { error: err.message });
        respondWithError(res, 500, 'ERR_INTERNAL', 'An internal error occurred');
    }
}

module.exports = {
    addLanguages
};
