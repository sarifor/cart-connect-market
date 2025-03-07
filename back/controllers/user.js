const userTest = (req, res, next) => {
  try {
    res.status(200).json([{"value": "ok"}]);
    console.log("ok")
  } catch (error) {
    console.log(error);
  }
};

module.exports = { userTest };