/**
 * Class representing a standardized API response.
 *
 * @class ApiResponse
 * @property {number} code - The HTTP status code.
 * @property {string} type - The type of response, e.g., 'success' or 'error'.
 * @property {string} message - The message describing the result of the request.
 * @property {Object|null} body - The data body of the response, if any.
 */
class ApiResponse {

  /**
   * Creates an instance of ApiResponse.
   *
   * @param {Object} param0 - The parameters for the response.
   * @param {number} param0.code - The HTTP status code.
   * @param {string} param0.type - The response type.
   * @param {string} param0.message - The message for the response.
   * @param {Object|null} param0.body - The response body.
   */
    constructor({ code, type, message, body }) {
        this.code = code;
        this.code = code;
        this.type = type;
        this.message = message;
        this.body = body;
    }

    /**
   * Converts the ApiResponse instance to a plain object.
   *
   * @returns {Object} - The plain object representation of the response.
   */
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