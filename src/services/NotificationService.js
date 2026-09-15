export default class NotificationService {
  constructor(notificationModel, logger) {
    this.notificationModel = notificationModel;
    this.logger = logger;
  }

  async notify(userId, data) {
    try {
      await this.notificationModel.create({
        user_id: userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data ? JSON.stringify(data.data) : null,
      });

      this.logger.info(`Notification sent to user ${userId}: ${data.title}`);
    } catch (error) {
      this.logger.error('Notification send error:', error);
      throw error;
    }
  }

  async notifyMany(userIds, data) {
    try {
      for (const userId of userIds) {
        await this.notify(userId, data);
      }

      this.logger.info(`Notifications sent to ${userIds.length} users`);
    } catch (error) {
      this.logger.error('Bulk notification error:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, page = 1, perPage = 20) {
    try {
      return await this.notificationModel.paginate(page, perPage);
    } catch (error) {
      this.logger.error('Notification retrieval error:', error);
      throw error;
    }
  }
}
