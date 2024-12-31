const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const OTPAuth = require("otpauth");

const prisma = new PrismaClient();

app.use(express.json());

app.listen(3000, () => console.log(`Server runnnig on port ${3000}`));

// 1.if user secret not exist for that user throw error
// 2. if user exist then create new totp object by calling TOTP function from OTPAuth library
// 3. generate the token by calling generate() function from the new instance totp created
// 4. return token/otp as result of calling this function
function generateOTP(user) {
  if (!user.secret) {
    throw new Error("User secret not created");
  }

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(user.secret),
    label: "GSS",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });

  const token = totp.generate();
  let seconds = totp.period - (Math.floor(Date.now() / 1000) % totp.period);
  console.log(seconds);
  return token;
}

// 1.if user secret not exist for that user throw error
// 2. if user exist then create new totp object by calling TOTP function from OTPAuth library
// 3. validate the token by calling validate() function from the new instance totp created
// 4. return true if otp sent valid and vice versa
function validateOTP(user, OTP) {
  if (!user.secret) {
    throw new Error("User secret not created");
  }

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
}

app.get("/user/api/v1/get-all", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// 1. create new user using data from requset body.
// 2. generate secret data by creating new secret object using the OTPAuth.Secret() function
// 3. the size of the secret can be change
// 4. after that, assign the generated secret to secret column at the database
app.post("/user/api/v1/create", async (req, res) => {
  const secret = new OTPAuth.Secret({ size: 20 });

  const newUser = await prisma.user.create({
    data: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      secret: secret.base32,
    },
  });

  res.json(newUser);
});

// 1. find the user using the user id given from request body
// 2. pass the user data to geenerateOTP function to generate OTP for that user
app.post("/otp/api/v1/generate", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.body.id,
    },
  });
  res.json(generateOTP(user));
});

// 1. find the user using the user id given from request body
// 2. pass the user data and otp from request body to validateOTP function to validate OTP for that user
app.post("/otp/api/v1/validate", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.body.id,
    },
  });
  res.json(validateOTP(user, req.body.otp));
});
