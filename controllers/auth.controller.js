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
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Account not found.",
        data: null,
      });
    }
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

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: "Invalid password.",
        data: null,
      });
    }
    delete user.password;

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

exports.register = async (req, res, next) => {
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

    let encryptedPassword = await bcrypt.hash(password, 10);

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

    delete user.password;

    await addNotification("Welcome!", "Your account has been added", user.id);

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

exports.sendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Account not found.",
        data: null,
      });
    }
    if (user.is_verified) {
      return res.status(409).json({
        status: false,
        message: "Account already verified.",
        data: null,
      });
    }

    user.verify = true;

    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: "15m",
    });

    const sendMail = await sendVerifyEmail(user, token);
    return res.status(200).json({
      status: true,
      message: "Mail sent. Please check your email",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    try {
      const decode = jwt.verify(token, JWT_SECRET);

      if (!decode.verify) {
        return res.status(401).json({
          status: false,
          message: "Invalid verify email token.",
          data: null,
        });
      }

      const user = await prisma.user.update({
        where: {
          id: decode.id,
          email: decode.email,
        },
        data: {
          is_verified: true,
        },
      });
      delete user.password;

      const tokenLogin = jwt.sign(user, JWT_SECRET);
      await addNotification("Verify Email", "Verify Email Sukses", decode.id);
      return res.status(200).json({
        status: true,
        message: "Verify Success. You're account is now verified",
        data: {
          user,
          token: tokenLogin,
        },
      });
    } catch (error) {
      console.log(error);
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Email not registered!",
        data: null,
      });
    }

    const token = jwt.sign({ id: user.id, password: user.password }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const sentMail = await sendResetPassword(user, token);

    return res.status(200).json({
      status: true,
      message: "Link reset password has been sent to your email. Please check your email!",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirm } = req.body;

    if (!token || !password || !confirm) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    if (password !== confirm) {
      return res.status(400).json({
        status: false,
        message: "Password doesnt match",
        data: null,
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: false,
          message: "Invalid token",
        });
      }

      let updatePassword = await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashPassword },
      });

      await addNotification("Reset password", "Reset password berhasil", decoded.id);

      return res.status(200).json({
        status: true,
        message: "Password successfull has been reset",
        data: null,
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    // GET ACCESS TOKEN
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // GET GOOGLE DATA USING ACCESS TOKEN
    const googleData = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

    // UPSERT USER DATA IN CASE USER ALREADY EXIST
    const user = await prisma.user.upsert({
      where: {
        email: googleData?.data?.email,
      },
      update: {
        name: googleData?.data?.name,
      },
      create: {
        email: googleData?.data?.email,
        name: googleData?.data?.name,
        password: await bcrypt.hash(googleData?.data?.sub, 10),
        is_verified: true,
        profile: {
          create: {},
        },
      },
    });

    // DELETE USER PASSWORD FROM VARIABLE
    delete user.password;

    // CREATE TOKEN
    const token = jwt.sign(user, JWT_SECRET);

    // RETURN
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
