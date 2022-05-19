'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {
        foreignKey: "userId",
        as: "transactions"
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, saltRounds));
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'cashier'],
      defaultValue: 'cashier'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
