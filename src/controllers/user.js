const { User } = require('../models');

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
        "_id": "5f18e3c80e5cb76879bd768c",
        "firstName": "Soyeon",
        "lastName": "Jeon",
        "email": "soyeon@cube.com",
        "createdAt": "2020-07-23T01:11:36.416Z",
        "updatedAt": "2020-07-23T01:27:15.894Z",
        "__v": 3
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZTNjODBlNWNiNzY4NzliZDc2OGMiLCJpYXQiOjE1OTU0Njc2MzV9.w2W6mWbsYjZv9DeGkignvBJHsK3GTsMNJsZMe3t_hpM"
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

    return res.send({ user, token });
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
        "_id": "5f18d3e942e2bd44bcf1dd1f",
        "firstName": "Miyeon",
        "lastName": "Cho",
        "email": "miyeon@cube.com",
        "createdAt": "2020-07-23T00:03:53.910Z",
        "updatedAt": "2020-07-23T00:03:53.960Z",
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE4ZDNlOTQyZTJiZDQ0YmNmMWRkMWYiLCJpYXQiOjE1OTU0NjI2MzN9.ksS_P3da-Imj4WfErBK4wiCWZiGlsb2cqYLDv9Ny31E"
}
*/

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
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token,
    );

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
	"firstName": "Minnie",
	"lastName": "Kim",
	"email": "minnie@cube.com"
}

@apiSuccess {Object} user User details
@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
    "user": {
        "_id": "5f18e3c80e5cb76879bd768c",
        "firstName": "Minnie",
        "lastName": "Kim",
        "email": "minnie@cube.com",
        "createdAt": "2020-07-23T01:11:36.416Z",
        "updatedAt": "2020-07-23T01:55:03.615Z",
        "__v": 9
    }
}
*/

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

    return res.send({ user: req.user });
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
        "_id": "5f18d3e942e2bd44bcf1dd1f",
        "firstName": "Miyeon",
        "lastName": "Cho",
        "email": "miyeon@cube.com",
        "createdAt": "2020-07-23T00:03:53.910Z",
        "updatedAt": "2020-07-23T01:59:24.117Z",
        "__v": 4
    }
}
*/

const deleteAccount = async (req, res) => {
  try {
    await req.user.remove();

    res.send({ user: req.user });
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
