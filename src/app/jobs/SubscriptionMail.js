import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;
    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Uma nova inscrição',
      template: 'subscription',
      context: {
        user_meetup: meetup.user.name,
        user: user.name
      }
    });
  }
}

export default new SubscriptionMail();
