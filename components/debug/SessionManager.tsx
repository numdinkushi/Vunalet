'use client';

import { useClearSessions } from '@/hooks/use-clear-sessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export function SessionManager() {
    const {
        isClearing,
        clearCurrentSession,
        clearAllSessions,
        clearSessionById,
        getActiveSessions,
        refreshSession,
        hasActiveSession,
        currentSessionId,
    } = useClearSessions();

    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);

    const loadSessions = async () => {
        setIsLoadingSessions(true);
        try {
            const activeSessions = await getActiveSessions();
            setSessions(activeSessions);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setIsLoadingSessions(false);
        }
    };

    useEffect(() => {
        if (hasActiveSession) {
            loadSessions();
        }
    }, [hasActiveSession]);

    if (!hasActiveSession) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Session Manager</CardTitle>
                    <CardDescription>No active session found</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">Please sign in to manage sessions.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Session Manager</CardTitle>
                <CardDescription>Manage your authentication sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current Session Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Current Session</h3>
                    <div className="text-sm space-y-1">
                        <p><strong>Session ID:</strong> {currentSessionId || 'N/A'}</p>
                        <p><strong>Status:</strong> <Badge variant="default">Active</Badge></p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={clearCurrentSession}
                        disabled={isClearing}
                        variant="outline"
                        size="sm"
                    >
                        {isClearing ? 'Clearing...' : 'Sign Out'}
                    </Button>

                    <Button
                        onClick={clearAllSessions}
                        disabled={isClearing}
                        variant="destructive"
                        size="sm"
                    >
                        {isClearing ? 'Clearing...' : 'Sign Out Everywhere'}
                    </Button>

                    <Button
                        onClick={refreshSession}
                        disabled={isClearing}
                        variant="outline"
                        size="sm"
                    >
                        {isClearing ? 'Refreshing...' : 'Refresh Session'}
                    </Button>

                    <Button
                        onClick={loadSessions}
                        disabled={isLoadingSessions}
                        variant="outline"
                        size="sm"
                    >
                        {isLoadingSessions ? 'Loading...' : 'Reload Sessions'}
                    </Button>
                </div>

                {/* Active Sessions List */}
                {sessions.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">Active Sessions ({sessions.length})</h3>
                        <div className="space-y-2">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-3 border rounded-lg flex items-center justify-between"
                                >
                                    <div className="text-sm">
                                        <p><strong>ID:</strong> {session.id}</p>
                                        <p><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
                                        <p><strong>Last Active:</strong> {new Date(session.lastActiveAt).toLocaleString()}</p>
                                        {session.id === currentSessionId && (
                                            <Badge variant="secondary" className="mt-1">Current</Badge>
                                        )}
                                    </div>
                                    {session.id !== currentSessionId && (
                                        <Button
                                            onClick={() => clearSessionById(session.id)}
                                            disabled={isClearing}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 