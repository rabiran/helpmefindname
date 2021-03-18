const { HttpError } = require ('../../helpers/errorHandlers/httpError');
const Joi = require('joi');
const config = require('../../config');

const creationSchema = Joi.object({
    id: Joi.string().required(),
    gardenerId: Joi.string().optional(),
    primaryUniqueId: Joi.string().required(),
    isNewUser: Joi.boolean().default(false),
    startDate: Joi.date().optional(),
    isUrgent: Joi.boolean().default(false),
});

const globalUpdateSchema = Joi.array().items(Joi.object({
    id: Joi.string().required(),
    steps: Joi.array().required().items(Joi.object({
        name: Joi.string().required(),
        subSteps: Joi.array().required().items(Joi.object({
            name: Joi.string().required(),
            status: Joi.number().required()
        }))
    })),
}));

const updateStepSchema = Joi.object({
    step: Joi.string().optional(),
    subStep: Joi.string().optional(),
    progress: Joi.string().optional().valid(...config.statusEnums),
    paused: Joi.boolean().optional(),
    unpauseable: Joi.boolean().optional(),
    viewed: Joi.boolean().optional(),
});


const isValidCreation = (req, res, next) => {
    const { error } = creationSchema.validate(req.body);
    if(error) {
        sendError(error);
    }
    next(); 
}

const isValidGlobalUpdate = (req, res, next) => {
    const { error } = globalUpdateSchema.validate(req.body);
    if(error) {
        sendError(error);
    }
    next(); 
}

const isValidStepUpdate = (req, res, next) => {
    const { error } = updateStepSchema.validate(req.body);
    if(error) {
        sendError(error);
    }
    next(); 
}

const sendError = (err) => {
    let msg = err.details[0].message;
    msg = msg.replace(/"/g, '');
    throw new HttpError(400, msg);
}

// const isProperType = (value, type) => (value !== undefined && typeof(value) === type)

module.exports = { isValidCreation, isValidStepUpdate, isValidGlobalUpdate }