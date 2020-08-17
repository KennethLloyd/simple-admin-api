const formatUser = (raw) => {
  const user = raw.dataValues;
  delete user.password;
  delete user.tokens;

  return user;
};

module.exports = {
  formatUser,
};
