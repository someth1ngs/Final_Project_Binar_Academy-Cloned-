const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerifyEmail, sendResetPassword } = require("../libs/nodemailer");
const { addNotification } = require("../libs/notification");
const { default: axios } = require("axios");
const { JWT_SECRET } = process.env;

exports.getUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        is_verified: true,
        role: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Successfully get users data",
      data: {
        users: users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    const duplicate = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: "Email already used",
        data: null,
      });
    }

    const response = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: {
            image: "http://url.com",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    delete response.password;

    return res.status(201).json({
      status: true,
      message: "Successfully created account",
      data: {
        user: response,
      },
    });
  } catch (error) {
    next(error);
  }
};

// function login
exports.login = async (req, res, next) => {
  try {
    // Destructures 'email' and 'password' from the request body
    let { email, password } = req.body;

    // Checks if 'email' or 'password' is missing, returns a 400 response if true
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Finds the first user with the given 'email'
    let user = await prisma.user.findFirst({ where: { email } });

    // Checks if the user is not found, returns a 404 response if true
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Account not found.",
        data: null,
      });
    }

    // Checks if the user's account is not verified, returns a 401 response if true
    if (!user.is_verified) {
      delete user.password;
      return res.status(401).json({
        status: false,
        message: "Account is not verified yet.",
        data: {
          user,
        },
      });
    }

    // Checks if the user's password is empty but the account is verified, returns a 400 response if true
    if (user.password === "" && user.is_verified === true) {
      return res.status(400).json({
        status: false,
        message: "It seems you logged in using Google Login.",
        data: null,
      });
    }

    // Compares the provided password with the stored hashed password
    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Checks if the password is incorrect, returns a 400 response if true
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: "Invalid password.",
        data: null,
      });
    }
    // Deletes the password from the user object before returning it
    delete user.password;

    // Signs a JWT token with the user data
    let token = jwt.sign(user, JWT_SECRET);
    return res.status(200).json({
      status: true,
      message: "User logged in success",
      data: { ...user, token },
    });
  } catch (error) {
    next(error);
  }
};

