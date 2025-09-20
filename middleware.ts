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
    '/api(.*)', // FIXED: Allow all API routes - they handle their own auth if needed
]);

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

// Match all pages and API routes, but skip Next.js internals and static assets
export const config = {
    matcher: [
        // FIXED: Exclude manifest.json and sw.js from middleware by adding json to exclusion list
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|json|mp4|webm|ogg|mov|avi|mkv)).*)',
        '/(api|trpc)(.*)',
    ],
};
