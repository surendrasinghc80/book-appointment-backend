"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash("74107410", 10);
    const hashedPassword2 = await bcrypt.hash("74107410", 10);
    const hashedPassword3 = await bcrypt.hash("74107410", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          email: "john@gmail.com",
          password: hashedPassword1,
          phoneNumber: 9876543210,
          role: "user",
        },
        {
          name: "Test",
          email: "test@gmail.com",
          password: hashedPassword2,
          phoneNumber: 9876543210,
          role: "user",
        },
        {
          name: "Admin",
          email: "admin@gmail.com",
          password: hashedPassword3,
          phoneNumber: 9876543210,
          role: "admin",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
