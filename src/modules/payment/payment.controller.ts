import type { Request, Response } from 'express';
import config from '../../config/index.js';
import bookingService from '../booking/booking.service.js';
import ApiError from '../../utils/ApiError.js';
import { PaymentProvider, PaymentStatus, type User } from '../../generated/prisma/client.js';
import authRepository from '../auth/auth.repository.js';
import SSLCommerzPayment from 'sslcommerz-lts';
import paymentService from './payment.service.js';
import axios from 'axios';

const store_id = config.sslCommerz.store_id;
const store_passwd = config.sslCommerz.store_passwd;
const is_live = config.sslCommerz.is_live;

class PaymentController {
  createPaymentIntent = async (req: Request, res: Response) => {
    const { bookingId } = req.body;
    const userId = req.user?.id;
    const user = await authRepository.findUserById(userId as string);
    const bookingDetails = await bookingService.bookingById(bookingId);
    if (!bookingDetails || bookingDetails.customerId !== userId || !user) {
      throw new ApiError(400, 'Invalid booking or user not authorized');
    }
    const transactionId = this.generateTransactionId(user as User, bookingId);
    const data = {
      total_amount: bookingDetails.totalAmount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${config.appUrl}/api/v1/payments/verify?status=success&transactionId=${transactionId}&bookingId=${bookingId}`,
      fail_url: `${config.appUrl}/api/v1/payments/verify?status=fail&transactionId=${transactionId}&bookingId=${bookingId}`,
      cancel_url: `${config.appUrl}/api/v1/payments/verify?status=cancel&transactionId=${transactionId}&bookingId=${bookingId}`,
      //   ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'NO',
      // product_name: 'Computer.',
      // product_category: 'Service',
      // product_profile: 'general',
      cus_name: user.name,
      cus_email: user.email,
      //   cus_add1: 'Dhaka',
      //   cus_add2: 'Dhaka',
      //   cus_city: 'Dhaka',
      //   cus_state: 'Dhaka',
      //   cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: user.phone,
      //   cus_fax: '01711111111',
      // ship_name: 'Customer Name',
      //   ship_add1: 'Dhaka',
      //   ship_add2: 'Dhaka',
      //   ship_city: 'Dhaka',
      //   ship_state: 'Dhaka',
      //   ship_postcode: 1000,
      //   ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const sslResponse = await sslcz.init(data);
    if (sslResponse.status === 'SUCCESS') {
      // Save the payment record in the database with status PENDING
      const newPaymentData = {
        bookingId: bookingId,
        userId: userId as string,
        amount: bookingDetails.totalAmount,
        provider: PaymentProvider.SSLCOMMERZ,
        status: PaymentStatus.PENDING,
        transactionId: transactionId,
      };
      await paymentService.createPayment(newPaymentData);
      res.status(200).json({
        success: true,
        message: 'Payment intent created successfully',
        data: {
          gatewayPageURL: sslResponse.GatewayPageURL,
          transactionId: transactionId,
        },
      });
    }
  };
  generateTransactionId = (user: User, productId: string) => {
    const timestamp = Date.now();
    const transactionId = `${user.id}-${productId}-${timestamp}`;
    return transactionId;
  };
  handlePaymentVerify = async (req: Request, res: Response) => {
    const { status, transactionId, bookingId } = req.query;
    // Success URL
    if (status === 'success') {
      if (!transactionId || !bookingId) {
        throw new ApiError(400, 'Bad Request');
      }
      const paymentRecord = await paymentService.paymentByBookingId(bookingId as string);
      if (!paymentRecord) {
        throw new ApiError(404, 'Payment record not found');
      }

      // Payment record found, validate the payment with SSLCommerz
      const validateResponse = await axios.get(
        `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${req.body.val_id}&store_id=${config.sslCommerz.store_id}&store_passwd=${config.sslCommerz.store_passwd}&v=1&format=json`,
      );

      console.log(validateResponse.data);

      // Status "VALID"
      if (validateResponse.data.status === 'VALID') {
        // Update the payment status to SUCCESS
        const payload = {
          status: PaymentStatus.COMPLETED,
          method: validateResponse.data.card_type || 'N/A',
          paidAt: new Date(validateResponse.data.tran_date),
        };
        await paymentService.updatePaymentStatus(
          transactionId as string,
          payload.status,
          payload.method,
          payload.paidAt,
          validateResponse.data,
        );
        res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid payment',
        });
      }
    }
    // Fail URL
    else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        data: {
          redirectUrl: `${config.appUrl}/payment/failure?transactionId=${transactionId}&bookingId=${bookingId}`,
        }
      });
    }
  };
}

export default new PaymentController();
