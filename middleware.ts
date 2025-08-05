import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    "/",
    '/products',
    '/categories(.*)',
    '/farmers',
    '/about',
    '/api/webhook(.*)', // allow Clerk webhooks (no auth info)
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

// Match all pages and API routes, but skip Next.js internals and static assets
export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg|mov|avi|mkv)).*)',
        '/(api|trpc)(.*)',
    ],
}; 