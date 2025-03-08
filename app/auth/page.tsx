'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { AuthError } from '@/types/auth'
import { 
  userRegistrationSchema, 
  userLoginSchema, 
  adminLoginSchema,
  FormData
} from '@/types/auth'
import { registerUser, loginUser, loginAdmin, verifyAdminSetup } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { resetRateLimit } from '@/lib/rate-limit'

type FormMode = 'USER_REGISTER' | 'USER_LOGIN' | 'ADMIN_LOGIN'

export default function AuthPage() {
  const [formMode, setFormMode] = useState<FormMode>('USER_LOGIN')
  const [loading, setLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(
      formMode === 'USER_REGISTER' ? userRegistrationSchema :
      formMode === 'USER_LOGIN' ? userLoginSchema :
      adminLoginSchema
    ),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      registrationNumber: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  // Reset form when switching modes
  useEffect(() => {
    reset()
  }, [formMode, reset])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true)

    try {
      if (formMode === 'USER_REGISTER') {
        try {
          // Use fetch directly for user registration
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: data.fullName,
              email: data.email,
              password: data.password,
              phone: data.phone
            }),
          });

          // Get response data whether successful or not
          const responseData = await response.json();
          console.log('Registration response:', response.status, responseData);

          // Check if there's an error in the response
          if (!response.ok) {
            // Check specifically for user exists error - either in message or code
            if (responseData.error && 
                (responseData.error.includes('already registered') || 
                 responseData.error.includes('already exists') ||
                 responseData.error.includes('Email already registered') ||
                 responseData.code === 'user_already_exists')) {
              
              // Show specialized user exists error with login option
              toast({
                title: 'Email Already Registered',
                description: (
                  <div className="flex flex-col gap-2">
                    <p>This email address is already in use. Please sign in instead.</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormMode('USER_LOGIN');
                        reset({ 
                          email: data.email, 
                          password: '',
                          fullName: '',
                          phone: '',
                          registrationNumber: ''
                        });
                      }}
                      className="mt-2"
                    >
                      Go to Login
                    </Button>
                  </div>
                ),
                variant: 'destructive',
                duration: 5000,
              });
              return; // Early return to prevent further error handling
            }
            
            throw new Error(responseData.error || 'Registration failed. Please try again.');
          }

          const result = await response.json();
          
          // Set registration success state
          setRegistrationSuccess(true);
          setRegisteredEmail(data.email as string);
          
          toast({
            title: 'Account created successfully',
            description: 'Please check your email to confirm your account.'
          });

          // Switch to login mode after registration but with a delay
          setTimeout(() => {
            setFormMode('USER_LOGIN');
            // Reset the form after switching
            reset({ 
              email: data.email, // Pre-fill email for convenience
              password: '',
              fullName: '',
              phone: '',
              registrationNumber: ''
            });
          }, 2000);
          
        } catch (error: any) {
          console.error('Registration error:', error);
          
          // Check if it's a "User already registered" error
          if (error.message && error.message.includes('already registered')) {
            // Save the email for convenience
            const emailToLogin = data.email;
            
            // Show a prominent error with action button
            toast({
              title: 'Account Already Exists',
              description: (
                <div className="flex flex-col gap-2">
                  <p>This email is already registered. Please sign in instead.</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormMode('USER_LOGIN');
                      reset({ 
                        email: emailToLogin,
                        password: '',
                        fullName: '',
                        phone: '',
                        registrationNumber: ''
                      });
                    }}
                    className="mt-2"
                  >
                    Go to Login
                  </Button>
                </div>
              ),
              variant: 'destructive',
              duration: 5000,
            });
          } else {
            // Regular error toast for other errors
            toast({
              title: 'Registration failed',
              description: error.message || 'Unable to create account. Please try again.',
              variant: 'destructive'
            });
          }
        }
      }
      else if (formMode === 'USER_LOGIN') {
        try {
          // First try regular login
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password
            }),
          });

          if (response.ok) {
            const result = await response.json();
            toast({
              title: 'Login successful',
              description: 'Redirecting to homepage...'
            });

            // Wait for cookies to be set
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Use the redirectUrl from the response or default to homepage
            router.push(result.redirectUrl || '/');
            return;
          }
          
          // Normal flow without debug logging
          if (response.status === 503) {
            const errorData = await response.json();
            // Show connection error with retry option
            toast({
              title: 'Connection issue',
              description: 'Unable to connect to the server. Trying emergency login...',
              variant: 'destructive'
            });
            
            // Try emergency login as fallback
            try {
              const emergencyResponse = await fetch('/api/auth/emergency-login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: data.email,
                  password: data.password
                }),
              });
              
              if (emergencyResponse.ok) {
                const emergencyResult = await emergencyResponse.json();
                  toast({
                  title: 'Emergency login successful',
                  description: 'Logging you in with limited functionality until server connection is restored.',
                });
                
                // Wait for cookies to be set
                await new Promise(resolve => setTimeout(resolve, 800));
                
                router.push(emergencyResult.redirectUrl || '/');
                return;
              } else {
                // If emergency login also fails, show appropriate error
                const emergencyErrorData = await emergencyResponse.json();
                throw new Error(emergencyErrorData.error || 'Both standard and emergency login failed.');
              }
            } catch (emergencyError: any) {
              console.error('Emergency login error:', emergencyError);
              throw new Error('Connection issues prevent login. Please try again later.');
            }
          }
          
          // For other errors, parse and show the message
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed. Please check your credentials.');
        } catch (error: any) {
          console.error('Login error:', error);
          toast({
            title: 'Login failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive'
          });
        }
      }
      else if (formMode === 'ADMIN_LOGIN') {
        try {
          // Use fetch directly for admin login to handle our custom cookie-based auth
          const response = await fetch('/api/auth/admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              registrationNumber: data.registrationNumber,
              password: data.password
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new AuthError('INVALID_CREDENTIALS', errorData.error || 'Invalid admin credentials');
          }

          const result = await response.json();
            toast({
            title: 'Admin login successful',
            description: 'Redirecting to admin dashboard...'
          });

          // Wait for cookies to be set
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Use the redirectUrl from the response or default to /admin
          router.push(result.redirectUrl || '/admin');
        } catch (error: any) {
          console.error('Admin login error:', error);
            toast({
            title: 'Login failed',
            description: error.message || 'Invalid admin credentials',
            variant: 'destructive'
          });
        }
      }
    } catch (error: any) {
        console.error('Auth error:', error)
        toast({
          title: 'Error',
        description: error.message || 'Authentication failed',
        variant: 'destructive'
        })
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (mode: FormMode) => {
    setFormMode(mode)
    reset()
    setRegistrationSuccess(false)
  }

  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
      const result = await verifyAdminSetup();
        
        // Only show critical errors, not policy recursion errors
        if (!result.exists && !result.error?.includes('recursion') && !result.error?.includes('bypassed')) {
        console.error('Admin setup error:', result.error);
        toast({
          variant: 'destructive',
          title: 'Admin Setup Error',
            description: 'There was an issue with the admin configuration.'
        });
        } else if (!result.hasPermissions && !result.error?.includes('recursion') && !result.error?.includes('bypassed')) {
        console.error('Admin permissions error:', result.error);
        toast({
          variant: 'destructive',
          title: 'Admin Permissions Error',
            description: 'Admin account lacks necessary database permissions.'
          });
        }
      } catch (error) {
        // Silently log the error but don't disrupt the user experience
        console.error('Error checking admin setup:', error);
      }
    };

    // Only check admin setup when in admin login mode
    if (formMode === 'ADMIN_LOGIN') {
      checkAdminSetup();
    }
  }, [formMode, toast]);

  return (
    <div className="container relative h-[100vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-600" />
        {/* Background Elements for visual interest */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[10%] -top-[40%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo className="mr-2 h-6 w-6" />
          <span>Tuition Rider</span>
        </div>
        
        {/* Enhanced left panel content */}
        <div className="relative z-20 mt-12 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">Experience Personalized Learning</h2>
              <p className="text-white/80 leading-relaxed">
                Join our community of dedicated tutors and eager students. We connect you with the right 
                educational resources tailored to your specific needs.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Expert Tutors</h3>
                  <p className="text-sm text-white/70">Qualified professionals with proven expertise</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Flexible Schedule</h3>
                  <p className="text-sm text-white/70">Learn at your own pace on your own time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Personalized Approach</h3>
                  <p className="text-sm text-white/70">Customized learning plans for better results</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                {formMode === 'ADMIN_LOGIN' ? 
                  "Admin portal for managing tuition services and user accounts." :
                  "Connect with qualified tutors and manage your learning journey."}
              </p>
              <div className="h-1 w-12 bg-white/40 rounded-full mt-2"></div>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="lg:p-8 bg-gradient-to-b from-blue-50 via-white to-emerald-50/30 overflow-y-auto h-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] py-8">
          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800">Registration Successful!</h3>
              <p className="mt-2 text-sm text-green-600">
                Your account has been created successfully.
                {registeredEmail && (
                  <span className="block mt-1 font-medium">{registeredEmail}</span>
                )}
              </p>
              <p className="mt-3 text-xs text-green-500">Redirecting to login page...</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
              {formMode === 'USER_REGISTER' ? 'Create an account' :
               formMode === 'USER_LOGIN' ? 'Welcome back' :
               'Admin Login'}
            </h1>
            <p className="text-sm text-slate-600">
              {formMode === 'USER_REGISTER' ? 'Enter your details to get started' :
               formMode === 'USER_LOGIN' ? 'Enter your credentials to continue' :
               'Enter your admin credentials'}
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                {formMode === 'USER_REGISTER' && (
                  <>
                    <div className="grid gap-2">
                      <Input
                        id="fullName"
                        placeholder="Full Name"
                        type="text"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={loading}
                        {...register('fullName')}
                        error={errors.fullName?.message}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200/40"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Input
                        id="phone"
                        placeholder="Phone Number"
                        type="tel"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={loading}
                        {...register('phone')}
                        error={errors.phone?.message}
                        className="border-slate-200 focus:border-blue-300 focus:ring-blue-200/40"
                      />
                    </div>
                  </>
                )}
                {(formMode === 'USER_LOGIN' || formMode === 'USER_REGISTER') && (
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                      {...register('email')}
                      error={errors.email?.message}
                      className="border-slate-200 focus:border-blue-300 focus:ring-blue-200/40"
                    />
                  </div>
                )}
                {formMode === 'ADMIN_LOGIN' && (
                  <div className="grid gap-2">
                    <Input
                      id="registrationNumber"
                      placeholder="Admin Registration Number"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={loading}
                      {...register('registrationNumber')}
                      error={errors.registrationNumber?.message}
                      className="border-slate-200 focus:border-blue-300 focus:ring-blue-200/40"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete={formMode === 'USER_REGISTER' ? 'new-password' : 'current-password'}
                    disabled={loading}
                    {...register('password')}
                    error={errors.password?.message}
                    className="border-slate-200 focus:border-blue-300 focus:ring-blue-200/40"
                  />
                </div>
              </div>
                
              <Button disabled={loading} type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {formMode === 'USER_REGISTER' ? 'Sign Up' :
                 formMode === 'USER_LOGIN' ? 'Sign In' :
                 'Admin Sign In'}
              </Button>
            </form>
          </div>

          <div className="flex justify-between mt-4">
            {formMode === 'USER_LOGIN' && (
              <div className="space-x-2 w-full flex flex-col space-y-2">
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  onClick={() => setFormMode('USER_REGISTER')}
                  className="w-full border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Don't have an account? Sign Up
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  onClick={() => setFormMode('ADMIN_LOGIN')}
                  className="w-full border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  Admin Login
                </Button>
              </div>
            )}
            {formMode === 'USER_REGISTER' && (
              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() => setFormMode('USER_LOGIN')}
                className="w-full border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Already have an account? Sign In
              </Button>
            )}
            {formMode === 'ADMIN_LOGIN' && (
              <>
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    resetRateLimit(`admin:${form.getValues('registrationNumber')}`);
                    toast({
                      title: 'Rate Limit Reset',
                      description: 'You can try logging in again.'
                    });
                  }}
                  className="w-full mt-2 border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  Reset Login Attempts
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={loading}
                  onClick={() => setFormMode('USER_LOGIN')}
                  className="w-full border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  User Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}