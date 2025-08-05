"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add `specialistIn` column
    await queryInterface.addColumn("appointments", "specialistIn", {
      type: Sequelize.STRING,
      allowNull: false, // you can set true if it's optional
    });

    // Add `doctorId` column
    await queryInterface.addColumn("appointments", "doctorId", {
      type: Sequelize.INTEGER,
      allowNull: false, // set to true if not required
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove `specialistIn` column
    await queryInterface.removeColumn("appointments", "specialistIn");

    // Remove `doctorId` column
    await queryInterface.removeColumn("appointments", "doctorId");
  },
};
