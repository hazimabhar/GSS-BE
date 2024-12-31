const otpService = require("../services/otpService");

exports.generateOTP = async (req, res) => {
  try {
    const otp = await otpService.generateOTP(req.bod.id);
    res.json(otp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateOTP = async (req,res) =>{
    try{
        const isValid = await otpService.validateOTP(req.body.id, req.body.otp)
        res.json(isValid)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
