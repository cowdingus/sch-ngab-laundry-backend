'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      memberId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Member",
          key: "id"
        }
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deadline: {
        allowNull: false,
        type: Sequelize.DATE
      },
      paymentDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      progressStatus: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["new", "in_progress", "done", "picked_up"],
        defaultValue: "new"
      },
      paymentStatus: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ["already_paid", "not_paid_yet"],
        defaultValue: "not_paid_yet"
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "User",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};
