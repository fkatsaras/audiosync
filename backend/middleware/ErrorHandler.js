class ErrorHandler {
    static createError(code, message) {
        return { code, message };
    }

    static handle(error) {
        if (error.code) {
            return { message: error.message, code: error.code };    // Propagate specific expected error
        }
        console.error("Unexpected error:", error.message);
        return { message: "Internal Server Error", code: 500 };     // Generate generic unexpected error
    }
}

module.exports = ErrorHandler;