const { User } = require('../models');

const logIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );

    if (user === null) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = await user.generateAuthToken();

    return res.send({ user, token });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const signUp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();

    if (user) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const newUser = new User(req.body);

    await newUser.save();
    const token = await newUser.generateAuthToken();

    return res.status(201).send({ user: newUser, token });
  } catch (e) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const logOut = async (req, res) => {
  try {
    // remove the current token from the list of tokens to avoid logging out in other devices
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token,
    );

    await req.user.save();

    res.send({ message: 'Logged out' });
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const logOutAllDevices = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send({ message: 'Logged out on on all devices' });
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const editProfile = async (req, res) => {
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    updates.map((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    return res.send(req.user);
  } catch (e) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: 'Internal Server Error' });
  }
};

module.exports = {
  logIn,
  signUp,
  logOut,
  logOutAllDevices,
  editProfile,
  deleteAccount,
};
