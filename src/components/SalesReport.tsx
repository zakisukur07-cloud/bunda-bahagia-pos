import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface SalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
}

interface TopMenuItem {
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

const mockSalesData: SalesData[] = [
  {
    date: '2024-01-15',
    totalSales: 2450000,
    totalOrders: 45,
    totalItems: 78,
    averageOrderValue: 54444
  },
  {
    date: '2024-01-14',
    totalSales: 2180000,
    totalOrders: 38,
    totalItems: 65,
    averageOrderValue: 57368
  },
  {
    date: '2024-01-13',
    totalSales: 2850000,
    totalOrders: 52,
    totalItems: 89,
    averageOrderValue: 54808
  },
  {
    date: '2024-01-12',
    totalSales: 2320000,
    totalOrders: 41,
    totalItems: 71,
    averageOrderValue: 56585
  },
  {
    date: '2024-01-11',
    totalSales: 2670000,
    totalOrders: 48,
    totalItems: 83,
    averageOrderValue: 55625
  }
];

const mockTopItems: TopMenuItem[] = [
  { name: 'Nasi Gudeg', quantity: 35, revenue: 875000, category: 'Makanan Utama' },
  { name: 'Es Teh Manis', quantity: 68, revenue: 544000, category: 'Minuman' },
  { name: 'Gado-gado', quantity: 28, revenue: 560000, category: 'Makanan Utama' },
  { name: 'Kerupuk Udang', quantity: 42, revenue: 336000, category: 'Appetizer' },
  { name: 'Jus Jeruk', quantity: 24, revenue: 360000, category: 'Minuman' }
];

export const SalesReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('daily');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const calculateTotals = () => {
    const totalSales = mockSalesData.reduce((sum, data) => sum + data.totalSales, 0);
    const totalOrders = mockSalesData.reduce((sum, data) => sum + data.totalOrders, 0);
    const totalItems = mockSalesData.reduce((sum, data) => sum + data.totalItems, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    return { totalSales, totalOrders, totalItems, averageOrderValue };
  };

  const totals = calculateTotals();

  const exportReport = () => {
    // Mock export functionality
    alert('Laporan berhasil diekspor!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h2>
          <p className="text-muted-foreground">Analisis penjualan dan performa bisnis</p>
        </div>
        
        <Button onClick={exportReport} className="bg-primary hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Ekspor Laporan
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Periode:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal Mulai:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal Akhir:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totals.totalSales)}</div>
            <p className="text-xs text-muted-foreground">5 hari terakhir</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totals.totalOrders}</div>
            <p className="text-xs text-muted-foreground">5 hari terakhir</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Nilai Pesanan</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatCurrency(totals.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per pesanan</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item Terjual</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totals.totalItems}</div>
            <p className="text-xs text-muted-foreground">5 hari terakhir</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Sales */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Penjualan Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSalesData.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">
                      {format(new Date(day.date), "dd MMM yyyy", { locale: id })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {day.totalOrders} pesanan • {day.totalItems} item
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{formatCurrency(day.totalSales)}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(day.averageOrderValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Menu Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.quantity} terjual
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">165</p>
              <p className="text-sm text-muted-foreground">Tunai</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(8250000)}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">59</p>
              <p className="text-sm text-muted-foreground">Kartu Debit</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(3230000)}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{formatCurrency(totals.totalSales)}</p>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xs text-muted-foreground">{totals.totalOrders} transaksi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};