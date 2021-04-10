// extend default Errors class

class WaveServerExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

// Not Found error
class NotFoundError extends WaveServerExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// Unauthorized user error
class UnauthorizedError extends WaveServerExpressError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// class BadRequestError
class BadRequestError extends WaveServerExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// Forbidden Error
class ForbiddenError extends WaveServerExpressError {
  constructor(message = "Bad Request") {
    super(message, 403);
  }
}

module.exports = {
  WaveServerExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
};
