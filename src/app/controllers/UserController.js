import User from '../models/User';

class UserController {
  async store(req, res) {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({ error: 'User already exist' });
    }
    const response = await User.create(req.body);
    return res.json(response);
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exist' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const newUser = await user.update(req.body);
    return res.json(newUser);
  }
}

export default new UserController();