// function register
exports.register = async (req, res, next) => {
  try {
    // Destructures 'name', 'email', and 'password' from the request body
    const { name, email, password } = req.body;

    // Checks if 'name', 'email', or 'password' is missing, returns a 400 response if true
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Checks for duplicate email in the database
    const duplicate = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If a duplicate email is found, returns a 409 response
    if (duplicate) {
      return res.status(409).json({
        status: false,
        message: "Email already used",
        data: null,
      });
    }

    // Hashes the password using bcrypt with a salt round of 10
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Creates a new user in the database with the provided data
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        profile: {
          create: {},
        },
      },
      include: true,
    });

    // Deletes the password from the user object before returning it
    delete user.password;

    // Adds a notification for the new user
    await addNotification("Welcome!", "Your account has been added", user.id);

    // Sends a successful response with status 201 and the created user data
    return res.status(201).json({
      status: true,
      message: "Successfully created account",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// function sendVerify
exports.sendVerify = async (req, res, next) => {
  try {
    // Destructures 'email' from the request body
    const { email } = req.body;

    // Finds the user with the given email in the database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Checks if the user is not found, returns a 404 response if true
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Account not found.",
        data: null,
      });
    }

    // Checks if the user's account is already verified, returns a 409 response if true
    if (user.is_verified) {
      return res.status(409).json({
        status: false,
        message: "Account already verified.",
        data: null,
      });
    }

    // Sets the user's 'verify' property to true
    user.verify = true;

    // Signs a JWT token with the user data, valid for 15 minutes
    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: "15m",
    });

    try {
      // Attempts to send a verification email to the user with the token
      const sendMail = await sendVerifyEmail(user, token);
    } catch (error) {
      // If sending the email fails, returns a 400 response
      return res.status(400).json({
        status: false,
        message: "Email feature is not active",
        data: null,
      });
    }

    // Sends a successful response with status 200 and the token
    return res.status(200).json({
      status: true,
      message: "Mail sent. Please check your email",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// function verifyEmail
exports.verifyEmail = async (req, res, next) => {
  try {
    // Destructures 'token' from the request parameters
    const { token } = req.params;

    try {
      // Verifies the token using the JWT_SECRET
      const decode = jwt.verify(token, JWT_SECRET);

      // Checks if the decoded token does not have the 'verify' property, returns a 401 response
      if (!decode.verify) {
        return res.status(401).json({
          status: false,
          message: "Invalid verify email token.",
          data: null,
        });
      }

      // Updates the user to set 'is_verified' to true in the database
      const user = await prisma.user.update({
        where: {
          id: decode.id,
          email: decode.email,
        },
        data: {
          is_verified: true,
        },
      });
      // Deletes the password from the user object before returning it
      delete user.password;

      // Signs a new JWT token for the user
      const tokenLogin = jwt.sign(user, JWT_SECRET);

      // Adds a notification about successful email verification
      await addNotification("Verify Email", "Verify Email successfully.", decode.id);

      // Sends a successful response with status 200, the verified user data, and the new token
      return res.status(200).json({
        status: true,
        message: "Verify Success. Your account is now verified",
        data: {
          user,
          token: tokenLogin,
        },
      });
    } catch (error) {
      console.log(error);
      // If the token verification fails, returns a 401 response
      return res.status(401).json({
        status: false,
        message: "Invalid token",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

// function forgotPassword
exports.forgotPassword = async (req, res, next) => {
  try {
    // Destructures 'email' from the request body
    const { email } = req.body;

    // Checks if 'email' is missing, returns a 400 response if true
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Finds the user with the given email in the database
    let user = await prisma.user.findUnique({ where: { email } });

    // Checks if the user is not found, returns a 404 response if true
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Email not registered!",
        data: null,
      });
    }

    // Signs a JWT token with the user id and password, valid for 15 minutes
    const token = jwt.sign({ id: user.id, password: user.password }, JWT_SECRET, {
      expiresIn: "15m",
    });

    try {
      // Attempts to send a reset password email to the user with the token
      const sentMail = await sendResetPassword(user, token);
    } catch (error) {
      // If sending the email fails, returns a 400 response
      return res.status(400).json({
        status: false,
        message: "Email feature is not active",
        data: null,
      });
    }

    // Sends a successful response with status 200 and the token
    return res.status(200).json({
      status: true,
      message: "Link reset password has been sent to your email. Please check your email!",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

// function resetPassword
exports.resetPassword = async (req, res, next) => {
  try {
    // Destructures 'token' from the request parameters
    const { token } = req.params;
    // Destructures 'password' and 'confirm' from the request body
    const { password, confirm } = req.body;

    // Checks if any of the required fields are missing, returns a 400 response if true
    if (!token || !password || !confirm) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Checks if 'password' and 'confirm' do not match, returns a 400 response if true
    if (password !== confirm) {
      return res.status(400).json({
        status: false,
        message: "Password doesn't match",
        data: null,
      });
    }

    // Hashes the new password using bcrypt
    let hashPassword = await bcrypt.hash(password, 10);

    try {
      // Verifies the token using the JWT_SECRET
      let decoded = jwt.verify(token, JWT_SECRET);

      // Updates the user's password in the database with the hashed password
      let updatePassword = await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashPassword },
      });

      // Adds a notification about the successful password reset
      await addNotification("Reset password", "Reset password has been successfully", decoded.id);
    } catch (error) {
      // If the token verification fails, returns a 403 response
      return res.status(403).json({
        status: false,
        message: "Invalid token",
        data: null,
      });
    }

    // Sends a successful response with status 200
    return res.status(200).json({
      status: true,
      message: "Password successfully has been reset",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// function login oauth
exports.googleLogin = async (req, res, next) => {
  try {
    // Destructures 'access_token' from the request body
    const { access_token } = req.body;

    // Checks if 'access_token' is missing, returns a 400 response if true
    if (!access_token) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Gets Google user data using the access token
    const googleData = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

    // Upserts user data in case the user already exists in the database
    const user = await prisma.user.upsert({
      where: {
        email: googleData?.data?.email, // Uses the email from the Google data as a unique identifier
      },
      update: {
        name: googleData?.data?.name, // Updates the user's name if they already exist
      },
      create: {
        email: googleData?.data?.email, // Creates a new user with the email from Google data
        name: googleData?.data?.name, // Sets the user's name from Google data
        password: "", // Sets an empty password since it's a Google login
        is_verified: true, // Marks the user as verified
        profile: {
          create: {}, // Creates an empty profile associated with the user
        },
      },
    });

    // Deletes the user's password from the user object for security reasons
    delete user.password;

    // Creates a JWT token for the user
    const token = jwt.sign(user, JWT_SECRET);

    // Returns a successful response with the user data and token
    return res.status(200).json({
      status: true,
      message: "Successfully login with Google",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// function ubah password
exports.changePassword = async (req, res, next) => {
  try {
    // Gets the user ID from the request's user data
    const user_id = req.user_data.id;
    const { password, confirm } = req.body;

    // Checks if user_id is missing, returns a 403 response if true
    if (!user_id) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to change this user's password",
        data: null,
      });
    }

    // Checks if password or confirm fields are missing, returns a 400 response if true
    if (!password || !confirm) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Checks if password and confirm fields do not match, returns a 400 response if true
    if (password !== confirm) {
      return res.status(400).json({
        status: false,
        message: "Password doesn't match",
        data: null,
      });
    }

    // Hashes the new password using bcrypt
    let hashPassword = await bcrypt.hash(password, 10);
    // Updates the user's password in the database
    let changePassword = await prisma.user.update({
      where: { id: user_id },
      data: { password: hashPassword },
    });

    // Adds a notification for the password change
    await addNotification("Change password", "Password has been successfully changed.", user_id);

    // Returns a successful response
    return res.status(200).json({
      status: true,
      message: "Password successfully changed",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

