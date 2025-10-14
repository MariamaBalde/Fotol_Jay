export function ValidateRequest(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            console.log('Validation error:', error.errors);
            return res.status(400).json({
                error: 'Validation échouée',
                details: error.errors,
            });
        }
    };
}
//# sourceMappingURL=ValidationMiddleware.js.map