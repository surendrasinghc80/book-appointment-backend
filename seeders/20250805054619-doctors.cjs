"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "doctors",
      [
        {
          name: "Dr. Rajesh Sharma",
          specialistIn: "Cardiologist",
          age: 45,
          phoneNumber: 9876543210,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Kavita Joshi",
          specialistIn: "Dermatologist",
          age: 45,
          phoneNumber: 9998887776,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Meera Kapoor",
          specialistIn: "Pediatrician",
          age: 35,
          phoneNumber: 9998887766,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Priya Menon",
          specialistIn: "Gynecologist",
          age: 45,
          phoneNumber: 99988776655,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Anil Verma",
          specialistIn: "Orthopedic Surgeon",
          age: 45,
          phoneNumber: 9988776655,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Neha Singh",
          specialistIn: "ENT (Ear, Nose, Throat)",
          age: 45,
          phoneNumber: 8877665599,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Ramesh Iyer",
          specialistIn: "Dentistry",
          age: 45,
          phoneNumber: 9856478677,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Manoj Gupta",
          specialistIn: "Neurologist",
          age: 45,
          phoneNumber: 7410741089,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Pooja Bansal",
          specialistIn: "Psychiatry",
          age: 45,
          phoneNumber: 9876556689,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Dr. Suresh Patil",
          specialistIn: "General Physician",
          age: 45,
          phoneNumber: 9876544886,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("doctors", null, {});
  },
};
