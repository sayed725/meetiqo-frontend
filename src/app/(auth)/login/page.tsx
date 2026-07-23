'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/toast-container';
import { GoogleSignInButton } from '@/components/google-signin-button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { toasts, toast, dismiss } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { user, token } = res.data.data;
      setAuth(user, token);
      document.cookie = `token=${token}; path=/; max-age=604800; sameSite=lax`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast({ message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { idToken: credential });
      const { user, token } = res.data.data;
      setAuth(user, token);
      document.cookie = `token=${token}; path=/; max-age=604800; sameSite=lax`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push(user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Google login failed. Please try again.';
      toast({ message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: keyof typeof demoCredentials) => {
    form.setValue('email', demoCredentials[role].email);
    form.setValue('password', demoCredentials[role].password);
  };

  const demoCredentials = {
    admin: { email: 'admin@meetiqo.com', password: 'demo123' },
    organizer: { email: 'organizer@meetiqo.com', password: 'demo123' },
    user: { email: 'user@meetiqo.com', password: 'demo123' },
  };

  return (
    <div className="w-full">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Sign in to your Meetiqo account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700 hover:text-white" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground uppercase">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-3">
        <GoogleSignInButton onSuccess={handleGoogleSuccess} />

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-2 text-[10px] sm:text-xs"
            onClick={() => fillDemo('admin')}
          >
            Admin Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-2 text-[10px] sm:text-xs"
            onClick={() => fillDemo('organizer')}
          >
            Org Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-2 text-[10px] sm:text-xs"
            onClick={() => fillDemo('user')}
          >
            User Demo
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
