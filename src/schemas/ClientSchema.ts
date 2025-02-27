import {z} from "zod";

export const clientCreateOrUpdateSchema = z.object({
    id:z.string().uuid().optional(),
    name: z.string().min(3).max(100),
    surname: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string(),
    address: z.string(),
    date_of_birth: z.string(),
    gender: z.string(),
    document_number: z.string(),
    type_document: z.string(),
    type: z.number().optional()
});

export const clientCreateInvoice = z.object({
    customer_id:z.string().uuid(),
    insurance_id:z.string().uuid(),
    total_value: z.number(),
    issued_at: z.string().date(),
    due_date: z.string().date(),
});

export const clientUpdateSchemaSchema = z.object({
    customer_id:z.string().uuid(),
    status: z.string()
});

export const clientPaymentCreateOrUpdateSchema = z.object({
    payment_id:z.string().uuid().optional(),
    invoice_id:z.string().uuid(),
    amount:z.number(),
    payment_method:z.string(),
    payment_date:z.string().date(),
    type: z.number().optional()
})

export const clientFilterSchema = z.object({
    searchTerm: z.string().optional(),
    user_uuid: z.string().uuid().optional(),
    status: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional()
});

export const clientLoadInsurance = z.object({
    client_id: z.string().uuid()
});

export const clientPaymentCancelSchema = z.object({
    payment_id:z.string().uuid(),
});

export const clientInvoiceCancelSchema = z.object({
    invoice_id:z.string().uuid(),
});

export const clientLoadInvoiceAndPayment = z.object({
    insure_id: z.string().uuid()
});