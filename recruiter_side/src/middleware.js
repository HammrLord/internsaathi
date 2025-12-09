import { withAuth } from "next-auth/middleware";

export default withAuth;

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/candidates/:path*",
        "/jobs/:path*",
        "/interviews/:path*",
        "/analytics/:path*",
        "/settings/:path*",
        "/email-templates/:path*",
        "/schedule/:path*",
        // Add other protected routes here
    ],
};
