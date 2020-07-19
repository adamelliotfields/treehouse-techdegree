function getUser(req, res) {
  // We store the entire user object on req.user, so we don't need to make another database call.
  const { id, emailAddress, firstName, lastName } = req.user;

  return res.status(200).json({ id, emailAddress, firstName, lastName });
}

module.exports = getUser;
