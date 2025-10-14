'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Shield, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false)
})

const mfaSchema = z.object({
  mfaCode: z.string().length(6, 'MFA code must be 6 digits').regex(/^\d+$/, 'MFA code must contain only numbers')
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const router = useRouter();

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  // MFA form
  const mfaForm = useForm({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      mfaCode: ''
    }
  })

  const onLoginSubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setShowMFA(true)
      setIsLoading(false)

      // Simulate login failure for demo
      if (data.password === 'wrong') {
        setLoginAttempts(prev => prev + 1)
        throw new Error('Invalid email or password')
      }

      // Success - redirect to dashboard
      console.log('Login successful:', data)
      router.push('/dashboard')

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')

      // Account lockout simulation
      if (loginAttempts >= 4) {
        setError('Account locked due to too many failed attempts. Please contact support.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onMFASubmit = async (data) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate MFA verification
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (data.mfaCode !== '123456') {
        throw new Error('Invalid MFA code')
      }

      // Success - redirect to dashboard
      console.log('MFA verification successful')
      // In real app: router.push('/dashboard')

    } catch (err) {
      setError(err.message || 'MFA verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSO = () => {
    console.log('SSO login initiated')
    // In real app: redirect to SSO provider
  }

  if (showMFA) {
    return (
      <Card className="w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Multi-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>

        <form onSubmit={mfaForm.handleSubmit(onMFASubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="mfaCode">Authentication Code</Label>
              <Input
                id="mfaCode"
                type="text"
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-widest"
                {...mfaForm.register('mfaCode')}
                disabled={isLoading}
              />
              {mfaForm.formState.errors.mfaCode && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {mfaForm.formState.errors.mfaCode.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setShowMFA(false)}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">AS2 Pharmacovigilance Portal</CardTitle>
        <CardDescription>
          Sign in to your account to manage secure file transmissions
        </CardDescription>
      </CardHeader>

      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loginAttempts > 0 && loginAttempts < 5 && (
            <Alert>
              <AlertDescription>
                Warning: {loginAttempts} failed login attempt{loginAttempts > 1 ? 's' : ''}.
                Account will be locked after 5 attempts.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              {...loginForm.register('email')}
              disabled={isLoading}
            />
            {loginForm.formState.errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...loginForm.register('password')}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                {...loginForm.register('rememberMe')}
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || loginAttempts >= 5}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSSO}
            disabled={isLoading}
          >
            Enterprise SSO
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            New organization?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Register here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}