"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerTable } from "@/components/partners/partner-table";
import ApiService from "@/lib/ApiServiceFunctions";
import { transformPartnersResponse, calculatePartnerStats } from "@/lib/partnerDataTransform";

// Stats configuration
const getStatsConfig = (stats) => [
  {
    title: "Total Partners",
    value: stats.total,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    title: "Active Partners",
    value: stats.active,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  {
    title: "Testing Partners",
    value: stats.testing,
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
  },
  {
    title: "Certificate Alerts",
    value: stats.certificateAlerts,
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
];

function StatCard({ stat, loading }) {
  const Icon = stat.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-slate-800/20" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {stat.title}
        </h3>
        <div
          className={`rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-110 ${stat.bgColor}`}
        >
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
      </div>

      {/* Value */}
      <div className="relative">
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-300 group-hover:scale-105">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            stat.value
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />
    </div>
  );
}

export default function PartnersPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    testing: 0,
    inactive: 0,
    certificateAlerts: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch all partners to calculate stats
  const fetchPartnerStats = async () => {
    setStatsLoading(true);
    
    try {
      // Fetch all partners (with a large page size to get all)
      const response = await ApiService.getPartners({ size: 1000 });
      
      if (response.error) {
        console.error('Failed to fetch partner stats:', response.error);
      } else {
        // Transform API response and calculate stats
        const transformedPartners = transformPartnersResponse(response.data.items || response.data.data || []);
        const calculatedStats = calculatePartnerStats(transformedPartners);
        setStats(calculatedStats);
      }
    } catch (err) {
      console.error('Error fetching partner stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerStats();
  }, []);

  const partnerStats = getStatsConfig(stats);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
          <p className="text-muted-foreground">
            Manage your AS2 trading partners and their configurations
          </p>
        </div>
        <Button asChild>
          <Link href="/partners/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {partnerStats.map((stat, index) => (
          <StatCard key={index} stat={stat} loading={statsLoading} />
        ))}
      </div>

      {/* Partner Table */}
      <PartnerTable />
    </div>
  );
}
