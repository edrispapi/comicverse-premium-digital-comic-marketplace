import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAppStore, useCartTotals } from '@/store/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const checkoutSchema = z.object({
  // Shipping
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
  // Payment
  cardName: z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvc: z.string().regex(/^[0-9]{3,4}$/, 'Invalid CVC'),
});
export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const cart = useAppStore(s => s.cart);
  const clearCart = useAppStore(s => s.clearCart);
  const promoCode = useAppStore(s => s.promoCode);
  const setPromoCode = useAppStore(s => s.setPromoCode);
  const applyPromoCode = useAppStore(s => s.applyPromoCode);
  const shippingOption = useAppStore(s => s.shippingOption);
  const setShippingOption = useAppStore(s => s.setShippingOption);
  const { subtotal, discount, tax, total, shippingCost } = useCartTotals();
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', address: '', city: '', zip: '', cardName: '', cardNumber: '', expiryDate: '', cvc: '' },
  });
  const handleApplyPromo = () => {
    if (applyPromoCode()) {
      toast.success(`Promo code "${promoCode}" applied!`);
    } else {
      toast.error('Invalid promo code.');
    }
  };
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof checkoutSchema>)[] = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'email', 'address', 'city', 'zip'];
    if (currentStep === 1) fieldsToValidate = ['cardName', 'cardNumber', 'expiryDate', 'cvc'];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setCurrentStep(s => s + 1);
  };
  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log('Order placed:', values);
    toast.success('Order placed successfully! A confirmation has been sent to your email.');
    setShowConfetti(true);
    setTimeout(() => {
        clearCart();
        navigate('/');
    }, 2000);
  };
  const steps = [
    { title: 'Shipping', content: (
      <div className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="zip" render={({ field }) => (<FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <h3 className="font-semibold pt-4">Shipping Method</h3>
        <RadioGroup defaultValue={shippingOption} onValueChange={(val: 'standard' | 'express') => setShippingOption(val)} className="space-y-2">
          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-white/5 transition-colors"><FormControl><RadioGroupItem value="standard" /></FormControl><FormLabel className="font-normal flex-1">Standard Shipping ($5.00)</FormLabel></FormItem>
          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-white/5 transition-colors"><FormControl><RadioGroupItem value="express" /></FormControl><FormLabel className="font-normal flex-1">Express Shipping ($15.00)</FormLabel></FormItem>
        </RadioGroup>
      </div>
    )},
    { title: 'Payment', content: (
      <div className="space-y-4">
        <FormField control={form.control} name="cardName" render={({ field }) => (<FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="cardNumber" render={({ field }) => (<FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="expiryDate" render={({ field }) => (<FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="cvc" render={({ field }) => (<FormItem><FormLabel>CVC</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <h3 className="font-semibold pt-4">Promo Code</h3>
        <div className="flex gap-2"><Input placeholder="Enter code" value={promoCode} onChange={e => setPromoCode(e.target.value)} /><Button type="button" variant="outline" onClick={handleApplyPromo}>Apply</Button></div>
      </div>
    )},
    { title: 'Review', content: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Review your order</h3>
        <p>Please check your information below before placing your order.</p>
        <Card className="bg-comic-card border-white/10"><CardContent className="p-4 text-sm"><p><strong>Name:</strong> {form.watch('name')}</p><p><strong>Email:</strong> {form.watch('email')}</p><p><strong>Address:</strong> {form.watch('address')}, {form.watch('city')}, {form.watch('zip')}</p></CardContent></Card>
      </div>
    )},
  ];
  if (cart.length === 0 && !showConfetti) {
    return (
      <div className="bg-comic-black min-h-screen text-white flex flex-col"><Navbar />
        <main className="flex-1 flex items-center justify-center text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
            <p className="mt-4 text-neutral-400">You can't check out with an empty cart.</p>
            <Button asChild className="mt-8 btn-accent"><Link to="/catalog">Go Shopping</Link></Button>
          </motion.div>
        </main><Footer />
      </div>
    );
  }
  return (
    <div className="bg-comic-black min-h-screen text-white">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <AnimatePresence>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-comic-accent rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [1, 2, 0],
                  opacity: [1, 1, 0],
                  x: Math.random() * 400 - 200,
                  y: Math.random() * 400 - 200,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{ duration: 2, delay: i * 0.05, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold tracking-tight text-center mb-12">Checkout</motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="bg-comic-card border-white/10"><CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {isMobile ? (
                  <Accordion type="single" collapsible value={`${currentStep}`} onValueChange={(val) => setCurrentStep(Number(val))} className="w-full">
                    {steps.map((step, i) => (
                      <AccordionItem key={i} value={`${i}`}>
                        <AccordionTrigger>{i + 1}. {step.title}</AccordionTrigger>
                        <AccordionContent>{step.content}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <CheckoutStepper steps={steps} currentStep={currentStep} />
                )}
                <div className="mt-8 flex justify-between">
                  {currentStep > 0 && <Button type="button" variant="outline" onClick={() => setCurrentStep(s => s - 1)}>Back</Button>}
                  {currentStep < steps.length - 1 && <Button type="button" className="btn-accent ml-auto" onClick={handleNextStep}>Next</Button>}
                  {currentStep === steps.length - 1 && <Button type="submit" size="lg" className="btn-accent w-full">Place Order for ${total.toFixed(2)}</Button>}
                </div>
              </form>
            </Form>
          </CardContent></Card>
          <div className="space-y-8 sticky top-24 lg:top-32">
            <Card className="bg-comic-card border-white/10"><CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4"><img src={item.coverUrl} alt={item.title} className="w-12 h-auto rounded aspect-[2/3]" />
                      <div><p className="font-semibold">{item.title}</p><p className="text-neutral-400">Qty: {item.quantity}</p></div>
                    </div><p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <Separator className="bg-white/10" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><p className="text-neutral-400">Subtotal</p><p>${subtotal.toFixed(2)}</p></div>
                  {discount > 0 && <div className="flex justify-between text-green-400"><p>Discount</p><p>-${discount.toFixed(2)}</p></div>}
                  <div className="flex justify-between"><p className="text-neutral-400">Shipping</p><p>${shippingCost.toFixed(2)}</p></div>
                  <div className="flex justify-between"><p className="text-neutral-400">Taxes</p><p>${tax.toFixed(2)}</p></div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between font-bold text-lg"><p>Total</p><p>${total.toFixed(2)}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main><Footer />
    </div>
  );
}