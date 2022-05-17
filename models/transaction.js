'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.hasMany(models.TransactionDetail);
      Transaction.hasOne(models.User);
      Transaction.hasOne(models.Member);
    }
  }
  Transaction.init({
    memberId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    deadline: DataTypes.DATE,
    paymentDate: DataTypes.DATE,
    progressStatus: {
      type: DataTypes.ENUM,
      values: ["new", "in_progress", "done", "picked_up"],
      defaultValue: "new"
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      values: ["already_paid", "not_paid_yet"],
      defaultValue: "not_paid_yet"
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
