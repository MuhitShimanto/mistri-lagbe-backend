import { PaymentStatus } from '../../generated/prisma/enums.js';
import paymentRepository from './payment.repository.js';
import type { CreatePaymentInput } from './payment.validation.js';

class PaymentService {
  createPayment = async (data: CreatePaymentInput) => {
    const result = await paymentRepository.createPayment(data);
    return result;
  };
  paymentByTransactionId = async (transactionId: string) => {
    const paymentRecord = await paymentRepository.getPaymentByTransactionId(transactionId);
    return paymentRecord;
  };
  paymentByBookingId = async (bookingId: string) => {
    const paymentRecord = await paymentRepository.getPaymentByBookingId(bookingId);
    return paymentRecord;
  };
  updatePaymentStatus = async (transactionId: string, status: PaymentStatus, method: string, paidAt: Date, meta: any) => {
    const updatedPayment = await paymentRepository.updatePaymentStatus(transactionId, status, method, paidAt, meta);
    return updatedPayment;
  };
}

export default new PaymentService();
