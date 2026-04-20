"use client";

import React, { useState } from 'react';
import { 
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  LayoutDashboard, UploadCloud, ShoppingBag, Store, Settings, 
  MapPin, Calendar, Sun, Moon, Download, Search, TrendingUp, Clock, XCircle, X
} from 'lucide-react';

// --- DONNÉES DE DÉMONSTRATION ---
const trendData = [
  { day: '01/04', orders: 120, revenue: 1500 },
  { day: '02/04', orders: 180, revenue: 2300 },
  { day: '03/04', orders: 150, revenue: 1900 },
  { day: '04/04', orders: 220, revenue: 2900 },
  { day: '05/04', orders: 190, revenue: 2600 },
  { day: '06/04', orders: 250, revenue: 3400 },
];

const paymentData = [
  { name: 'CASH', value: 65 },
  { name: 'CARD', value: 35 },
];

const statusData = [
  { name: 'Delivered', value: 85 },
  { name: 'Cancelled', value: 10 },
  { name: 'Ongoing', value: 5 },
];

const STATUS_COLORS = { Delivered: '#10B981', Cancelled: '#F87171', Ongoing: '#FBBF24' };
const YASSIR_COLOR = '#7B2CBF';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'orders' | 'restaurants'>('orders');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Gérer l'upload vers l'API
  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier.");
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        alert("Upload réussi ! La base de données est à jour.");
        setIsModalOpen(false);
        setFile(null);
        // Ici, on pourrait déclencher un fetch pour rafraîchir les stats
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex h-screen w-full font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F8F9FA] text-gray-800'}`}>
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#7B2CBF] text-white flex flex-col justify-between hidden md:flex shadow-xl z-10">
        <div>
          <div className="p-6 text-2xl font-bold tracking-wider border-b border-white/20 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" /> YASSIR
          </div>
          <nav className="p-4 space-y-2 mt-4">
            <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
            <NavItem icon={<Store />} label="Restaurants" />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <UploadCloud className="w-5 h-5" /> Data Upload
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <NavItem icon={<Settings />} label="Settings" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className={`h-20 px-8 flex items-center justify-between border-b shadow-sm z-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-4 items-center">
            {/* Filtre Date */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
              <Calendar className="w-4 h-4 text-[#7B2CBF]" />
              <span className="text-sm font-medium">01 Avril - 14 Avril 2026</span>
            </div>
            {/* Filtre Ville */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <MapPin className="w-4 h-4 text-[#7B2CBF]" />
              <select className="bg-transparent text-sm font-medium outline-none cursor-pointer">
                <option className={darkMode ? "text-black" : ""}>Toutes les villes</option>
                <option className={darkMode ? "text-black" : ""}>Casablanca</option>
                <option className={darkMode ? "text-black" : ""}>Rabat</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#7B2CBF] text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-[#6824a3] transition shadow-md shadow-[#7B2CBF]/30"
            >
              <UploadCloud className="w-4 h-4" /> Import CSV
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </header>

        {/* DASHBOARD SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <KPICard title="Chiffre d'Affaires Net" value="124,500 DH" icon={<TrendingUp />} trend="+12%" dark={darkMode} />
            <KPICard title="Volume de Commandes" value="3,402" icon={<ShoppingBag />} trend="+5%" dark={darkMode} />
            <KPICard title="Taux d'Annulation" value="4.2%" icon={<XCircle />} trend="-1.5%" isNegative dark={darkMode} />
            <KPICard title="Temps Livraison Moyen" value="28 min" icon={<Clock />} trend="-2 min" dark={darkMode} />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Revenue Trend */}
            <ChartCard title="Évolution des Revenus & Commandes" dark={darkMode} className="xl:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="day" stroke={darkMode ? '#9CA3AF' : '#6B7280'} tickLine={false} />
                  <YAxis yAxisId="left" stroke={YASSIR_COLOR} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: darkMode ? '#1F2937' : '#FFF', color: darkMode ? '#FFF' : '#000', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Line yAxisId="left" name="Revenus (DH)" type="monotone" dataKey="revenue" stroke={YASSIR_COLOR} strokeWidth={3} dot={{ r: 4, fill: YASSIR_COLOR }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" name="Commandes" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Status Donut */}
            <ChartCard title="Statuts des Commandes" dark={darkMode}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: darkMode ? '#1F2937' : '#FFF' }} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* DATA TABLE */}
          <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h3 className="font-semibold text-lg">Dernières Commandes Live</h3>
              <div className="flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Rechercher un ID..." className="bg-transparent outline-none text-sm w-48" />
                </div>
                <button className="p-2 border rounded-lg text-gray-500 hover:text-[#7B2CBF] hover:border-[#7B2CBF] transition">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className={`text-xs uppercase border-b ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'}`}>
                  <tr>
                    <th className="pb-4 font-semibold px-4">Order ID</th>
                    <th className="pb-4 font-semibold px-4">Restaurant</th>
                    <th className="pb-4 font-semibold px-4">Client</th>
                    <th className="pb-4 font-semibold px-4">Statut</th>
                    <th className="pb-4 font-semibold px-4 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow id="YAF-1774176493" restau="Carrefour Market La Villette" client="Zineb" status="Delivered" amount="82.00 DH" dark={darkMode} />
                  <TableRow id="YAF-1774189022" restau="Casablanca Streat Kebab" client="Amine" status="Cancelled" amount="45.50 DH" dark={darkMode} />
                  <TableRow id="YAF-1774191244" restau="Red Rooster" client="Sofia" status="Ongoing" amount="120.00 DH" dark={darkMode} />
                  <TableRow id="YAF-1774199999" restau="Snack Hassan" client="Karim" status="Delivered" amount="34.00 DH" dark={darkMode} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold mb-2">Importer des données</h2>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uploadez vos fichiers CSV pour mettre à jour le dashboard (Upsert).</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Type de fichier</label>
              <select 
                value={uploadType} 
                onChange={(e) => setUploadType(e.target.value as any)}
                className={`w-full p-3 rounded-lg border outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`}
              >
                <option value="orders">Commandes (admin-earnings-orders.csv)</option>
                <option value="restaurants">Restaurants (restaurant-list.csv)</option>
              </select>
            </div>

            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition ${file ? 'border-[#7B2CBF] bg-[#7B2CBF]/5' : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-[#7B2CBF]/50'}`}>
              <input 
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden" 
                id="file-upload" 
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <UploadCloud className={`w-10 h-10 ${file ? 'text-[#7B2CBF]' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">
                  {file ? file.name : "Cliquez ou glissez le fichier CSV ici"}
                </span>
              </label>
            </div>

            <button 
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`w-full mt-6 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
                isUploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7B2CBF] hover:bg-[#6824a3] text-white shadow-lg'
              }`}
            >
              {isUploading ? "Mise à jour..." : "Lancer l'importation"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENTS (Pour garder le code propre) ---

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${active ? 'bg-white/20 text-white shadow-inner' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
      <span className="w-5 h-5">{icon}</span> {label}
    </a>
  );
}

function KPICard({ title, value, icon, trend, isNegative, dark }: any) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border-l-4 border-[#7B2CBF] flex items-center justify-between transition-transform hover:-translate-y-1 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
      <div>
        <p className={`text-sm mb-1 font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
        <span className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${isNegative ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
          {trend}
        </span>
      </div>
      <div className={`p-4 rounded-full ${dark ? 'bg-gray-700 text-[#9D4EDD]' : 'bg-[#7B2CBF]/10 text-[#7B2CBF]'}`}>
        {icon}
      </div>
    </div>
  );
}

function ChartCard({ title, dark, children, className = "" }: any) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm flex flex-col ${dark ? 'bg-gray-800' : 'bg-white'} ${className}`}>
      <h3 className="font-semibold text-lg mb-6">{title}</h3>
      <div className="flex-1 min-h-[280px]">
        {children}
      </div>
    </div>
  );
}

function TableRow({ id, restau, client, status, amount, dark }: any) {
  const getStatusColor = (s: string) => {
    if (s === 'Delivered') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
  };

  return (
    <tr className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
      <td className="py-4 px-4 font-medium">{id}</td>
      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{restau}</td>
      <td className="py-4 px-4">{client}</td>
      <td className="py-4 px-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="py-4 px-4 font-bold text-right">{amount}</td>
    </tr>
  );
}
