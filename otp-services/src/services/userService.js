const prisma = require("../config/database");
const OTPAuth = require("otpauth");

exports.getAllUsers = async () => {
  return await prisma.user.findMany();
};

exports.createUser = async (userData) => {
  const secret = new OTPAuth.Secret({ size: 20 });

  return await prisma.user.create({
    data: {
      firstname: userData.firstname,
      lastname: userData.lastname,
      secret: secret.base32,
    },
  });
};
