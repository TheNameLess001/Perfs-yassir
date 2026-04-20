"use client";

import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  LayoutDashboard, UploadCloud, ShoppingBag, Store, Settings, 
  MapPin, Calendar, Sun, Moon, Download, Search, TrendingUp, Clock, XCircle 
} from 'lucide-react';

// --- FAUSSES DONNÉES POUR LA DÉMO ---
const trendData = [
  { day: '01/04', orders: 120, revenue: 1500 },
  { day: '02/04', orders: 180, revenue: 2300 },
  { day: '03/04', orders: 150, revenue: 1900 },
  { day: '04/04', orders: 220, revenue: 2900 },
];
const paymentData = [
  { name: 'CASH', value: 65 },
  { name: 'CARD', value: 35 },
];
const COLORS = ['#7B2CBF', '#10B981', '#F87171', '#FBBF24'];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`flex h-screen w-full font-sans ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#F8F9FA] text-gray-800'}`}>
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-yassir text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 text-2xl font-bold tracking-wider border-b border-white/20 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" /> YASSIR
          </div>
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 bg-white/20 p-3 rounded-lg font-medium transition-colors">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <Store className="w-5 h-5" /> Restaurants
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <UploadCloud className="w-5 h-5" /> Data Upload
            </a>
          </nav>
        </div>
        <div className="p-4">
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER (Filtres Globaux) */}
        <header className={`h-20 px-8 flex items-center justify-between border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-4 items-center">
            {/* Filtre Date */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <Calendar className="w-4 h-4 text-yassir" />
              <span className="text-sm">01 Avril - 14 Avril 2026</span>
            </div>
            {/* Filtre Ville */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <MapPin className="w-4 h-4 text-yassir" />
              <select className="bg-transparent text-sm outline-none">
                <option>Casablanca</option>
                <option>Rabat</option>
                <option>Marrakech</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-yassir text-white rounded-lg flex items-center gap-2 text-sm hover:bg-yassir-dark transition">
              <UploadCloud className="w-4 h-4" /> Import CSV
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* KPIs ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KPICard title="Chiffre d'Affaires Net" value="124,500 DH" icon={<TrendingUp />} trend="+12%" dark={darkMode} />
            <KPICard title="Volume de Commandes" value="3,402" icon={<ShoppingBag />} trend="+5%" dark={darkMode} />
            <KPICard title="Taux d'Annulation" value="4.2%" icon={<XCircle />} trend="-1.5%" isNegative dark={darkMode} />
            <KPICard title="Temps Livraison Moyen" value="28 min" icon={<Clock />} trend="-2 min" dark={darkMode} />
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue & Orders Trend (Line Chart) */}
            <div className={`col-span-2 p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-semibold text-lg mb-4">Revenue & Orders Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    <XAxis dataKey="day" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                    <YAxis yAxisId="left" stroke="#7B2CBF" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                    <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: darkMode ? '#1F2937' : '#FFF' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#7B2CBF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods (Pie Chart) */}
            <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-semibold text-lg mb-4">Modes de paiement</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={paymentData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#7B2CBF' : '#10B981'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RECENT ORDERS TABLE */}
          <div className={`p-6 rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Live Orders</h3>
              <div className="flex gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search order ID..." className="bg-transparent outline-none text-sm w-32" />
                </div>
                <button className="p-2 border rounded-lg text-gray-500 hover:text-yassir hover:border-yassir transition">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase border-b ${darkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'}`}>
                <tr>
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Restaurant</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                  <td className="py-4 font-medium">YAF-1774176493</td>
                  <td className="py-4">Carrefour Market La Villette</td>
                  <td className="py-4"><span className="px-2 py-1 bg-status-success/20 text-status-success rounded-full text-xs font-semibold">Delivered</span></td>
                  <td className="py-4 font-semibold">82.00 DH</td>
                </tr>
                <tr className="border-b last:border-0">
                  <td className="py-4 font-medium">YAF-1774189022</td>
                  <td className="py-4">Casablanca Streat Kebab</td>
                  <td className="py-4"><span className="px-2 py-1 bg-status-error/20 text-status-error rounded-full text-xs font-semibold">Cancelled</span></td>
                  <td className="py-4 font-semibold">45.50 DH</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}

// Composant Helper pour les KPIs
function KPICard({ title, value, icon, trend, isNegative, dark }: any) {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border-l-4 border-yassir flex items-center justify-between ${dark ? 'bg-gray-800' : 'bg-white'}`}>
      <div>
        <p className={`text-sm mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
        <span className={`text-xs font-medium ${isNegative ? 'text-status-error' : 'text-status-success'}`}>
          {trend} vs last period
        </span>
      </div>
      <div className={`p-4 rounded-full ${dark ? 'bg-gray-700 text-yassir-light' : 'bg-yassir/10 text-yassir'}`}>
        {icon}
      </div>
    </div>
  );
}
