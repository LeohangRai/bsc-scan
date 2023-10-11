import { number, object, string } from 'zod';
import Container from 'typedi';
import { AuthService } from '../auth.service';

async function isEmailUnique(email: string): Promise<boolean> {
  const user = await authService.findOneByEmail(email);
  return user == null;
}

async function isUsernameUnique(username: string): Promise<boolean> {
  const user = await authService.findOneBy({ username });
  return user == null;
}

async function isContactUnique(contact: string): Promise<boolean> {
  const user = await authService.findOneBy({ contact });
  return user == null;
}

function isGenderValid(value: string): boolean {
  return ['male', 'female', 'others'].includes(value.toLowerCase());
}

const authService = Container.get(AuthService);

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required: ['username', 'email', 'password', 'confirmPassword']
 *       properties:
 *         username:
 *           type: string
 *           default: ginger_cat7
 *         email:
 *           type: string
 *           default: gingercat7@gmail.com
 *         password:
 *           type: string
 *           default: ninja_ginger_cat
 *         confirmPassword:
 *           type: string
 *           default: ninja_ginger_cat
 *         contact:
 *           type: string
 *         gender:
 *           type: string
 *         age:
 *           type: number
 *     RegisterUserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             contact:
 *               type: string
 *             gender:
 *               type: string
 *             age:
 *               type: number
 */
export const registerUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' })
      .min(8, 'Username must have at least 8 characters')
      .max(20, 'Username should not exceed 20 characters')
      .regex(/^[a-z][a-z0-9_]{7,19}$/, 'Invalid username')
      .refine(isUsernameUnique, { message: 'Username already in use' }),

    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password size must not exceed 20 characters'),

    confirmPassword: string({
      required_error: 'Confirm password is required'
    }),

    email: string({
      required_error: 'Email is required'
    })
      .email()
      .refine(isEmailUnique, { message: 'Email already in use' }),

    contact: string()
      .regex(/^\d{6,20}$/, 'Invalid contact number')
      .refine(isContactUnique, { message: 'Contact number already in use' })
      .optional(),

    gender: string()
      .refine(isGenderValid, {
        message: `Gender must be either 'Male', 'Female' or 'Others'`
      })
      .optional(),

    age: number({
      invalid_type_error: 'Age must be a number'
    }).optional()
  }).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password and confirm password do not match',
    path: ['confirmPassword']
  })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           default: ''
 *         password:
 *           type: string
 *           default: ''
 *     LoginResponse:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         token:
 *           type: string
 */
export const loginSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' }).regex(
      /^[a-z][a-z0-9_]{7,19}$/,
      'Invalid username'
    ),

    password: string({ required_error: 'Password is required' })
  })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           default: ginger_cat
 *         email:
 *           type: string
 *           default: gingercat@gmail.com
 *         contact:
 *           type: string
 *         gender:
 *           type: string
 *         age:
 *           type: number
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             contact:
 *               type: string
 *             gender:
 *               type: string
 *             age:
 *               type: number
 */
export const updateProfileSchema = object({
  body: object({
    username: string()
      .min(8, 'Username must have at least 8 characters')
      .max(20, 'Username should not exceed 20 characters')
      .regex(/^[a-z][a-z0-9_]{7,19}$/, 'Invalid username')
      .refine(isUsernameUnique, { message: 'Username already in use' })
      .optional(),

    email: string()
      .email()
      .refine(isEmailUnique, { message: 'Email already in use' })
      .optional(),

    contact: string()
      .regex(/^\d{6,20}$/, 'Invalid contact number')
      .refine(isContactUnique, { message: 'Contact number already in use' })
      .optional(),

    gender: string()
      .refine(isGenderValid, {
        message: `Gender must be either 'Male', 'Female' or 'Others'`
      })
      .optional(),

    age: number({
      invalid_type_error: 'Age must be a number'
    }).optional()
  })
});
