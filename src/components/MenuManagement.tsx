import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'main' | 'appetizer' | 'drink';
  price: number;
  description: string;
  stock: number;
  available: boolean;
}

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Gudeg',
    category: 'main',
    price: 25000,
    description: 'Nasi gudeg khas Yogyakarta dengan ayam dan telur',
    stock: 20,
    available: true
  },
  {
    id: '2',
    name: 'Gado-gado',
    category: 'main',
    price: 20000,
    description: 'Salad Indonesia dengan saus kacang',
    stock: 15,
    available: true
  },
  {
    id: '3',
    name: 'Kerupuk Udang',
    category: 'appetizer',
    price: 8000,
    description: 'Kerupuk udang crispy',
    stock: 50,
    available: true
  },
  {
    id: '4',
    name: 'Lumpia',
    category: 'appetizer',
    price: 12000,
    description: 'Lumpia sayuran segar',
    stock: 30,
    available: true
  },
  {
    id: '5',
    name: 'Es Teh Manis',
    category: 'drink',
    price: 8000,
    description: 'Teh manis dingin segar',
    stock: 100,
    available: true
  },
  {
    id: '6',
    name: 'Jus Jeruk',
    category: 'drink',
    price: 15000,
    description: 'Jus jeruk segar tanpa pengawet',
    stock: 25,
    available: true
  }
];

export const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'main': return 'Makanan Utama';
      case 'appetizer': return 'Appetizer';
      case 'drink': return 'Minuman';
      default: return category;
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as MenuItem['category'],
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string),
      available: true
    };

    if (editingItem) {
      setMenuItems(items => items.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setMenuItems(items => [...items, newItem]);
    }

    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(items => items.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteItem = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Menu</h2>
          <p className="text-muted-foreground">Kelola menu makanan dan minuman restoran</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Menu</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  placeholder="Masukkan nama menu"
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
                    <SelectItem value="main">Makanan Utama</SelectItem>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="drink">Minuman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingItem?.price}
                  placeholder="25000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={editingItem?.stock}
                  placeholder="20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  placeholder="Deskripsi menu..."
                  rows={3}
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

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari menu..."
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
            <SelectItem value="main">Makanan Utama</SelectItem>
            <SelectItem value="appetizer">Appetizer</SelectItem>
            <SelectItem value="drink">Minuman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary">
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(item.price)}
                </span>
                <div className="text-right">
                  <p className="text-sm">Stok: {item.stock}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge 
                  variant={item.available ? "default" : "secondary"}
                  className={item.available ? "bg-success text-success-foreground" : ""}
                >
                  {item.available ? 'Tersedia' : 'Tidak Tersedia'}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleAvailability(item.id)}
                >
                  {item.available ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Tidak ada menu ditemukan</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};