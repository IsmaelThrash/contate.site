/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let settings = app.settings()

    settings.rateLimits = {
        enabled: true,
        rules: [
            // General API limit - 200 requests per 5 minutes
            {
                label: "/api",
                audience: "",
                duration: 5 * 60, // 5 minutes
                maxRequests: 200
            },
            // Brute force protection for auth attempts - 20 attempts per 5 minutes (guests only)
            {
                label: "*:auth",
                audience: "@guest",  // Only for unauthenticated users
                duration: 5 * 60, // 15 minutes
                maxRequests: 20
            },
            // Password reset - 5 per hour
            {
                label: "POST /api/collections/users/request-password-reset",
                audience: "",
                duration: 60 * 60, // 1 hour
                maxRequests: 5
            },
            // Email verification - 5 per hour
            {
                label: "POST /api/collections/users/request-verification",
                audience: "",
                duration: 60 * 60, // 1 hour
                maxRequests: 5
            },
            // Email change - 3 per hour (authenticated only)
            {
                label: "POST /api/collections/users/request-email-change",
                audience: "@auth",
                duration: 60 * 60, // 1 hour
                maxRequests: 3
            },
            // OTP - 10 per hour
            {
                label: "POST /api/collections/users/request-otp",
                audience: "",
                duration: 60 * 60, // 1 hour
                maxRequests: 10
            }
        ]
    }

    app.save(settings)
})

