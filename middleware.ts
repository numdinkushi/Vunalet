import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    "/",
    '/products(.*)', // Allow all product routes including /products/[id] and /products/farmer/[id]
    '/categories(.*)',
    '/farmers(.*)',
    '/about',
    '/dashboard', // Allow dashboard access without auth, let component handle it
    '/api/webhook(.*)', // allow Clerk webhooks (no auth info)
    '/api/stablecoin/users', // allow stablecoin user creation
    '/api/stablecoin/activate-pay(.*)', // allow payment activation
    '/api/test-stablecoin(.*)', // allow test API routes for development
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