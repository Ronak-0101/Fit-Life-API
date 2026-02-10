const responseFormatter = (req, res, next) => {
    const originalSend =    res.send;

    res.send = function(data) {
        if (typeof data === 'object' && !data.success !== undefined) {
            data = {
                success: res.statusCode >= 200 && res.statusCode < 300,
                ...data,
            };
        }
        originalSend.call(this, data);
    };
    next();
}

module.exports = responseFormatter;
