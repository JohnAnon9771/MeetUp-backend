import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const date = parseISO(req.body.date);
    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const meetup = await Meetup.create({ user_id: req.userId, ...req.body });

    return res.json(meetup);
  }
}

export default new MeetupController();
