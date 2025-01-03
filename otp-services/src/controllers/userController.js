const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req,res) =>{
    try{
        const newUser = await userService.createUser(req.body)
        res.json(newUser)
    }catch(error){
        res.status(500).json({message: error.message})
    }
}
