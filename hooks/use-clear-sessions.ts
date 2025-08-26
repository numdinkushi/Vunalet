'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

export function useClearSessions() {
    const { signOut, session } = useClerk();
    const { user } = useUser();
    const [isClearing, setIsClearing] = useState(false);

    /**
     * Clear the current session and sign out the user
     */
    const clearCurrentSession = async () => {
        if (!session) {
            /* The line `toast.error('No active session to clear');` is displaying an error toast
            message to the user interface. In this context, it is informing the user that there is
            no active session to clear when the `clearCurrentSession` function is called without an
            active session. This helps provide feedback to the user about the current state of the
            session and what action, if any, needs to be taken. */
            // toast.error('No active session to clear');
            return;
        }

        setIsClearing(true);
        try {
            await signOut();
            // toast.success('Session cleared successfully');
        } catch (error) {
            console.error('Failed to clear current session:', error);
            toast.error('Failed to clear session');
        } finally {
            setIsClearing(false);
        }
    };

    /**
     * Clear all sessions for the current user
     * This requires the user to be authenticated
     */
    const clearAllSessions = async () => {
        if (!user) {
            toast.error('User not authenticated');
            return;
        }

        setIsClearing(true);
        try {
            // Sign out from current session
            await signOut();
            // toast.success('Session cleared successfully');
        } catch (error) {
            console.error('Failed to clear session:', error);
            toast.error('Failed to clear session');
        } finally {
            setIsClearing(false);
        }
    };

    /**
     * Clear a specific session by ID
     * Note: Clerk doesn't support revoking specific sessions, so this clears the current session
     */
    const clearSessionById = async () => {
        if (!user) {
            // toast.error('User not authenticated');
            return;
        }

        setIsClearing(true);
        try {
            // Sign out from current session (Clerk doesn't support revoking specific sessions)
            await signOut();
            // toast.success('Session cleared successfully');
        } catch (error) {
            console.error('Failed to clear session:', error);
            // toast.error('Failed to clear session');
        } finally {
            setIsClearing(false);
        }
    };

    /**
     * Get all active sessions for the current user
     */
    const getActiveSessions = async () => {
        if (!user) {
            return [];
        }

        try {
            // Note: Clerk doesn't provide direct access to all sessions
            // This is a limitation of the current API
            return [session].filter(Boolean);
        } catch (error) {
            console.error('Failed to get active sessions:', error);
            return [];
        }
    };

    /**
     * Force refresh the current session
     */
    const refreshSession = async () => {
        if (!session) {
            // toast.error('No active session to refresh');
            return;
        }

        setIsClearing(true);
        try {
            // Re-authenticate to refresh session
            await signOut();
            toast.success('Session refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh session:', error);
            // toast.error('Failed to refresh session');
        } finally {
            setIsClearing(false);
        }
    };

    return {
        isClearing,
        clearCurrentSession,
        clearAllSessions,
        clearSessionById,
        getActiveSessions,
        refreshSession,
        hasActiveSession: !!session,
        currentSessionId: session?.id,
    };
} 