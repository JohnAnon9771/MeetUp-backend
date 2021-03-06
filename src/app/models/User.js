import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  // for the listing to come with the meetups
  static associate(models) {
    this.hasMany(models.Meetup, { foreignKey: 'user_id', as: 'meetups' });
    this.belongsToMany(models.Meetup, {
      foreignKey: 'user_id',
      through: 'user_meetups',
      as: 'subscriptions'
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
