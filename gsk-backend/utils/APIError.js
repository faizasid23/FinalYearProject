class APIError extends Error {
	constructor(message, statusCode, errors) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Server Error';
		//  this is to show errors on front-end validation fields
		this.errors = errors ;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = APIError;