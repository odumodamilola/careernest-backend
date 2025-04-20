import Joi from "joi";

// Define validation schemas

// User registration validation
export const validateRegister = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    })
  });

  return schema.validate(data);
};

// User login validation
export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Update profile validation
export const validateUpdateProfile = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    bio: Joi.string(),
    skills: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string()),
    profileImage: Joi.string().uri().allow('')
  });

  return schema.validate(data);
};

// Parameter validation (for IDs)
export const validateParam = (id: string) => {
  const schema = Joi.string().required();
  return schema.validate(id);
};

// Schedule session validation
export const validateScheduleSession = (data: any) => {
  const schema = Joi.object({
    date: Joi.date().required(),
    startTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    topic: Joi.string().required().max(100),
    notes: Joi.string().allow('')
  });

  return schema.validate(data);
};

// Assessment submission validation
export const validateAssessmentSubmission = (data: any) => {
  const schema = Joi.object({
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOptions: Joi.array().items(Joi.string()).required()
      })
    ).required()
  });

  return schema.validate(data);
};
