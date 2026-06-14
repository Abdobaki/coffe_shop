export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  category: 'cafes' | 'boissons' | 'patisseries' | 'salades';
  price: number; // in DZD / DA
  description: string;
  descriptionAr?: string;
  image?: string;
  tag?: 'SIGNATURE' | 'FAVORI' | 'VEGAN' | 'NEW';
  customizable: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (combines itemId + selected options)
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  customizations: {
    milk?: string;
    sweetness?: string;
    extraShot?: boolean;
    toppings?: string[];
  };
  totalPrice: number;
}

export interface Reservation {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  remarks?: string;
  seatingArea: 'salle_principale' | 'jazz_corner' | 'window_view' | 'terrace';
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  rating?: number;
  date: string;
}
