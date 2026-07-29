import Student from "../models/student.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&.#])[A-Za-z\d@$!%?&.#]{8,}$/;

const register = async (req, res) => {
  try {
    const { name, email, password, course, skills, role } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Please provide name",
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "Please provide email",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }
    const existEmail = await Student.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "please provide password",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      course,
      skills,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully!",
      data: student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to register student.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please provide email",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }
    const existUser = await Student.findOne({ email });
    if (!existUser) {
      return res.status(404).json({
        message: "User not found...Register first",
      });
    }
    let comparePassword = await bcrypt.compare(password, existUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }
    let token = jwt.sign(
      { email: email, id: existUser._id },
      "this is a secret key",
      { expiresIn: "2d" }
    );

    return res.status(200).json({
      success: true,
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let students = await Student.find();
    if (students.length == 0) {
      return res.status(404).json({
        message: "No data found",
      });
    }
    console.log(`No of registered students ${students.length}`);
    return res.status(200).json({
      success: true,
      message: "Received all students",
      students: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: " This ID is not found",
      });
    }
    return res.status(201).json({
      success: true,
      message: "user updated successfully",
      student: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
   
    if(!student){
        return res.status(400).json({
            success:false,
            message:"Not found"
        })
    }
    return res.status(204).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findUsersById = async (req, res) => {
  try {
    console.log("it is running");
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "No user found by this ID",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student found successfully",
      student: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export { register, login, getAllUsers, deleteUser, updateUser, findUsersById };