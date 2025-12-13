import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/store/use-store';
import { useAuthLogin, useAuthSignup } from '@/lib/queries';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Github } from 'lucide-react';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
});
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-comic-accent rounded-full"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [1, 1.5, 0],
          opacity: [1, 1, 0],
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          rotate: Math.random() * 360,
        }}
        transition={{ duration: 1.5, delay: i * 0.03, ease: "easeOut" }}
      />
    ))}
  </div>
);
function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { mutate: login, isPending: isLoginPending } = useAuthLogin();
  const { mutate: signup, isPending: isSignupPending } = useAuthSignup();
  const setUserId = useAppStore(s => s.setUserId);
  const setAuthToken = useAppStore(s => s.setAuthToken);
  const setRememberMe = useAppStore(s => s.setRememberMe);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    login(values, {
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.user.name}!`);
        setShowConfetti(true);
        setUserId(data.user.id);
        setAuthToken(data.token);
        setRememberMe(values.rememberMe);
        setTimeout(() => toggleAuth(false), 1500);
      },
      onError: (error) => toast.error(error.message || 'Login failed. Please check your credentials.'),
    });
  };
  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    signup(values, {
      onSuccess: (data) => {
        toast.success(`Welcome to ComicVerse, ${data.user.name}!`);
        setShowConfetti(true);
        setUserId(data.user.id);
        setAuthToken(data.token);
        setRememberMe(true);
        setTimeout(() => toggleAuth(false), 1500);
      },
      onError: (error) => toast.error(error.message || 'Signup failed. Please try again.'),
    });
  };
  return (
    <div className="relative p-6 sm:p-8 text-white">
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-glow">Join the Adventure</h2>
        <p className="text-neutral-400 mt-2">Unlock a universe of comics.</p>
      </div>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-800">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mt-6">
              <FormField control={loginForm.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={loginForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} {...field} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex items-center justify-between text-sm">
                <FormField control={loginForm.control} name="rememberMe" render={({ field }) => <FormItem className="flex items-center space-x-2"><FormControl><Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} /></FormControl><Label htmlFor="rememberMe" className="font-normal">Remember me</Label></FormItem>} />
                <a href="#" className="hover:text-comic-accent transition-colors">Forgot password?</a>
              </div>
              <Button type="submit" className="w-full btn-accent" disabled={isLoginPending}>{isLoginPending ? 'Logging in...' : 'Login'}</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="signup">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 mt-6">
              <FormField control={signupForm.control} name="name" render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={signupForm.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={signupForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} {...field} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full btn-accent" disabled={isSignupPending}>{isSignupPending ? 'Creating account...' : 'Sign Up'}</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-comic-card px-2 text-neutral-400">Or continue with</span></div>
      </div>
      <Button variant="outline" className="w-full"><Github className="mr-2 h-4 w-4" /> GitHub (mock)</Button>
    </div>
  );
}
export function AuthDialog() {
  const isMobile = useIsMobile();
  const isAuthOpen = useAppStore(s => s.isAuthOpen);
  const toggleAuth = useAppStore(s => s.toggleAuth);
  if (isMobile) {
    return (
      <Sheet open={isAuthOpen} onOpenChange={toggleAuth}>
        <SheetContent side="bottom" className="h-full p-0 bg-comic-card border-none text-white">
          <AuthForm />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Dialog open={isAuthOpen} onOpenChange={toggleAuth}>
      <DialogContent className="sm:max-w-md bg-comic-card border-white/10 p-0">
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}