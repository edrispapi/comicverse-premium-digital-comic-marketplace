import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAppStore, useWishlist } from '@/store/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Book, Heart, Package, User as UserIcon } from 'lucide-react';
const mockOrders = [
  { id: 'ORD-001', date: '2023-10-15', total: 45.98, status: 'Delivered', items: 2 },
  { id: 'ORD-002', date: '2023-11-01', total: 12.99, status: 'Delivered', items: 1 },
  { id: 'ORD-003', date: '2023-12-05', total: 89.50, status: 'Shipped', items: 4 },
];
export function ProfilePage() {
  const userId = useAppStore(s => s.userId);
  const clearAuth = useAppStore(s => s.clearAuth);
  const wishlist = useWishlist();
  if (!userId) {
    return <Navigate to="/" />;
  }
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <Avatar className="w-24 h-24 border-4 border-comic-accent">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${userId}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold">My Profile</h1>
              <p className="text-neutral-400 mt-1">Welcome back, your comic adventure continues!</p>
            </div>
            <Button onClick={clearAuth} variant="outline" className="md:ml-auto">
              Log Out
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-comic-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-comic-accent" /> Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-white/10 hover:bg-transparent">
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id} className="border-b-white/10 hover:bg-white/5">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-blue-600/20 text-blue-400 border-blue-600/30'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card className="bg-comic-card border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-comic-accent" /> My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlist.length > 0 ? (
                    <div className="space-y-4">
                      {wishlist.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center gap-4 text-sm">
                          <img src={item.coverUrl} alt={item.title} className="w-12 h-auto rounded aspect-[2/3]" />
                          <p className="font-semibold flex-1 truncate">{item.title}</p>
                        </div>
                      ))}
                      {wishlist.length > 3 && <p className="text-xs text-neutral-400 text-center pt-2">...and {wishlist.length - 3} more</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">Your wishlist is empty.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}