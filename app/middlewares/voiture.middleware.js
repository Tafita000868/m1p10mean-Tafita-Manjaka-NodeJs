const Joi = require('joi');

const voitureMiddleware = {
    validate: (req, res, next) => {
        const schema = Joi.object().keys({
            utilisateurId: Joi.string().required(),
            marque: Joi.string().required(),
            type: Joi.string().required(),
            matricule: Joi.string().required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).send({ message: error.details[0].message });
            return;
        }
        next();
    }
};

module.exports = voitureMiddleware;