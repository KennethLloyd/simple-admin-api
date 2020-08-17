const { User } = require('../models');
const { formatUser } = require('../helpers/utils');

/**
@api {post} /users/login Log In User
@apiVersion 1.0.0
@apiName LogIn
@apiGroup User

@apiParamExample {json} Request-Example:
{
	 "email": "soyeon@cube.com",
	 "password": "12345aA!"
}

@apiSuccess {Object} user User details
@apiSuccess {String} token Auth token
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "user": {
        "id": "89193b8f-a62f-4d31-9e47-cb44b2dd3f5f",
        "firstName": "Soyeon",
        "lastName": "Jeon",
        "email": "soyeon@cube.com",
        "createdAt": "2020-08-15T11:55:57.000Z",
        "updatedAt": "2020-08-15T12:06:08.595Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg5MTkzYjhmLWE2MmYtNGQzMS05ZTQ3LWNiNDRiMmRkM2Y1ZiIsImlhdCI6MTU5NzQ5MzE2OH0.Kj6zdkvhD0_7Bb9dvnJr9oK3pu5mbO-_4JokBQC9BlU"
}
*/

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

    return res.send({ user: formatUser(user), token });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

/**
@api {post} /users Register User
@apiVersion 1.0.0
@apiName Register
@apiGroup User

@apiParamExample {json} Request-Example:
{
  "firstName": "Miyeon",
  "lastName": "Cho",
  "email": "miyeon@cube.com",
  "password": "12345aA!"
}

@apiSuccess {Object} user User details
@apiSuccess {String} token Auth token
@apiSuccessExample {json} Success-Response:
HTTP/1.1 201 Created
{
    "user": {
        "id": "218c2c56-0035-4819-bebb-ec9c11afb447",
        "firstName": "Miyeon",
        "lastName": "Cho",
        "email": "miyeon@cube.com",
        "updatedAt": "2020-08-15T12:08:14.989Z",
        "createdAt": "2020-08-15T12:08:14.963Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIxOGMyYzU2LTAwMzUtNDgxOS1iZWJiLWVjOWMxMWFmYjQ0NyIsImlhdCI6MTU5NzQ5MzI5NH0.6Zb9UbuQGJiqxiuXTm-31Q1KqqgNIOzYjQtUNMh1IyM"
}
*/

const signUp = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const newUser = new User(req.body);

    await newUser.save();

    const token = await newUser.generateAuthToken();

    return res.status(201).send({ user: formatUser(newUser), token });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

/**
@api {post} /users/logout Log out User
@apiVersion 1.0.0
@apiName LogOut
@apiGroup User

@apiHeaderExample {json} Header-Example:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZTNjODBlNWNiNzY4NzliZDc2OGMiLCJpYXQiOjE1OTU0NjY2OTZ9.zCJOK_0xANZ917ebDGH3G5oFGMp0OH-Kt5cwWIOyztM"
}

@apiSuccess {String} message Log out message
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "message": "Logged out successfully!"
}
*/

const logOut = async (req, res) => {
  try {
    // remove the current token from the list of tokens to avoid logging out in other devices
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);

    await req.user.save();

    res.send({ message: 'Logged out successfully!' });
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

/** 
@api {post} /users/logoutAll Log out User on all devices
@apiVersion 1.0.0
@apiName LogOutAllDevices
@apiGroup User

@apiHeaderExample {json} Header-Example:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZTNjODBlNWNiNzY4NzliZDc2OGMiLCJpYXQiOjE1OTU0NjY2OTZ9.zCJOK_0xANZ917ebDGH3G5oFGMp0OH-Kt5cwWIOyztM"
}

@apiSuccess {String} message Log out message
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "message": "Logged out all devices successfully!"
}
*/

const logOutAllDevices = async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send({ message: 'Logged out all devices successfully!' });
  } catch (e) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

/**
@api {patch} /users/me Update Own Profile
@apiVersion 1.0.0
@apiName UpdateProfile
@apiGroup User

@apiHeaderExample {json} Header-Example:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZTNjODBlNWNiNzY4NzliZDc2OGMiLCJpYXQiOjE1OTU0NjY2OTZ9.zCJOK_0xANZ917ebDGH3G5oFGMp0OH-Kt5cwWIOyztM"
}

@apiParamExample {json} Request-Example:
{
	"firstName": "Nicha",
	"lastName": "Yontararak"
}

@apiSuccess {Object} user User details
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "user": {
        "id": "8363ef66-2e60-4991-8f80-1a4e05b03548",
        "firstName": "Nicha",
        "lastName": "Yontararak",
        "email": "minnie@cube.com",
        "createdAt": "2020-08-17T11:15:19.000Z",
        "updatedAt": "2020-08-17T11:19:26.306Z"
    }
}
*/

const editProfile = async (req, res) => {
  const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  ); // only returns true if all conditions are satisfied

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    updates.map((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    return res.send({ user: formatUser(req.user) });
  } catch (e) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};

/**
@api {delete} /users/me Delete Own Account
@apiVersion 1.0.0
@apiName DeleteProfile
@apiGroup User

@apiHeaderExample {json} Header-Example:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZTNjODBlNWNiNzY4NzliZDc2OGMiLCJpYXQiOjE1OTU0NjY2OTZ9.zCJOK_0xANZ917ebDGH3G5oFGMp0OH-Kt5cwWIOyztM"
}

@apiSuccess {Object} user User details
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "user": {
        "id": "3b42c1cd-7a6a-4f3f-8922-d8ae68a9bf10",
        "firstName": "Yuqi",
        "lastName": "Song",
        "email": "yuqi@cube.com",
        "createdAt": "2020-07-23T00:03:53.910Z",
        "updatedAt": "2020-07-23T01:59:24.117Z",
    }
}
*/

const deleteAccount = async (req, res) => {
  try {
    await req.user.destroy();

    res.send({ user: formatUser(req.user) });
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
