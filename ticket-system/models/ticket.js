
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'),
      defaultValue: 'Новое',
      allowNull: false
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true // Может быть null, пока обращение не завершено
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true // Может быть null, пока обращение не отменено
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {});
  Ticket.associate = function(models) {   
  };
  return Ticket;
};