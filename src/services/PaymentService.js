export default class PaymentService {
  constructor(paymentModel, walletModel, logger, config) {
    this.paymentModel = paymentModel;
    this.walletModel = walletModel;
    this.logger = logger;
    this.config = config;
  }

  async initiatePayment(userId, amount, description) {
    try {
      const payment = await this.paymentModel.create({
        user_id: userId,
        amount,
        description,
        status: 'pending',
      });

      this.logger.info(`Payment initiated: user=${userId}, amount=${amount}`);
      return payment;
    } catch (error) {
      this.logger.error('Payment initiation error:', error);
      throw error;
    }
  }

  async confirmPayment(paymentId, referenceId) {
    try {
      await this.paymentModel.update(paymentId, {
        reference_id: referenceId,
        status: 'completed',
        paid_at: new Date(),
      });

      const payment = await this.paymentModel.find(paymentId);
      await this.creditWallet(payment.user_id, payment.amount);

      this.logger.info(`Payment confirmed: ${paymentId}`);
    } catch (error) {
      this.logger.error('Payment confirmation error:', error);
      throw error;
    }
  }

  async creditWallet(userId, amount) {
    try {
      await this.walletModel.query(
        'UPDATE wallets SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?',
        [amount, amount, userId]
      );

      this.logger.info(`Wallet credited: user=${userId}, amount=${amount}`);
    } catch (error) {
      this.logger.error('Wallet credit error:', error);
      throw error;
    }
  }
}
