'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'member_tbl',
          'test1',
          { type: Sequelize.DataTypes.STRING, },
          { transaction: t },
        ),

        queryInterface.addColumn(
          'cart_tbl',
          'test2',
          { type: Sequelize.DataTypes.STRING, },
          { transaction: t },
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('member_tbl', 'test1', { transaction: t }),
        queryInterface.removeColumn('cart_tbl', 'test2', { transaction: t }),
      ]);
    });
  },
};