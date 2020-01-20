module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_meetups', {
      id: {
        type: Sequelize.INTEGER,
        primeryKey: true,
        autoIncrement: true,
        alloNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meetup_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'meetups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        alloNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        alloNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('user_meetups');
  }
};
