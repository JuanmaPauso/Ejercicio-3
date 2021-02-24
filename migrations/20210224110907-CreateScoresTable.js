'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Scores', {
                id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true
                },
                wins: Sequelize.INTEGER,
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false
                }

            }, {
                sync: { force: true }
            }
        );
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Scores');
    }
};