import type { User } from '../../generated/prisma/client.js';
import { PaymentStatus, Role } from '../../generated/prisma/enums.js';
import ApiError from '../../utils/ApiError.js';
import paymentRepository from './payment.repository.js';
import type { CreatePaymentInput } from './payment.validation.js';

class PaymentService {
  createPayment = async (data: CreatePaymentInput) => {
    const result = await paymentRepository.createPayment(data);
    return result;
  };
  paymentByTransactionId = async (transactionId: string, user: User) => {
    // Check if the payment belongs to the user or if the user is an admin
    const payment = await paymentRepository.getPaymentByTransactionId(transactionId);
    if (user.role !== Role.ADMIN && payment?.userId !== user.id) {
      throw new ApiError(403, 'Forbidden: You do not have access to this payment record');
    }
    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }
    const formattedResult = {
      userId: payment.userId,
      transactionId: payment.transactionId,
      paymentId: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
      method: payment.meta?.card_issuer || payment.method || 'N/A',
      paidAt: payment.paidAt,
      validatedAt: payment.meta?.validated_on || null,
      createdAt: payment.createdAt,
    };
    return formattedResult;
  };
  updatePaymentStatus = async (
    transactionId: string,
    status: PaymentStatus,
    method: string,
    paidAt: Date | null,
    meta: any,
  ) => {
    const updatedPayment = await paymentRepository.updatePaymentStatus(
      transactionId,
      status,
      method,
      paidAt,
      meta,
    );
    return updatedPayment;
  };
  paymentHistoryByUserId = async (userId: string) => {
    const result = await paymentRepository.getPaymentHistoryByUserId(userId);
    // Format the result to include only necessary fields
    const formattedResult = result.map((payment) => ({
      userId: payment.userId,
      transactionId: payment.transactionId,
      paymentId: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      status: payment.status,
      method: payment.meta?.card_issuer || payment.method || 'N/A',
      paidAt: payment.paidAt,
      validatedAt: payment.meta?.validated_on || null,
      createdAt: payment.createdAt,
    }));
    return formattedResult;
  };
  paymentByBookingId = async (bookingId: string) => {
    const paymentRecord = await paymentRepository.getPaymentByBookingId(bookingId);
    return paymentRecord;
  };
}

export default new PaymentService();
