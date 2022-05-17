'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init({
    member_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    deadline: DataTypes.DATE,
    payment_date: DataTypes.DATE,
    progress_status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
    underscored: true,
  });
  return transaction;
};