import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, CheckCircle, XCircle, CreditCard, Banknote } from 'lucide-react';

interface OrderItem {
  id: string;
  menuId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled';
  paymentMethod?: 'cash' | 'card';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: Date;
}

const mockMenuItems = [
  { id: '1', name: 'Nasi Gudeg', price: 25000, category: 'main' },
  { id: '2', name: 'Gado-gado', price: 20000, category: 'main' },
  { id: '3', name: 'Kerupuk Udang', price: 8000, category: 'appetizer' },
  { id: '4', name: 'Es Teh Manis', price: 8000, category: 'drink' },
];

const initialOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Ahmad Rizki',
    tableNumber: '5',
    items: [
      { id: '1', menuId: '1', name: 'Nasi Gudeg', price: 25000, quantity: 1 },
      { id: '2', menuId: '4', name: 'Es Teh Manis', price: 8000, quantity: 1 }
    ],
    total: 33000,
    status: 'cooking',
    paymentStatus: 'unpaid',
    createdAt: new Date()
  },
  {
    id: 'ORD002',
    customerName: 'Siti Aminah',
    tableNumber: '3',
    items: [
      { id: '3', menuId: '2', name: 'Gado-gado', price: 20000, quantity: 1 }
    ],
    total: 20000,
    status: 'ready',
    paymentStatus: 'unpaid',
    createdAt: new Date()
  }
];

export const OrderSystem = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cooking': return 'bg-accent text-accent-foreground';
      case 'ready': return 'bg-success text-success-foreground';
      case 'served': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'cooking': return 'Memasak';
      case 'ready': return 'Siap';
      case 'served': return 'Disajikan';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders => orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handlePayment = (orderId: string, method: 'cash' | 'card') => {
    setOrders(orders => orders.map(order =>
      order.id === orderId 
        ? { ...order, paymentMethod: method, paymentStatus: 'paid', status: 'served' }
        : order
    ));
    setIsPaymentOpen(false);
    setSelectedOrder(null);
  };

  const createNewOrder = (formData: FormData) => {
    const newOrder: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      customerName: formData.get('customerName') as string,
      tableNumber: formData.get('tableNumber') as string,
      items: [
        {
          id: '1',
          menuId: formData.get('menuItem') as string,
          name: mockMenuItems.find(item => item.id === formData.get('menuItem'))?.name || '',
          price: mockMenuItems.find(item => item.id === formData.get('menuItem'))?.price || 0,
          quantity: parseInt(formData.get('quantity') as string)
        }
      ],
      total: (mockMenuItems.find(item => item.id === formData.get('menuItem'))?.price || 0) * parseInt(formData.get('quantity') as string),
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date()
    };

    setOrders(orders => [...orders, newOrder]);
    setIsNewOrderOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sistem Pemesanan</h2>
          <p className="text-muted-foreground">Kelola pesanan dan transaksi pelanggan</p>
        </div>
        
        <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Pesanan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Pesanan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              createNewOrder(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Pelanggan</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  placeholder="Masukkan nama pelanggan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Nomor Meja</Label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  placeholder="Nomor meja"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="menuItem">Menu</Label>
                <Select name="menuItem" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMenuItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - {formatCurrency(item.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Buat Pesanan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.customerName} - Meja {order.tableNumber}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {order.status === 'pending' && (
                  <Button
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={() => updateOrderStatus(order.id, 'cooking')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Mulai Memasak
                  </Button>
                )}
                
                {order.status === 'cooking' && (
                  <Button
                    size="sm"
                    className="w-full bg-success hover:bg-success/90"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Siap Disajikan
                  </Button>
                )}
                
                {order.status === 'ready' && order.paymentStatus === 'unpaid' && (
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsPaymentOpen(true);
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proses Pembayaran
                  </Button>
                )}

                {order.status !== 'cancelled' && order.status !== 'served' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Batalkan
                  </Button>
                )}

                {order.paymentStatus === 'paid' && (
                  <Badge className="w-full justify-center bg-success text-success-foreground">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Sudah Dibayar
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Proses Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Pesanan:</strong> {selectedOrder.id}</p>
                <p><strong>Pelanggan:</strong> {selectedOrder.customerName}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Metode Pembayaran:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handlePayment(selectedOrder.id, 'cash')}
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Banknote className="h-4 w-4" />
                    Tunai
                  </Button>
                  <Button
                    onClick={() => handlePayment(selectedOrder.id, 'card')}
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <CreditCard className="h-4 w-4" />
                    Kartu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {orders.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Belum ada pesanan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};