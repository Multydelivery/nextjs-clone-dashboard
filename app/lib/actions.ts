"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import postgres from "postgres";
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Database functions commented out - using placeholder data instead
// These would be used when connected to a real database

/* 
export async function createInvoice(prevState: State, formData: FormData) {
  // Database creation logic would go here
  return {
    message: 'Feature not available with placeholder data.',
  };
}

export async function updateInvoice(id: string, formData: FormData) {
  // Database update logic would go here
  throw new Error('Feature not available with placeholder data.');
}

export async function deleteInvoice(id: string) {
  // Database deletion logic would go here
  throw new Error('Feature not available with placeholder data.');
}
*/

// Authentication actions - these work with placeholder data
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut();
}
