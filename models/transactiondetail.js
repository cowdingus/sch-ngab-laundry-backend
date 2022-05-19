'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: "transactionId",
        as: "transaction"
      });

      TransactionDetail.belongsTo(models.Package, {
        foreignKey: "packageId",
        as: "package"
      });
    }
  }
  TransactionDetail.init({
    transactionId: DataTypes.INTEGER,
    packageId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionDetail',
  });
  return TransactionDetail;
};
