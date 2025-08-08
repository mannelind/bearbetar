'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loading'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/auth'
import { APP_NAME, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Check if email is admin before sending magic link
      if (!isAdminEmail(data.email)) {
        throw new Error(ERROR_MESSAGES.emailNotAdmin)
      }

      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`,
        },
      })

      if (signInError) {
        throw signInError
      }

      setSuccess(true)
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Ett oväntat fel inträffade')
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorParam: string) => {
    switch (errorParam) {
      case 'unauthorized':
        return ERROR_MESSAGES.unauthorized
      case 'auth_error':
        return 'Inloggningsfel. Försök igen.'
      case 'no_email':
        return 'Ingen e-post kunde verifieras.'
      case 'server_error':
        return ERROR_MESSAGES.serverError
      default:
        return ERROR_MESSAGES.serverError
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">E-post skickat!</CardTitle>
            <CardDescription>
              {SUCCESS_MESSAGES.loginEmailSent}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Vi har skickat en säker inloggningslänk till <strong>{form.getValues('email')}</strong>. 
                Klicka på länken i e-posten för att logga in.
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">
              Kontrollera även din skräppost om du inte ser e-posten inom några minuter.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSuccess(false)
                form.reset()
              }}
            >
              Skicka ny länk
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{APP_NAME} Admin</CardTitle>
          <CardDescription>
            Logga in med din godkända e-postadress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Show URL parameter errors */}
          {errorParam && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(errorParam)}
              </AlertDescription>
            </Alert>
          )}

          {/* Show form errors */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-postadress</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@bearbetar.se"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Skickar länk...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Skicka inloggningslänk
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Endast godkända administratörer kan logga in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}