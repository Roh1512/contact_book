const prisma = require("../config/prismaClient");
const { validationResult } = require("express-validator");

const { addContactValidator } = require("../validators/contactValidators");

const { validationErrors, errorMessage } = require("../utils/errorMessages");
const { successMessage } = require("../utils/successHandler");

exports.addContact = [
  addContactValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(validationErrors(400, errors.array()));
    }
    try {
      const { name, email, phone, address } = req.body;
      const newContact = await prisma.contact.create({
        data: {
          name: name,
          email: email || "",
          phone: phone || "",
          address: address || "",
          User: {
            connect: { id: req.user.id },
          },
        },
      });
      return res.status(201).json(successMessage("Contact added"));
    } catch (error) {
      console.error(error);
      return next(errorMessage(500, "Internal Server Error."));
    }
  },
];

exports.getContacts = async (req, res, next) => {
  try {
    const { page } = req.query;
    const PAGE = page ? parseInt(page) : 1;
    const limit = 20;
    const skip = (PAGE - 1) * limit;
    const contacts = await prisma.contact.findMany({
      where: {
        User: {
          id: req.user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: limit,
    });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return next(errorMessage(500, "Internal Server Error."));
  }
};

exports.editContact = async (req, res, next) => {
  try {
    const { contactid } = req.params;
    const { name, email, phone, address } = req.body;
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactid,
        User: {
          id: req.user.id,
        },
      },
    });
    if (!contact) {
      return next(errorMessage(404, "Contact not found"));
    }
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactid,
      },
      data: {
        name: name || contact.name,
        email: email || contact.email,
        phone: phone || contact.phone,
        address: address || contact.address,
      },
    });

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    return next(errorMessage(500, "Internal server error"));
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const { contactid } = req.params;
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactid,
      },
    });
    if (!contact) {
      return next(errorMessage(404, "Contact not found"));
    }
    await prisma.contact.delete({
      where: {
        id: contactid,
        User: {
          id: req.user.id,
        },
      },
    });
    return res.status(200).json(successMessage("Contact deleted"));
  } catch (error) {
    console.error(error);
    return next(errorMessage(500, "Internal server errir"));
  }
};
