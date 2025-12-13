import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStats, useComicsItems, useGenres, useAuthors } from '@/lib/queries';
import { Book, Clock, DollarSign, Download, Activity, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie, Cell, BarChart, Bar, PieChart as RechartsPieChart } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
const PieChart = RechartsPieChart; // Alias to avoid JSX component naming conflict
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const mockActivity = [
  { type: 'purchase', title: 'Cosmic Odyssey', date: '2 hours ago' },
  { type: 'wishlist', title: 'The Watchmen', date: '1 day ago' },
  { type: 'read', title: 'Cybernetic Dawn - Chapter 3', date: '2 days ago' },
];
const mockStreakData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  pages: Math.floor(Math.random() * (i + 1) * 2 + 5),
}));
const handleExport = () => {
    toast.info("Generating your data export...");
    const csvContent = "data:text/csv;charset=utf-8,"
        + "category,value\n"
        + "Comics Read,50\n"
        + "Hours Listened,120\n"
        + "Total Spent,250.75\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comicverse_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const comicsItems = useComicsItems();
  const { data: genres } = useGenres();
  const { data: authors } = useAuthors();
  const genreData = React.useMemo(() => {
    if (!comicsItems || !genres) return [];
    const genreCounts = comicsItems.reduce((acc, comic) => {
      comic.genreIds.forEach(gid => {
        acc[gid] = (acc[gid] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(genreCounts).map(([gid, count]) => ({
      name: genres.find(g => g.id === gid)?.name || 'Unknown',
      value: count,
    })).slice(0, 5);
  }, [comicsItems, genres]);
  const authorData = React.useMemo(() => {
    if (!comicsItems || !authors) return [];
    const authorRatings = comicsItems.reduce((acc, comic) => {
      comic.authorIds.forEach(aid => {
        if (!acc[aid]) acc[aid] = { total: 0, count: 0 };
        acc[aid].total += comic.rating;
        acc[aid].count += 1;
      });
      return acc;
    }, {} as Record<string, { total: number, count: number }>);
    return Object.entries(authorRatings).map(([aid, data]) => ({
      name: authors.find(a => a.id === aid)?.name.split(' ').pop() || 'Unknown',
      avgRating: data.total / data.count,
    })).sort((a, b) => b.avgRating - a.avgRating).slice(0, 5);
  }, [comicsItems, authors]);
  const COLORS = ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'];
  return (
    <div className="bg-comic-black min-h-screen text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight mb-8">Dashboard</motion.h1>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-comic-card border-white/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Comics Read</CardTitle><Book className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.reads}</div>}</CardContent></Card>
            <Card className="bg-comic-card border-white/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Hours Listened</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats?.hours}</div>}</CardContent></Card>
            <Card className="bg-comic-card border-white/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Spent</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{statsLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">${stats?.spent.toFixed(2)}</div>}</CardContent></Card>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-comic-card border-white/10"><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp /> 30-Day Reading Streak</CardTitle></CardHeader>
                <CardContent className="h-80"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockStreakData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /><XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.5)" fontSize={12} /><YAxis stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)' }} />
                      <Legend wrapperStyle={{ fontSize: '14px' }} /><Line type="monotone" dataKey="pages" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 8, style: { boxShadow: '0 0 10px #EF4444' } }} />
                    </LineChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-comic-card border-white/10"><CardHeader><CardTitle className="flex items-center gap-2"><Activity /> Recent Activity</CardTitle></CardHeader>
                <CardContent><Accordion type="single" collapsible className="w-full">
                    {mockActivity.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-b-white/10"><AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent className="flex justify-between items-center"><Badge variant={item.type === 'purchase' ? 'default' : 'secondary'}>{item.type}</Badge><span className="text-xs text-muted-foreground">{item.date}</span></AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-comic-card border-white/10"><CardHeader><CardTitle className="flex items-center gap-2"><PieChart className="h-4 w-4 text-muted-foreground" /> Genre Breakdown</CardTitle></CardHeader>
                <CardContent className="h-80"><ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={genreData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {genreData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </PieChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-comic-card border-white/10"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="h-4 w-4 text-muted-foreground" /> Top Authors by Rating</CardTitle></CardHeader>
                <CardContent className="h-80"><ResponsiveContainer width="100%" height="100%">
                    <BarChart data={authorData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis type="number" domain={[4, 5]} stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={80} stroke="rgba(255, 255, 255, 0.5)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="avgRating" fill="#EF4444" barSize={20} />
                    </BarChart>
                </ResponsiveContainer></CardContent>
              </Card>
            </motion.div>
          </div>
          <motion.div variants={itemVariants} className="mt-12 text-right">
            <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export Data (CSV)</Button>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}