const hrmsService = require("../services/hrms.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getFileFromS3 } = require("../config/aws");

// Login function
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(200).json({ success: false, message: "Please provide Email" });
    }

    if (!password) {
      return res.status(200).json({ success: false, message: "Please provide Password" });
    }

    const query = {
        company_email: email
    }
    
    // 1. Find employee by email
    const user = await hrmsService.findOneEmployee(query)
    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    // 2. Check password
    if (user.password !== password) {
      return res.status(200).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(200).json({ success: false, message: "Your account is inactive. Please contact the administrator." });
    }

    const roleQuery = {
        _id: user.role_id
    }
    const userRole = await hrmsService.findOneRole(roleQuery)
    // 3. Create JWT token
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.company_email, 
        role: userRole?.role_slug 
      },
      process.env.JWT_SECRET || "hrms@naga",
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id:  user._id,
        full_name: user.first_name + ' ' + user.last_name,
        email: user.company_email,
        token,
        role: userRole?.role_slug
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function logout(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "logout successful",
    });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function festivaLeaves(req, res) {
  try {
    const festivaLeavesResult = await hrmsService.getAllFestivalLeaves();
    
    res.status(200).json({
      success: true,
      data: festivaLeavesResult,
      message: "All Festival leaves fetched successfully..!",
    });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function addFestivaLeaves(req, res) {
  try {
    const festivaLeaves = req.body.festivaLeaves;

    if(!festivaLeaves || festivaLeaves.length == 0){
      res.status(400).json({
      success: false,
      message: "please add leaves",
      });
    }

    const result = await hrmsService.insertFestivalLeaves(festivaLeaves);

  // return await newFestivalLeave.save();
    return res.status(200).json({
      success: true,
      data: result,
      message: "All Festival leaves Added successfully..!",
    });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function addMenus(req, res) {
  try {
    const menus = req.body.menus;
    const result = await hrmsService.insertMenus(menus);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "All Menus Added successfully..!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getMenus(req, res) {
  try {
    // const category = req.body.category;
    const query = {
      // category: category
      is_active: true
    }
    const result = await hrmsService.getMenus(query);
    
    return res.status(200).json({
      success: true,
      message: "All Menus Added successfully..!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Download
async function getDocuments(req, res) {
 try {
    // req.params[0] will contain everything after /file/
    // const key = req.params[0]; 
    const key = req.query.key; 

    const fileStream = await getFileFromS3(key);
    if (!fileStream) {
      return res.status(404).json({ message: "File not found" });
    }

    fileStream.pipe(res);
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ message: "Error retrieving file" });
  }
};

// Export at the bottom
module.exports = {
  login,
  logout,
  festivaLeaves,
  addMenus,
  getMenus,
  addFestivaLeaves,
  getDocuments,
};
