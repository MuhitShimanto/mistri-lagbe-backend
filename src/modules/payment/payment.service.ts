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
    const paymentRecord = await paymentRepository.getPaymentByTransactionId(transactionId);
    if (user.role !== Role.ADMIN && paymentRecord?.userId !== user.id) {
      throw new ApiError(403, 'Forbidden: You do not have access to this payment record');
    }
    return paymentRecord;
  };
  updatePaymentStatus = async (
    transactionId: string,
    status: PaymentStatus,
    method: string,
    paidAt: Date,
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
    const paymentHistory = await paymentRepository.getPaymentHistoryByUserId(userId);
    return paymentHistory;
  };
}

export default new PaymentService();
