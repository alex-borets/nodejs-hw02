const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.json({
    email,
    subscription,
  });
};

module.exports = getCurrent;
