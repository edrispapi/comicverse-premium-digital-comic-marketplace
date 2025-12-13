import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
});
export function CheckoutPage() {
  const cart = useAppStore(s => s.cart);
  const clearCart = useAppStore(s => s.clearCart);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: '', email: '', address: '', city: '', zip: '' },
  });
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  function onSubmit(values: z.infer<typeof addressSchema>) {
    console.log('Order placed:', values);
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/');
  }
  if (cart.length === 0) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
            <p className="mt-4 text-neutral-400">You can't check out with an empty cart.</p>
            <Button asChild className="mt-8 btn-accent">
              <Link to="/catalog">Go Shopping</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl font-bold tracking-tight text-center mb-12"
        >
          Checkout
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-comic-card border-white/10">
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                      <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit" size="lg" className="w-full btn-accent mt-6">Place Order</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="bg-comic-card border-white/10">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={item.coverUrl} alt={item.title} className="w-12 h-auto rounded aspect-[2/3]" />
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <div className="flex justify-between"><p>Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                  <div className="flex justify-between"><p>Taxes</p><p>${tax.toFixed(2)}</p></div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between font-bold text-lg"><p>Total</p><p>${total.toFixed(2)}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}