const prisma = require("../config/database");
const OTPAuth = require("otpauth");

// 1.if user secret not exist for that user throw error
// 2. if user exist then create new totp object by calling TOTP function from OTPAuth library
// 3. generate the token by calling generate() function from the new instance totp created
// 4. return token/otp as result of calling this function
exports.generateOTP = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user || !user.secret) throw new Error("User secret not created");

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(user.secret),
    label: "GSS",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });

  let seconds = totp.period - (Math.floor(Date.now() / 1000) % totp.period);
  console.log(seconds);
  return totp.generate();
};

// 1.if user secret not exist for that user throw error
// 2. if user exist then create new totp object by calling TOTP function from OTPAuth library
// 3. validate the token by calling validate() function from the new instance totp created
// 4. return true if otp sent valid and vice versa
exports.validateOTP = async (id, OTP) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  if (!user || !user.secret) throw new Error("User secret not created");

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(user.secret),
    label: "GSS",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });

  const isOTPValid = totp.validate({
    token: OTP,
    window: 1,
  });

  return isOTPValid !== null;
};

// app.get("/user/api/v1/get-all", async (req, res) => {
//   const allUsers = await prisma.user.findMany();
//   res.json(allUsers);
// });
