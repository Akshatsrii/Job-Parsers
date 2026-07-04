export default class ResponseHelper {
  static success(res, data, message = "Operation successful", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message = "An error occurred", statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
