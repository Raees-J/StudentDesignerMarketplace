import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Shield, Home, LogIn } from 'lucide-react'

const UnauthorizedPage: React.FC = () => {
    const location = useLocation()
    const state = location.state as {
        message?: string
        requiredRoles?: string[]
        userRole?: string
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-6">
                    <Shield size={64} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {state?.message || 'You do not have permission to access this page.'}
                    </p>

                    {state?.requiredRoles && (
                        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Required roles: {state.requiredRoles.join(', ')}
                            </p>
                            {state.userRole && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    Your role: {state.userRole}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="btn btn-secondary flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <Link
                        to="/login"
                        className="btn btn-primary flex items-center justify-center gap-2"
                    >
                        <LogIn size={18} />
                        Login with Different Account
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default UnauthorizedPage