'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('demo@drivefuel.app')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-white">⛽</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            DriveFuel
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Know your trip before you drive
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-alert-50 dark:bg-alert-900/20 border border-alert-200 dark:border-alert-800 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-alert-600 dark:text-alert-400 flex-shrink-0" />
              <p className="text-sm text-alert-700 dark:text-alert-300">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary btn-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
              📝 Demo Credentials:
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Email: <code className="font-mono">demo@drivefuel.app</code>
              <br />
              Password: <code className="font-mono">password123</code>
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => signIn('google', { redirect: false })}
              className="w-full btn btn-secondary flex justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <text x="0" y="20" fontSize="20" fill="currentColor">
                  G
                </text>
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={() => signIn('github', { redirect: false })}
              className="w-full btn btn-secondary flex justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.273.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.374.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
