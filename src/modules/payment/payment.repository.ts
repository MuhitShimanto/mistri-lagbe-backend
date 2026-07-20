import prisma from '../../config/db.js';
import { type PaymentStatus } from '../../generated/prisma/enums.js';
import type { CreatePaymentInput } from './payment.validation.js';

class PaymentRepository {
  async createPayment(data: CreatePaymentInput) {
    const result = await prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        userId: data.userId,
        amount: data.amount,
        provider: data.provider,
        status: data.status as PaymentStatus,
        transactionId: data.transactionId,
        meta: data.meta || {},
        method: '',
      } 
    });
    return result;
  }
  async getPaymentByTransactionId(transactionId: string) {
    const result = await prisma.payment.findUnique({
      where: {
        transactionId: transactionId,
      },
    });
    return result;
  }
  async getPaymentByBookingId(bookingId: string) {
    const result = await prisma.payment.findUnique({
      where: {
        bookingId: bookingId,
      },
    });
    return result;
  }
  async updatePaymentStatus(transactionId: string, status: PaymentStatus, method: string, paidAt: Date, meta: any) {
    const result = await prisma.payment.update({
      where: {
        transactionId: transactionId,
      },
      data: {
        status: status,
        method: method,
        paidAt: paidAt,
        meta: meta,
      },
    });
    return result;
  }
}

export default new PaymentRepository();
