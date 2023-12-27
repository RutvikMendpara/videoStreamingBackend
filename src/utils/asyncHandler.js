const asyncHandler = (func) => async (req, res, next) => {
  try {
    return await func(req, res, next);
  } catch (error) {
    return res.status(error.code || 400).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = asyncHandler;
