export const authConfig = {
    // JWT configuration
    jwt: {
        accessTokenSecret: process.env["JWT_SECRET_ACCESS_TOKEN"],
        refreshTokenSecret: process.env["JWT_SECRET_REFRESH_TOKEN"],
        passwordResetTokenSecret: process.env["JWT_SECRET_PASSWORD_RESET_TOKEN"],
    },    
};