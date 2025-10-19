import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('ADMIN' | 'CUSTOMER' | 'DESIGNER')[]
  requireAuth?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                         children,
                                                         allowedRoles = ['CUSTOMER', 'ADMIN'],
                                                         requireAuth = true
                                                       }) => {
  const { currentUser, role, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Verifying authentication...</p>
          </div>
        </div>
    )
  }

  // If authentication is not required, render children directly
  if (!requireAuth) {
    return <>{children}</>
  }

  // Redirect to login if no user is authenticated
  if (!currentUser || !role) {
    return (
        <Navigate
            to="/login"
            replace
            state={{
              from: location,
              message: 'Please log in to access this page'
            }}
        />
    )
  }

  // Check if user has required role
  const hasRequiredRole = role && allowedRoles.includes(role)

  // Redirect to unauthorized page or home if user doesn't have required role
  if (!hasRequiredRole) {
    return (
        <Navigate
            to="/unauthorized"
            replace
            state={{
              from: location,
              message: 'You do not have permission to access this page',
              requiredRoles: allowedRoles,
              userRole: role
            }}
        />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute