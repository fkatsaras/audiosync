class ApiResponse {
    constructor({ code, type, message, body }) {
        this.code = code;
        this.code = code;
        this.type = type;
        this.message = message;
        this.body = body;
    }

    // Method to convert the response object to a plain JavaScript object
    toObject() {
      return {
        code: this.code,
        type: this.type,
        message: this.message,
        body: this.body,
      };
    }
}

module.exports = ApiResponse;