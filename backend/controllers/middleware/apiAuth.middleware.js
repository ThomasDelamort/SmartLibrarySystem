// JSON-mode auth guards for the React/API client.
// Unlike the EJS middleware (which redirects or renders 401.ejs),
// these always respond with JSON so the SPA can react to 401/403.

export const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.session.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

// Convenience guards mirroring your existing middleware roles.
export const requireStudent = requireRole("student");
export const requireLibrarian = requireRole("librarian");
export const requireAdmin = requireRole("admin");