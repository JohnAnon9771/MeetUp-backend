import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number(),
      meetup_id: Yup.number()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const meetup = await Meetup.findByPk(req.params.id, {
      include: {
        association: 'user'
      }
    });

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'User cannot register for your meetup' });
    }
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "Can't subscribe in meetup closed" });
    }

    const user = await User.findByPk(req.userId, {
      include: {
        association: 'subscriptions',
        through: {
          attributes: ['user_id', 'meetup_id']
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not is logaded' });
    }

    if (
      user.subscriptions &&
      user.subscriptions.user_meetups &&
      user.subscriptions.user_meetups.meetup_id === meetup.id
    ) {
      return res
        .status(400)
        .json({ error: 'User cannot register twice for the same meetup' });
    }
    if (user.subscriptions && user.subscriptions.date === meetup.date) {
      return res.status(400).json({
        error: 'User cannot sign up for two meetups that take place onsame time'
      });
    }

    // methods for N-N: setModel, getModel, addModel, removeModel....
    await meetup.addUser(user);

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Uma nova inscrição',
      template: 'subscription',
      context: {
        user_meetup: meetup.user.name,
        user: user.name
      }
    });

    return res.json(user);
  }
}

export default new SubscriptionController();
