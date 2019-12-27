module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'MeetUp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};
