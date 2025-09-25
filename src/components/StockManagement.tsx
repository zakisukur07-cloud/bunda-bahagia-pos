import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, AlertTriangle, TrendingDown, Search } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: 'ingredient' | 'beverage' | 'packaging';
  currentStock: number;
  minStock: number;
  unit: string;
  cost: number;
  supplier: string;
  lastUpdated: Date;
}

const initialStockItems: StockItem[] = [
  {
    id: '1',
    name: 'Beras',
    category: 'ingredient',
    currentStock: 50,
    minStock: 20,
    unit: 'kg',
    cost: 12000,
    supplier: 'Toko Beras Maju',
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Ayam',
    category: 'ingredient',
    currentStock: 15,
    minStock: 10,
    unit: 'kg',
    cost: 35000,
    supplier: 'Pasar Tradisional',
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Teh Celup',
    category: 'beverage',
    currentStock: 8,
    minStock: 15,
    unit: 'kotak',
    cost: 25000,
    supplier: 'Distributor Minuman',
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Gula',
    category: 'ingredient',
    currentStock: 25,
    minStock: 10,
    unit: 'kg',
    cost: 14000,
    supplier: 'Toko Kelontong',
    lastUpdated: new Date()
  },
  {
    id: '5',
    name: 'Gelas Plastik',
    category: 'packaging',
    currentStock: 200,
    minStock: 100,
    unit: 'pcs',
    cost: 500,
    supplier: 'Supplier Kemasan',
    lastUpdated: new Date()
  }
];

export const StockManagement = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<StockItem | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ingredient': return 'Bahan Baku';
      case 'beverage': return 'Minuman';
      case 'packaging': return 'Kemasan';
      default: return category;
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { status: 'critical', label: 'Kritis', color: 'bg-destructive text-destructive-foreground' };
    if (current <= min * 1.5) return { status: 'low', label: 'Rendah', color: 'bg-warning text-warning-foreground' };
    return { status: 'good', label: 'Baik', color: 'bg-success text-success-foreground' };
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = stockItems.filter(item => item.currentStock <= item.minStock);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem: StockItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as StockItem['category'],
      currentStock: parseFloat(formData.get('currentStock') as string),
      minStock: parseFloat(formData.get('minStock') as string),
      unit: formData.get('unit') as string,
      cost: parseFloat(formData.get('cost') as string),
      supplier: formData.get('supplier') as string,
      lastUpdated: new Date()
    };

    if (editingItem) {
      setStockItems(items => items.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setStockItems(items => [...items, newItem]);
    }

    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleRestock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const additionalStock = parseFloat(formData.get('additionalStock') as string);
    
    if (restockItem) {
      setStockItems(items => items.map(item =>
        item.id === restockItem.id 
          ? { ...item, currentStock: item.currentStock + additionalStock, lastUpdated: new Date() }
          : item
      ));
    }
    
    setIsRestockOpen(false);
    setRestockItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Stok</h2>
          <p className="text-muted-foreground">Kelola stok bahan baku dan inventori</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Item Stok' : 'Tambah Item Stok Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Item</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  placeholder="Masukkan nama item"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select name="category" defaultValue={editingItem?.category} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingredient">Bahan Baku</SelectItem>
                    <SelectItem value="beverage">Minuman</SelectItem>
                    <SelectItem value="packaging">Kemasan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Stok Saat Ini</Label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    step="0.1"
                    defaultValue={editingItem?.currentStock}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stok Minimum</Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    step="0.1"
                    defaultValue={editingItem?.minStock}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="unit">Satuan</Label>
                  <Input
                    id="unit"
                    name="unit"
                    defaultValue={editingItem?.unit}
                    placeholder="kg, pcs, liter"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Harga Satuan (Rp)</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    defaultValue={editingItem?.cost}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  defaultValue={editingItem?.supplier}
                  placeholder="Nama supplier"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setEditingItem(null);
                }}>
                  Batal
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingItem ? 'Update' : 'Tambah'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-warning bg-warning/5 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Peringatan Stok Rendah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {item.name} - Tersisa {item.currentStock} {item.unit}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRestockItem(item);
                      setIsRestockOpen(true);
                    }}
                  >
                    Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari item stok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="ingredient">Bahan Baku</SelectItem>
            <SelectItem value="beverage">Minuman</SelectItem>
            <SelectItem value="packaging">Kemasan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stock Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.currentStock, item.minStock);
          return (
            <Card key={item.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                  <Badge className={stockStatus.color}>
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Stok Saat Ini:</span>
                    <span className="font-medium">{item.currentStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stok Minimum:</span>
                    <span>{item.minStock} {item.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Harga Satuan:</span>
                    <span>{formatCurrency(item.cost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Supplier:</span>
                    <span className="text-right">{item.supplier}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => {
                      setRestockItem(item);
                      setIsRestockOpen(true);
                    }}
                  >
                    <Package className="mr-1 h-3 w-3" />
                    Restock
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Restock Dialog */}
      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock Item</DialogTitle>
          </DialogHeader>
          {restockItem && (
            <form onSubmit={handleRestock} className="space-y-4">
              <div className="space-y-2">
                <p><strong>Item:</strong> {restockItem.name}</p>
                <p><strong>Stok Saat Ini:</strong> {restockItem.currentStock} {restockItem.unit}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalStock">Tambah Stok</Label>
                <Input
                  id="additionalStock"
                  name="additionalStock"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Jumlah yang ditambahkan"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setIsRestockOpen(false);
                  setRestockItem(null);
                }}>
                  Batal
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Tambah Stok
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {filteredItems.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Tidak ada item stok ditemukan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};