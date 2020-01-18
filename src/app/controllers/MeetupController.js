import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userId } });
    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      locale: Yup.string(),
      date: Yup.date()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const date = parseISO(req.body.date);
    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const meetup = await Meetup.create({ user_id: req.userId, ...req.body });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      locale: Yup.string(),
      date: Yup.date()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const meetups = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId
      }
    });
    if (!meetups) {
      return res.status(400).json({ error: 'Meetup not exist' });
    }
    if (isBefore(req.body.date, new Date())) {
      return res.status(400).json({ error: 'Date not is valid' });
    }
    if (meetups.past) {
      return res.status(400).json({ error: "Can't update Meetup closed" });
    }

    const response = await meetups.update(req.body);

    return res.json(response);
  }

  async destroy(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      locale: Yup.string(),
      date: Yup.date()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const meetups = await Meetup.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId
      }
    });
    if (meetups.past) {
      return res.status(400).json({ error: "Can't delet Meetup closed" });
    }
    const response = await meetups.destroy();

    return res.json(response);
  }
}

export default new MeetupController();
