import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChefHat, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { MenuManagement } from './MenuManagement';
import { OrderSystem } from './OrderSystem';
import { StockManagement } from './StockManagement';
import { SalesReport } from './SalesReport';
import restaurantLogo from '@/assets/restaurant-logo.jpg';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  lowStockItems: number;
  totalCustomers: number;
}

export const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const stats: DashboardStats = {
    todayOrders: 45,
    todayRevenue: 2450000,
    lowStockItems: 3,
    totalCustomers: 38
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img 
              src={restaurantLogo} 
              alt="Dapur Bunda Bahagia" 
              className="h-10 w-auto rounded-md"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Dapur Bunda Bahagia</h1>
              <p className="text-sm text-muted-foreground">Restaurant Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success text-success-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Buka
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Pesanan
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Stok
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Laporan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pesanan Hari Ini</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.todayOrders}</div>
                  <p className="text-xs text-muted-foreground">+12% dari kemarin</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                  <DollarSign className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{formatCurrency(stats.todayRevenue)}</div>
                  <p className="text-xs text-muted-foreground">+8% dari kemarin</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{stats.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Item perlu restock</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Pelanggan aktif</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Orders */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: '#001', customer: 'Ahmad Rizki', items: 'Nasi Gudeg, Es Teh', total: 35000, status: 'cooking' },
                    { id: '#002', customer: 'Siti Aminah', items: 'Gado-gado, Jus Jeruk', total: 28000, status: 'ready' },
                    { id: '#003', customer: 'Budi Santoso', items: 'Ayam Bakar, Es Campur', total: 45000, status: 'served' }
                  ].map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{order.customer} ({order.id})</p>
                        <p className="text-xs text-muted-foreground">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                        <Badge 
                          variant={order.status === 'ready' ? 'default' : order.status === 'served' ? 'secondary' : 'outline'}
                          className={
                            order.status === 'ready' ? 'bg-success text-success-foreground' :
                            order.status === 'served' ? 'bg-muted text-muted-foreground' :
                            'bg-warning text-warning-foreground'
                          }
                        >
                          {order.status === 'cooking' ? 'Memasak' : 
                           order.status === 'ready' ? 'Siap' : 'Disajikan'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Items */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Menu Terpopuler Hari Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Nasi Gudeg', sold: 12, category: 'Makanan Utama' },
                    { name: 'Gado-gado', sold: 8, category: 'Makanan Utama' },
                    { name: 'Kerupuk Udang', sold: 15, category: 'Appetizer' },
                    { name: 'Es Teh Manis', sold: 20, category: 'Minuman' }
                  ].map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{item.sold} terjual</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderSystem />
          </TabsContent>

          <TabsContent value="stock">
            <StockManagement />
          </TabsContent>

          <TabsContent value="reports">
            <SalesReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};