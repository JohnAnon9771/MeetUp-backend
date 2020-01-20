import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number(),
      meetup_id: Yup.number()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const meetup = await Meetup.findByPk(req.params.id);
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
    // desctruture user for get meetup_id
    const {
      subscriptions: [
        {
          date,
          user_meetups: { meetup_id }
        }
      ]
    } = user;

    if (!user) {
      return res.status(401).json({ error: 'User not is logaded' });
    }
    if (meetup_id === meetup.id) {
      return res
        .status(400)
        .json({ error: 'User cannot register twice for the same meetup' });
    }
    if (date === meetup.date) {
      return res.status(400).json({
        error: 'User cannot sign up for two meetups that take place onsame time'
      });
    }
    // methods for N-N: setModel, getModel, addModel, removeModel....
    await meetup.addUser(user);

    return res.json(user);
  }
}

export default new SubscriptionController();
