export function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(", ")}]`,
            });
            return;
        }
        next();
    };
}
