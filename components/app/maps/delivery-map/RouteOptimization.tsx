// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

export function RouteOptimization() {
    return (
        <div className="mt-6 bg-green-500/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="text-green-300 font-semibold mb-2">Route Optimization</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-300">Traffic Status</p>
                    <p className="text-green-400 font-semibold">Light Traffic</p>
                </div>
                <div>
                    <p className="text-gray-300">Weather</p>
                    <p className="text-blue-400 font-semibold">Clear</p>
                </div>
            </div>
        </div>
    );
} 