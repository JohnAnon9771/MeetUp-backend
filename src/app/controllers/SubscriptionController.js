import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

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

    if (user.subscriptions.length) {
      const {
        subscriptions: [{ user_meetups, date }]
      } = user;

      if (user_meetups.meetup_id === meetup.id) {
        return res
          .status(400)
          .json({ error: 'User cannot register twice for the same meetup' });
      }

      if (date === meetup.date) {
        return res.status(400).json({
          error:
            'User cannot sign up for two meetups that take place onsame time'
        });
      }
    }

    // methods for N-N: setModel, getModel, addModel, removeModel....
    await meetup.addUser(user);

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user
    });

    return res.json();
  }
}

export default new SubscriptionController();
