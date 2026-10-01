import { ZodError } from "zod";
export function validateBody(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: "Validation failed",
                    details: error.errors.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(400).json({ error: "Malformed request payload" });
        }
    };
}
