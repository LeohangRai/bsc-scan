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
export const registerUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' })
      .min(8, 'Username must have at least 8 characters')
      .max(20, 'Username should not exceed 20 characters')
      .regex(/^[a-z][a-z0-9_]{7,19}$/, 'Invalid username')
      .refine(isUsernameUnique, { message: 'Username already in use' }),

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
  })
});
