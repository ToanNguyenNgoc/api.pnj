export const SWAGGER_TAG = {
  Banner: 'Banner',
  Category: 'Category',
  Product: 'Product',
  Auth: 'Auth',
  User: 'User',
  RolePermission: 'Role & Permission',
  Admin: 'Admin',
  AdminOrder: 'AdminOrder',
  Media: 'Media',
  Province: 'Province',
  UserAddresses: 'UserAddresses',
  PaymentMethod: 'PaymentMethod',
  Orders: 'Orders',
  Organizations: 'Organizations',
  Blog: 'Blog',
  BlogCategory: 'BlogCategory',
  Brand: 'Brand',
  Topic_Message: 'Topic & Message',
  BrandAppBundle: 'Brand App Bundle',
};
export const NAME = {
  JWT: 'json_web_token',
  MEDIA: 'media',
};
export const QUEUE_NAME = {
  send_mail: 'send_mail',
  instance_province: 'instance_province',
  province: 'province',
};
export const CACHE_KEY_NAME = {
  user_online: 'user_online',
};
export class WS_EVENT_NAME {
  static notification_org = 'notification.org';
  static notification = 'notification.user';
  static chat_topic = 'chat.topic';
  static leave_topic = 'leave.topic';
  static chat_topic_typing = 'chat.topic.typing';

  // static message_global = 'message_global';
  // static create_topic = 'create_topic';
  // static recipient_user = 'recipient_user';
  // static receive_topic = 'receive_topic';
  // static join_all = 'join_all';
  // static join = 'join';
  // static message = 'message';
  // static typing = 'typing';
}
