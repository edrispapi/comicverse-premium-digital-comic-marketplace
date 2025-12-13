import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
};
const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For individuals and small teams starting out.',
    features: ['Unlimited Posts', 'Basic AI Generation', 'Join Communities', 'Standard Support'],
    isPopular: false,
  },
  {
    name: 'Scale',
    price: 99,
    description: 'For growing businesses and creators.',
    features: ['Unlimited Posts', 'Advanced AI Books & Images', 'Create Communities', 'Priority Support', 'API Access'],
    isPopular: true,
  },
  {
    name: 'Growth',
    price: 499,
    description: 'For large-scale enterprises and power users.',
    features: ['Unlimited Posts', 'Advanced AI Books & Images', 'Create Communities', 'Dedicated Support', 'API Access', 'Custom Integrations'],
    isPopular: false,
  },
];
const allFeatures = [
  'Unlimited Posts',
  'Basic AI Generation',
  'Advanced AI Books & Images',
  'Join Communities',
  'Create Communities',
  'Standard Support',
  'Priority Support',
  'Dedicated Support',
  'API Access',
  'Custom Integrations',
];
const faqs = [
  {
    question: 'What is AI Generation?',
    answer: 'Our AI Generation tools allow you to create unique comic panels, character concepts, and even draft entire audiobooks from a simple prompt. The "Advanced" tier offers higher quality outputs and more customization options.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be prorated for the current billing cycle.',
  },
  {
    question: 'What happens if I cancel my subscription?',
    answer: 'If you cancel, you will retain access to your plan\'s features until the end of the current billing period. After that, you will be moved to the free plan with limited access.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'We do not offer a free trial, but our Starter plan is a great way to experience the core features of ComicVerse at a low cost.',
  },
  {
    question: 'What kind of support is included?',
    answer: 'Standard support includes email assistance. Priority support offers faster response times and chat access. Dedicated support provides a personal account manager and direct phone line for immediate assistance.',
  },
];
export function PlansPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <PageWrapper navbar={<Navbar />} footer={<Footer />}>
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-glow">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
          Unlock the full potential of ComicVerse with a plan that fits your needs.
        </p>
      </motion.div>
      <motion.div variants={itemVariants} className="flex items-center justify-center space-x-4 my-12">
        <Label htmlFor="billing-cycle" className={cn(!isAnnual && 'text-red-400')}>Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          aria-label="Toggle billing cycle"
        />
        <Label htmlFor="billing-cycle" className={cn(isAnnual && 'text-red-400')}>
          Annual <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">-20%</Badge>
        </Label>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "glass-dark border-white/10 flex flex-col h-full transition-all duration-300 hover:shadow-red-lift-glow hover:-translate-y-2",
              plan.isPopular && "border-red-500 shadow-red-glow"
            )}>
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white">Most Popular</Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center my-8">
                  <span className="text-5xl font-bold">
                    ${isAnnual ? (plan.price * 12 * 0.8 / 12).toFixed(0) : plan.price}
                  </span>
                  <span className="text-neutral-400">/month</span>
                  {isAnnual && <p className="text-sm text-green-400">Billed as ${(plan.price * 12 * 0.8).toFixed(0)} annually</p>}
                </div>
                <ul className="space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-red-400 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={cn("w-full", plan.isPopular ? "btn-accent" : "bg-white text-black hover:bg-neutral-200")}>
                  <Link to="/checkout">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div variants={itemVariants} className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        <Card className="glass-dark border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead className="w-1/3">Features</TableHead>
                {plans.map(plan => <TableHead key={plan.name} className="text-center">{plan.name}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFeatures.map(feature => (
                <TableRow key={feature} className="border-b-white/10 odd:bg-white/5 hover:bg-red-500/10">
                  <TableCell className="font-medium">{feature}</TableCell>
                  {plans.map(plan => (
                    <TableCell key={plan.name} className="text-center">
                      {plan.features.includes(feature) ? (
                        <Check className="h-5 w-5 text-red-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-neutral-600 mx-auto" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants} className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-white/10">
              <AccordionTrigger className="hover:text-red-400">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-neutral-300">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </PageWrapper>
  );
}