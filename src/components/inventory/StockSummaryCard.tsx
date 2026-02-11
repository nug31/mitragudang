import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, TrendingDown, Archive, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { API_BASE_URL } from '../../config';

interface StockSummary {
    opening_stock: number;
    total_in: number;
    total_out: number;
    closing_stock: number;
    period: string;
    period_start: string;
}

interface StockSummaryCardProps {
    refreshTrigger?: number;
}

const StockSummaryCard: React.FC<StockSummaryCardProps> = ({ refreshTrigger }) => {
    const [summary, setSummary] = useState<StockSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/stock-summary`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock summary');
            }
            const data = await response.json();
            setSummary(data);
        } catch (err) {
            console.error('Error fetching stock summary:', err);
            setError('Gagal memuat ringkasan stok');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [refreshTrigger]);

    if (loading) {
        return (
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">Memuat ringkasan...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !summary) {
        return (
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="text-center text-gray-500 py-4">
                        {error || 'Data tidak tersedia'}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const stats = [
        {
            label: 'Stok Awal',
            value: summary.opening_stock,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Total Masuk',
            value: summary.total_in,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            prefix: '+',
        },
        {
            label: 'Total Keluar',
            value: summary.total_out,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            prefix: '-',
        },
        {
            label: 'Stok Akhir',
            value: summary.closing_stock,
            icon: Archive,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    // Get month name in Indonesian
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const periodDate = new Date(summary.period_start);
    const periodLabel = `${monthNames[periodDate.getMonth()]} ${periodDate.getFullYear()}`;

    return (
        <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3">
                    <h3 className="text-white font-semibold flex items-center">
                        📊 Perubahan Stok - {periodLabel}
                    </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                        >
                            <div className={`p-3 rounded-full ${stat.bgColor} mb-3`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stat.prefix || ''}{stat.value.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium mt-1">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default StockSummaryCard;
