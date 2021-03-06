'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.hasMany(models.Transaction, {
        foreignKey: "memberId",
        as: "transactions"
      });
    }
  }
  Member.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};
