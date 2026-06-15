import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  MapPin, 
  Clock, 
  Phone, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Sparkles, 
  Globe, 
  Music, 
  Heart, 
  X, 
  CheckCircle2, 
  Info, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Eye,
  Utensils,
  Leaf,
  Settings,
  Key,
  Cake,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { MENU_ITEMS, HIGHLIGHTS_IDS, DICTIONARY } from './data';
import { MenuItem, CartItem, Reservation } from './types';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Navigation & Locale state
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'admin'>('home');

  // Menu items state with local storage persistence
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('happy_space_menu_items');
    return saved ? JSON.parse(saved) : MENU_ITEMS;
  });

  // Sync menu items list to local storage
  useEffect(() => {
    localStorage.setItem('happy_space_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id'>) => {
    const createdItem: MenuItem = {
      ...newItem,
      id: `item-${Date.now()}`
    };
    setMenuItems((prev) => [...prev, createdItem]);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    // clean up from cart too if it was deleted from cart
    setCart((prev) => prev.filter((cartItem) => cartItem.menuItem.id !== id));
  };
  const [lang, setLang] = useState<'fr' | 'ar'>(() => {
    // default to 'fr' but if user environment is preferred, we can check.
    return 'fr';
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cafes' | 'boissons' | 'patisseries' | 'salades'>('all');
  const [priceRange, setPriceRange] = useState<number>(1500); // Max menu item is 1200 DA
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For lightbox
  const [selectedTag, setSelectedTag] = useState<'all' | 'SIGNATURE' | 'FAVORI' | 'VEGAN' | 'NEW'>('all');
  const [onlyCustomizable, setOnlyCustomizable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  
  // Customization Modal State
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedMilk, setSelectedMilk] = useState<string>('whole');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('normal');
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('happy_space_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [pickupTime, setPickupTime] = useState('14:00');
  const [orderSent, setOrderSent] = useState(false);
  const [sentOrderNum, setSentOrderNum] = useState('');
  const [activeOrderStep, setActiveOrderStep] = useState(0);

  // Booking (Reservation) state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  
  // Booking Form Inputs
  const [bFullName, setBFullName] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bGuests, setBGuests] = useState(2);
  const [bDate, setBDate] = useState('');
  const [bTime, setBTime] = useState('18:00');
  const [bSeatingArea, setBSeatingArea] = useState<'salle_principale' | 'jazz_corner' | 'window_view' | 'terrace'>('salle_principale');
  const [bRemarks, setBRemarks] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Local storage reservations list
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('happy_space_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  // Local storage cart synchronization
  useEffect(() => {
    localStorage.setItem('happy_space_cart', JSON.stringify(cart));
  }, [cart]);

  // Local storage reservations synchronization
  useEffect(() => {
    localStorage.setItem('happy_space_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Order status live simulation
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    if (orderSent) {
      setActiveOrderStep(1); // Preparing
      timer1 = setTimeout(() => {
        setActiveOrderStep(2); // Brewing/Plating
      }, 8000);
      timer2 = setTimeout(() => {
        setActiveOrderStep(3); // On its way to table / Ready for pickup
      }, 18000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [orderSent]);

  // Translation helpers
  const t = (key: keyof typeof DICTIONARY['fr']) => {
    return DICTIONARY[lang][key] || DICTIONARY['fr'][key];
  };

  const filterT = {
    fr: {
      tags: {
        all: 'Toutes les Spécialités',
        SIGNATURE: 'Signature',
        FAVORI: 'Favoris',
        VEGAN: 'Végétarien',
        NEW: 'Nouveau'
      },
      sort: {
        label: 'Trier par',
        default: 'Ordre classique',
        'price-asc': 'Prix croissant',
        'price-desc': 'Prix décroissant',
        popular: 'Popularité'
      },
      customizableOnly: 'Personnalisables uniquement',
      activeFilters: 'Filtres actifs',
      resultsFound: 'délices correspondants',
      clearAll: 'Vider tout',
      homeSearchHeading: 'Rechercher un délice ou une boisson'
    },
    ar: {
      tags: {
        all: 'جميع الأصناف الخاصة',
        SIGNATURE: 'توقيع الدار',
        FAVORI: 'المفضلة',
        VEGAN: 'نباتي',
        NEW: 'جديد'
      },
      sort: {
        label: 'ترتيب حسب',
        default: 'الترتيب الكلاسيكي',
        'price-asc': 'السعر: من الأقل للأعلى',
        'price-desc': 'السعر: من الأعلى للأقل',
        popular: 'الأكثر شعبية'
      },
      customizableOnly: 'قابل للتخصيص فقط',
      activeFilters: 'التصفيات النشطة',
      resultsFound: 'صنف متطابق',
      clearAll: 'مسح الكل',
      homeSearchHeading: 'ابحث عن مشروب أو حلوى...'
    }
  };

  const getLocalizedName = (item: MenuItem) => {
    return lang === 'ar' && item.nameAr ? item.nameAr : item.name;
  };

  const getLocalizedDesc = (item: MenuItem) => {
    return lang === 'ar' && item.descriptionAr ? item.descriptionAr : item.description;
  };

  const categoriesList = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'Tous' },
    { id: 'cafes', label: t('categories').cafes },
    { id: 'boissons', label: t('categories').boissons },
    { id: 'patisseries', label: t('categories').patisseries },
    { id: 'salades', label: t('categories').salades },
  ];

  // Map locations for exploration widget
  const EXCURSIONS = [
    { name: 'Université d’Alger 1', desc: '4 mins à pied', descAr: '4 دقائق سيراً ' },
    { name: 'Parc de la Liberté', desc: '10 mins à pied', descAr: '10 دقائق سيراً' },
    { name: 'Grande Poste d’Alger', desc: '8 mins à pied', descAr: '8 دقائق سيراً' },
    { name: 'Métro Station Tafourah', desc: '5 mins à pied', descAr: '5 دقائق سيراً' }
  ];

  // Interactive functions
  const handleSelectItem = (item: MenuItem) => {
    if (item.customizable) {
      setCustomizingItem(item);
      setSelectedMilk('whole');
      setSelectedSweetness('normal');
      setExtraShot(false);
      setNotes('');
    } else {
      // Add directly
      addToCartDirectly(item);
    }
  };

  const addToCartDirectly = (item: MenuItem) => {
    const cartId = `${item.id}-default`;
    const existing = cart.find(i => i.id === cartId);
    if (existing) {
      setCart(cart.map(i => i.id === cartId ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * item.price } : i));
    } else {
      setCart([...cart, {
        id: cartId,
        menuItem: item,
        quantity: 1,
        customizations: {},
        totalPrice: item.price
      }]);
    }
    showCartNotification();
  };

  const handleAddCustomized = () => {
    if (!customizingItem) return;
    
    // calculate custom additions
    let priceMultiplier = customizingItem.price;
    if (selectedMilk !== 'whole') priceMultiplier += 80; // +80 DA for plant milks
    if (extraShot) priceMultiplier += 100; // +100 DA for double shot

    const customKey = `${customizingItem.id}-${selectedMilk}-${selectedSweetness}-${extraShot ? 'extra' : 'no'}`;
    const descParts = [];
    if (selectedMilk !== 'whole') descParts.push(selectedMilk === 'oat' ? 'Lait d\'Avoine' : 'Lait d\'Amande');
    if (selectedSweetness !== 'normal') descParts.push(selectedSweetness === 'less' ? 'Moins sucré' : 'Sans sucre');
    if (extraShot) descParts.push('+Espresso');

    const notesSummary = notes ? `(${notes})` : '';

    const existing = cart.find(i => i.id === customKey);
    if (existing) {
      setCart(cart.map(i => i.id === customKey ? {
        ...i,
        quantity: i.quantity + 1,
        totalPrice: (i.quantity + 1) * priceMultiplier
      } : i));
    } else {
      setCart([...cart, {
        id: customKey,
        menuItem: customizingItem,
        quantity: 1,
        notes: notesSummary,
        customizations: {
          milk: selectedMilk,
          sweetness: selectedSweetness,
          extraShot: extraShot
        },
        totalPrice: priceMultiplier
      }]);
    }

    setCustomizingItem(null);
    showCartNotification();
  };

  const showCartNotification = () => {
    setIsCartOpen(true);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    const item = cart.find(i => i.id === cartId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== cartId));
    } else {
      const basePrice = item.totalPrice / item.quantity;
      setCart(cart.map(i => i.id === cartId ? { ...i, quantity: newQty, totalPrice: newQty * basePrice } : i));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Simulate order submission
    const orderNum = `HS-${Math.floor(1000 + Math.random() * 9000)}`;
    setSentOrderNum(orderNum);
    setOrderSent(true);
    setCart([]); // Clear cart
  };

  // Submit Reservation
  const handleReservationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!bFullName || !bPhone || !bDate) return;

    const newRes: Reservation = {
      id: `RES-${Date.now().toString().slice(-6)}`,
      fullName: bFullName,
      phone: bPhone,
      email: bEmail,
      date: bDate,
      time: bTime,
      guests: bGuests,
      remarks: bRemarks,
      seatingArea: bSeatingArea,
      status: 'confirmed', // Automated instant confirmation for smooth premium experience
      createdAt: new Date().toLocaleDateString()
    };

    setReservations([newRes, ...reservations]);
    setBookingSuccess(true);
    
    // Reset inputs
    setBFullName('');
    setBPhone('');
    setBEmail('');
    setBRemarks('');
  };

  const cancelReservation = (id: string) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const filterItems = menuItems.filter(item => {
    const matchesSearch = getLocalizedName(item).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          getLocalizedDesc(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPrice = item.price <= priceRange;
    const matchesTag = selectedTag === 'all' || item.tag === selectedTag;
    const matchesCustomizable = !onlyCustomizable || item.customizable;
    return matchesSearch && matchesCategory && matchesPrice && matchesTag && matchesCustomizable;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'popular') {
      const aVal = a.tag === 'SIGNATURE' ? 3 : a.tag === 'FAVORI' ? 2 : 0;
      const bVal = b.tag === 'SIGNATURE' ? 3 : b.tag === 'FAVORI' ? 2 : 0;
      return bVal - aVal;
    }
    return 0; // default order based on array
  });

  const highlightItems = menuItems.filter(item => HIGHLIGHTS_IDS.includes(item.id));

  // Auto scroll to target section
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen font-sans bg-[#fef9f2] text-[#1a120a] selection:bg-[#ffcea0] selection:text-[#7a5631] relative ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* Dynamic top info promo for Algerian local jazz sessions */}
      <div className="bg-[#1a120a] text-[#fef9f2] text-xs py-2 px-4 text-center border-b border-[#a07850]/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3 H-3 text-[#a07850] animate-pulse" />
        <span className="font-serif italic font-light tracking-wide text-[11px]">
          {t('jazzLiveAt')}
        </span>
      </div>

      {/* Header NavBar */}
      <header className="sticky top-0 z-40 bg-[#fef9f2]/95 backdrop-blur-md border-b border-[#d4c4a8]/30 transition-all duration-300">
        <div className="max-w-[680px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentView('home')} 
            className="cursor-pointer group flex flex-col justify-center select-none"
          >
            <h1 className="font-serif text-2xl font-light tracking-tight text-[#1a120a] transition-colors group-hover:text-[#a07850] duration-300">
              Happy Space
            </h1>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#a07850] -mt-0.5">
              Alger Centre
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-5">
            <button 
              onClick={() => { setCurrentView('home'); scrollToId('hero'); }}
              className={`text-xs uppercase tracking-widest transition-colors ${
                currentView === 'home' 
                  ? 'text-[#a07850] font-medium border-b border-[#a07850] pb-0.5' 
                  : 'text-[#4d453f] hover:text-[#1a120a]'
              }`}
            >
              {t('home')}
            </button>
            <button 
              onClick={() => setCurrentView('menu')}
              className={`text-xs uppercase tracking-widest transition-colors ${
                currentView === 'menu' 
                  ? 'text-[#a07850] font-medium border-b border-[#a07850] pb-0.5' 
                  : 'text-[#4d453f] hover:text-[#1a120a]'
              }`}
            >
              {t('menu')}
            </button>
            <button 
              onClick={() => setCurrentView('admin')}
              className={`text-xs uppercase tracking-widest transition-colors ${
                currentView === 'admin' 
                  ? 'text-[#a07850] font-semibold border-b border-[#a07850] pb-0.5' 
                  : 'text-[#4d453f] hover:text-[#1a120a]'
              }`}
              id="header-admin-nav-btn"
            >
              <Key className="w-4 h-4 inline-block mr-1" /> {lang === 'ar' ? 'الإدارة' : 'Admin'}
            </button>
          </nav>

          {/* Icon controls & Locale Selector */}
          <div className="flex items-center gap-3">
            {/* Lang Toggle */}
            <button 
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
              className="p-1.5 border border-[#d4c4a8]/50 hover:bg-[#1a120a] hover:text-[#fef9f2] transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
              title="Changer la langue / تغيير اللغة"
              id="lang-toggle"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            {/* Bookings Drawer indicator */}
            {reservations.length > 0 && (
              <button 
                onClick={() => setIsMyBookingsOpen(true)}
                className="p-2 relative hover:text-[#a07850] transition-colors flex items-center text-xs gap-1 border border-[#d4c4a8]/50 bg-white"
                title={t('viewMyBookings')}
                id="bookings-indicator"
              >
                <Calendar className="w-3.5 h-3.5 text-[#a07850]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#a07850] text-[#fef9f2] w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {reservations.filter(r => r.status === 'confirmed').length}
                </span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 bg-[#1a120a] text-[#fef9f2] hover:bg-[#a07850] transition-colors relative flex items-center justify-center cursor-pointer"
              aria-label="Voir le panier"
              id="cart-trigger"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#a07850] text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container max width 680px center align */}
      <div className="max-w-[680px] mx-auto min-h-[calc(100vh-4rem-2rem)] relative">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME LANDING VIEW */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="pb-16"
            >
              {/* Hero Section */}
              <section id="hero" className="relative h-[560px] flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-[#1a120a] mt-4 hairline-border">
                {/* Background Dim Image */}
                <div className="absolute inset-0 opacity-45 select-none pointer-events-none">
                  <img 
                    alt="Happy Space Algiers interior ambiance" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyjgJeQedw96lIwIeUzIc7sAOfhnq6KrNuGqDG9lRR1NPfSw8bsgKi-7GKtBc7mP1poZWsMQJ-4DxyZCV4QbkoDw_czKoR1haBhNMK4cIYbwvNDTmQy8J8kqOOh7zsazrDt4ItbaWbnAHu8vy01AgNFtbLReEuFrQvlays6bL5RmAGprrOHgxGJlRw4mlXInZEjme5qMiV2uf6LaKnbwrSiAaslYAvMZL7nGIQraIyqoyRcUdHn7WOgcSbz0p2IZWytokoc6ZkB5o"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a120a]/80 via-transparent to-[#1a120a]" />
                </div>

                <div className="relative z-10 px-4">
                  <span className="text-[#a07850] text-[11px] tracking-[0.25em] uppercase font-sans font-medium block mb-3">
                    ALGER CENTRE
                  </span>
                  
                  <h2 className="font-serif text-5xl md:text-6xl font-extralight text-[#fef9f2] tracking-tight leading-tight mb-4">
                    Happy Space
                  </h2>

                  <p className="font-serif italic text-base md:text-lg text-[#d4c4b6] opacity-95 mb-6 max-w-[420px] mx-auto leading-relaxed">
                    {t('subtitle')}
                  </p>

                  <div className="w-12 h-[0.5px] bg-[#a07850] mx-auto mb-6" />

                  <p className="font-sans text-[10px] tracking-[0.2em] text-[#fef9f2]/70 uppercase mb-8">
                    {t('address')}
                  </p>

                  {/* Buttons directly matching image */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => setCurrentView('menu')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#a07850]/20 hover:bg-[#a07850] border border-[#a07850] text-[#fef9f2] font-sans text-xs uppercase tracking-widest transition-all duration-300 font-light hover:text-white"
                      id="hero-menu-btn"
                    >
                      {t('viewMenu')}
                    </button>
                    <button 
                      onClick={() => scrollToId('visit')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#fef9f2] text-[#1a120a] hover:bg-[#ede5d8] border border-[#fef9f2] font-sans text-xs uppercase tracking-widest transition-all duration-300 font-medium"
                      id="hero-find-btn"
                    >
                      {t('findUs')}
                    </button>
                  </div>
                </div>
              </section>

              {/* Interactive Search & Explore Panel */}
              <section className="mt-8 px-4" id="home-search-panel">
                <div className="bg-white border border-[#d4c4a8]/50 p-6 text-center space-y-4">
                  <h3 className="font-serif text-lg text-[#1a120a] font-normal italic">
                    {filterT[lang].homeSearchHeading}
                  </h3>
                  
                  <div className="relative max-w-[480px] mx-auto">
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentView('menu');
                      }}
                      className="w-full bg-[#f8f3ec] border border-[#d4c4a8] text-xs px-4 py-3.5 pl-10 pr-10 text-[#1a120a] focus:outline-none focus:border-[#a07850] placeholder-[#7f756e] text-center"
                    />
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7f756e]" />
                    <Sparkles className="absolute right-3.5 top-3.5 w-4 h-4 text-[#a07850] animate-pulse" />
                  </div>
                  
                  {/* Quick Filters Shortcuts */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#7f756e] block mb-2 font-light">
                      {lang === 'ar' ? 'تصفية سريعة حسب الفئة والنوع' : 'Raccourcis de filtrage rapide'}
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedTag('SIGNATURE');
                          setCurrentView('menu');
                        }}
                        className="text-[9px] uppercase tracking-widest px-2.5 py-1.5 border border-[#d4c4a8]/40 hover:bg-[#1a120a] hover:text-white transition-all bg-[#fef9f2] text-[#4d453f] cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 inline-block mr-1" /> {lang === 'ar' ? 'تواقيع الدار' : 'Signatures'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedTag('FAVORI');
                          setCurrentView('menu');
                        }}
                        className="text-[9px] uppercase tracking-widest px-2.5 py-1.5 border border-[#d4c4a8]/40 hover:bg-[#1a120a] hover:text-white transition-all bg-[#fef9f2] text-[#4d453f] cursor-pointer"
                      >
                        <Heart className="w-3 h-3 inline-block mr-1" /> {lang === 'ar' ? 'المفضلة' : 'Favoris'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory('cafes');
                          setSelectedTag('all');
                          setCurrentView('menu');
                        }}
                        className="text-[9px] uppercase tracking-widest px-2.5 py-1.5 border border-[#d4c4a8]/40 hover:bg-[#1a120a] hover:text-white transition-all bg-[#fef9f2] text-[#4d453f] cursor-pointer"
                      >
                        <Coffee className="w-3 h-3 inline-block mr-1" /> {lang === 'ar' ? 'القهوة والشاي' : 'Cafés & Thés'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory('patisseries');
                          setSelectedTag('all');
                          setCurrentView('menu');
                        }}
                        className="text-[9px] uppercase tracking-widest px-2.5 py-1.5 border border-[#d4c4a8]/40 hover:bg-[#1a120a] hover:text-white transition-all bg-[#fef9f2] text-[#4d453f] cursor-pointer"
                      >
                        <Cake className="w-3 h-3 inline-block mr-1" /> {lang === 'ar' ? 'الحلويات' : 'Pâtisseries'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quote & Story Block */}
              <section className="px-6 py-12 bg-[#f8f3ec] hairline-border mt-8 text-center">
                <div className="max-w-[480px] mx-auto">
                  <blockquote className="font-serif text-2xl italic text-[#1a120a] mb-5 leading-normal max-w-[420px] mx-auto text-[#a07850]">
                    {t('quote')}
                  </blockquote>
                  
                  <div className="w-12 h-[0.5px] bg-[#d4c4a8] mx-auto mb-6" />
                  
                  <h3 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#1a120a] mb-4">
                    {t('aboutTitle')}
                  </h3>

                  <p className="font-sans font-light text-sm text-[#4d453f] leading-relaxed">
                    {t('aboutText')}
                  </p>
                </div>
              </section>

              {/* Bento styled Highlights ("Selections de la maison") */}
              <section className="px-1 mt-12">
                <div className="px-5 mb-6 text-center">
                  <h3 className="font-sans text-xs text-[#a07850] tracking-[0.3em] font-medium uppercase mb-2">
                    {t('highlightsTitle')}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#a07850] mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  {highlightItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white hairline-border p-4 flex flex-col group hover:bg-[#f8f3ec] transition-all duration-300 relative"
                    >
                      {item.tag && (
                        <span className="absolute top-6 right-6 bg-[#1a120a] text-white text-[9px] tracking-widest uppercase font-sans font-light px-2 py-0.5 z-10 border border-[#a07850]/20">
                          {item.tag}
                        </span>
                      )}

                      {/* Grayscale on hover sepia transition matching styling */}
                      {item.image && (
                        <div className="w-full aspect-square overflow-hidden mb-4 relative select-none">
                          <img 
                            src={item.image} 
                            alt={getLocalizedName(item)} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover img-sepia" 
                          />
                          {/* Soft overlay action trigger on hover */}
                          <div className="absolute inset-0 bg-[#1a120a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-3 py-1.5 bg-white/95 text-xs tracking-widest font-sans font-light uppercase border border-[#d4c4a8] shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              {item.customizable ? t('customize') : t('addToCart')}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-serif text-lg text-[#1a120a] font-normal tracking-tight">
                          {getLocalizedName(item)}
                        </h4>
                        <span className="font-serif text-base text-[#a07850] font-medium whitespace-nowrap">
                          {item.price} {t('priceDZD')}
                        </span>
                      </div>

                      <p className="font-sans font-light text-xs text-[#4d453f] leading-relaxed italic mb-4 flex-grow">
                        {getLocalizedDesc(item)}
                      </p>

                      <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#ede5d8]">
                        <button
                          onClick={() => handleSelectItem(item)}
                          className="w-full py-2 bg-[#1a120a] text-[#fef9f2] text-[11px] font-sans uppercase tracking-widest hover:bg-[#a07850] transition-colors text-center font-light cursor-pointer"
                          id={`highlight-add-${item.id}`}
                        >
                          {item.customizable ? t('customize') : t('addToCart')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Atmosphere Horizontal Scroll Gallery */}
              <section className="mt-12 bg-white py-12 border-y border-[#d4c4a8]/30">
                <div className="px-6 flex justify-between items-end mb-6">
                  <div>
                    <h3 className="font-sans text-xs text-[#a07850] tracking-[0.25em] font-medium uppercase">
                      {t('atmosphereTitle')}
                    </h3>
                    <p className="text-[10px] text-[#4d453f]/60 font-light mt-1">Slow living Alger Centre</p>
                  </div>
                  <span className="text-[11px] text-[#a07850] animate-pulse flex items-center gap-1 font-light italic">
                    {t('scrollHint')} <ChevronRight className="w-3 h-3 h-3" />
                  </span>
                </div>

                {/* Horizontal draggable style scroll */}
                <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 snap-x pb-4">
                  
                  {/* Item A */}
                  <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-[#fef9f2] p-3 border border-[#ede5d8] group">
                    <div 
                      className="w-full h-[360px] overflow-hidden mb-2 cursor-zoom-in relative select-none"
                      onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAyjgJeQedw96lIwIeUzIc7sAOfhnq6KrNuGqDG9lRR1NPfSw8bsgKi-7GKtBc7mP1poZWsMQJ-4DxyZCV4QbkoDw_czKoR1haBhNMK4cIYbwvNDTmQy8J8kqOOh7zsazrDt4ItbaWbnAHu8vy01AgNFtbLReEuFrQvlays6bL5RmAGprrOHgxGJlRw4mlXInZEjme5qMiV2uf6LaKnbwrSiAaslYAvMZL7nGIQraIyqoyRcUdHn7WOgcSbz0p2IZWytokoc6ZkB5o')}
                    >
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyjgJeQedw96lIwIeUzIc7sAOfhnq6KrNuGqDG9lRR1NPfSw8bsgKi-7GKtBc7mP1poZWsMQJ-4DxyZCV4QbkoDw_czKoR1haBhNMK4cIYbwvNDTmQy8J8kqOOh7zsazrDt4ItbaWbnAHu8vy01AgNFtbLReEuFrQvlays6bL5RmAGprrOHgxGJlRw4mlXInZEjme5qMiV2uf6LaKnbwrSiAaslYAvMZL7nGIQraIyqoyRcUdHn7WOgcSbz0p2IZWytokoc6ZkB5o" 
                        alt="Intérieur Happy Space" 
                        className="w-full h-full object-cover img-sepia group-hover:scale-105 duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 bg-[#1a120a]/80 text-[#fef9f2] text-[9px] px-2 py-1 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> zoom
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-[#1a120a] text-center mt-1">{t('interior')}</p>
                  </div>

                  {/* Item B */}
                  <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-[#fef9f2] p-3 border border-[#ede5d8] group">
                    <div 
                      className="w-full h-[360px] overflow-hidden mb-2 cursor-zoom-in relative select-none"
                      onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCTZFvLeGj3H5VawcTa3i87oUS7nbFuzWb3Hd1HtC3GDlNZhSi8QE37fjn9g2s_kANoDI3sOl54gKzMl4NiOPHbJ0_TKmNZYL6oU7LmuQkSFzXJI4xyKILXiuOU7J5iPMu9YuI4YJht7ojn9IaVPmyWj24JKQtxL6MQoP0uaoRAV-xIPfQTSlyacjns19m-T2kBNQD0UYUHSZeMuBTGQpe03KYjacQwbN3SpXd17oy1GrWXZ7ULhjGB-sqiDq-T2Q7OfGR8nkPpOW8')}
                    >
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTZFvLeGj3H5VawcTa3i87oUS7nbFuzWb3Hd1HtC3GDlNZhSi8QE37fjn9g2s_kANoDI3sOl54gKzMl4NiOPHbJ0_TKmNZYL6oU7LmuQkSFzXJI4xyKILXiuOU7J5iPMu9YuI4YJht7ojn9IaVPmyWj24JKQtxL6MQoP0uaoRAV-xIPfQTSlyacjns19m-T2kBNQD0UYUHSZeMuBTGQpe03KYjacQwbN3SpXd17oy1GrWXZ7ULhjGB-sqiDq-T2Q7OfGR8nkPpOW8" 
                        alt="Barista Coffee Art" 
                        className="w-full h-full object-cover img-sepia group-hover:scale-105 duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 bg-[#1a120a]/80 text-[#fef9f2] text-[9px] px-2 py-1 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> zoom
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-[#1a120a] text-center mt-1">{t('ourCoffee')}</p>
                  </div>

                  {/* Item C */}
                  <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-[#fef9f2] p-3 border border-[#ede5d8] group">
                    <div 
                      className="w-full h-[360px] overflow-hidden mb-2 cursor-zoom-in relative select-none"
                      onClick={() => setSelectedImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAZXzpMK9pGUj757ys-ASmoE_q-KTSSJjaE2zTN0CkW1Lq3cD3u_oW5_tNyeWVg9etEhu7V4o6H058H5bU9mRS0Ieatbjxt7GWAR33h6vlac0DxBIN7GhzQYR3QWRG8pTpbC3BfO-Oe3kkEUd_rCuFGYYsBkSindq8sVogfShU7eWzYGb_hoEoPWjWwObEVj4H2-DnswMVcZHNHrmM8xNrRsEDt_0-OdQrD-atoYg5XohvDsjAIVuRq6-sWVGqQsaeGHuPUkipM2pc')}
                    >
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZXzpMK9pGUj757ys-ASmoE_q-KTSSJjaE2zTN0CkW1Lq3cD3u_oW5_tNyeWVg9etEhu7V4o6H058H5bU9mRS0Ieatbjxt7GWAR33h6vlac0DxBIN7GhzQYR3QWRG8pTpbC3BfO-Oe3kkEUd_rCuFGYYsBkSindq8sVogfShU7eWzYGb_hoEoPWjWwObEVj4H2-DnswMVcZHNHrmM8xNrRsEDt_0-OdQrD-atoYg5XohvDsjAIVuRq6-sWVGqQsaeGHuPUkipM2pc" 
                        alt="Pastries and tarts Algiers" 
                        className="w-full h-full object-cover img-sepia group-hover:scale-105 duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 bg-[#1a120a]/80 text-[#fef9f2] text-[9px] px-2 py-1 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> zoom
                      </span>
                    </div>
                    <p className="font-serif italic text-xs text-[#1a120a] text-center mt-1">{t('ourPâtisserie')}</p>
                  </div>

                </div>
              </section>

              {/* Reasons list / Why Us */}
              <section className="px-4 mt-12">
                <div className="bg-[#1a120a] text-[#fef9f2] p-8 mt-2 border border-[#a07850]/40">
                  <h3 className="font-serif text-2xl text-center text-[#f1dfd1] mb-8 font-light">
                    {t('whyTitle')}
                  </h3>

                  <div className="space-y-6 max-w-[440px] mx-auto">
                    {t('reasons').map((b, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-start gap-4 py-2 group">
                          <div className="p-1.5 border border-[#a07850]/40 text-[#ede1cf] bg-[#231a12] group-hover:bg-[#a07850] group-hover:text-white transition-all duration-300">
                            {/* Simple inline icon logic in case lucide keys match */}
                            {i === 0 ? <Music className="w-4 h-4 text-[#a07850]" /> : 
                             i === 1 ? <Sparkles className="w-4 h-4 text-[#a07850]" /> :
                             i === 2 ? <Coffee className="w-4 h-4 text-[#a07850]" /> :
                             i === 3 ? <BookOpen className="w-4 h-4 text-[#a07850]" /> :
                             <Heart className="w-4 h-4 text-[#a07850]" />}
                          </div>
                          
                          <p className="font-sans font-light text-sm text-[#fef9f2]/90 leading-relaxed pt-1 select-none">
                            {b.text}
                          </p>
                        </div>
                        {i < t('reasons').length - 1 && (
                          <div className="h-[0.5px] bg-[#d4c4b6]/20 mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Visit / Map details & Reservation */}
              <section id="visit" className="px-4 mt-12 py-12 bg-[#f8f3ec] hairline-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  
                  {/* Text columns & Contact numbers */}
                  <div className="flex flex-col justify-center h-full">
                    <h3 className="font-serif text-3xl font-light text-[#1a120a] mb-6">
                      {t('comeVisitUs')}
                    </h3>

                    <div className="space-y-4 font-sans text-sm font-light text-[#4d453f] mb-8">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#a07850]" />
                        <span>15 Rue Didouche Mourad, Alger Centre</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-[#a07850]" />
                        <span>{t('openingHours')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#a07850]" />
                        <span className="ltr">{t('phoneNumber')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#1a120a] text-white hover:bg-[#a07850] transition-all font-sans text-xs uppercase tracking-widest font-light text-center cursor-pointer"
                      id="reservations-btn"
                    >
                      {t('bookingBtn')}
                    </button>
                  </div>

                  {/* Creative Interactive Map widget */}
                  <div className="h-[280px] bg-white border border-[#d4c4a8] relative overflow-hidden select-none">
                    
                    {/* Retro Algiers map layout simulation */}
                    <div className="absolute inset-0 bg-[#fbf8f3] opacity-90 p-4 font-mono text-[9px] text-[#7f756e] flex flex-col justify-between">
                      {/* Grid lines layout */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(ellipse at center, #a07850 1px, transparent 1px)',
                        backgroundSize: '16px 16px'
                      }} />

                      {/* Landmarks */}
                      <div className="absolute top-8 left-12 p-1 border border-[#a07850]/40 bg-white">
                        <span className="font-bold text-[#1a120a]">RUE DIDOUCHE MOURAD</span>
                      </div>
                      
                      {/* Animated center pin for Happy Space */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="relative">
                          <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#a07850]/30 animate-ping" />
                          <div className="w-4 h-4 rounded-full bg-[#1a120a] border-2 border-[#a07850] flex items-center justify-center relative">
                            <Coffee className="w-2 h-2 text-[#a07850]" />
                          </div>
                        </div>
                        <span className="mt-1 bg-[#1a120a] text-[#fef9f2] text-[8px] tracking-widest uppercase px-1.5 py-0.5 select-none font-sans whitespace-nowrap">
                          Happy Space
                        </span>
                      </div>

                      <div className="absolute bottom-16 right-8 p-1 border border-[#a07850]/40 bg-white">
                        <span>Place Audin</span>
                      </div>

                      {/* Map info bar */}
                      <div className="w-full bg-[#1a120a] text-[#fef9f2] text-[10px] p-2 flex items-center justify-between z-10 mt-auto">
                        <span className="font-sans uppercase tracking-widest text-[#a07850]">
                          {t('exploreAlgiers')}
                        </span>
                        <span>ALGER, DZ</span>
                      </div>
                    </div>

                    {/* Surrounding Tourist spot list buttons that are totally clickable! */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-1">
                      <span className="text-[8px] text-[#a07850] font-bold uppercase tracking-wider">Lieux phares</span>
                      {EXCURSIONS.slice(0, 2).map((loc, i) => (
                        <div 
                          key={i}
                          className="bg-[#fef9f2]/95 border border-[#d4c4a8] text-[9px] px-1.5 py-0.5 whitespace-nowrap hover:bg-[#1a120a] hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="font-sans font-medium">{loc.name}</span>
                          <span className="block text-[#a07850] text-[7px]" style={{ direction: 'ltr' }}>{lang === 'ar' && loc.descAr ? loc.descAr : loc.desc}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: DETAILED MENU WITH SELECTION */}
          {currentView === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="px-4 py-8"
            >
              <div className="mb-6 flex items-center justify-between border-b border-[#ede5d8] pb-4">
                <button 
                  onClick={() => setCurrentView('home')}
                  className="font-sans text-xs text-[#a07850] hover:text-[#1a120a] transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                  style={{ direction: 'ltr' }}
                >
                  {t('backToHome')}
                </button>
                <div className="text-right">
                  <h3 className="font-serif text-2xl text-[#1a120a] italic font-light">
                    {lang === 'ar' ? 'البطاقة الكاملة' : 'La Carte'}
                  </h3>
                  <p className="text-[10px] text-[#a07850] tracking-widest uppercase">Happy Space Algiers</p>
                </div>
              </div>

              {/* Search input and advanced price slider for outstanding usability */}
              <div className="mb-8 space-y-4">
                {/* Search query field with real-time feedback */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-[#f8f3ec] border border-[#d4c4a8] text-xs px-4 py-3.5 pl-10 pr-10 text-[#1a120a] focus:outline-none focus:border-[#a07850] placeholder-[#7f756e]"
                    style={{ direction: 'inherit' }}
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#7f756e]" />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-3.5 text-xs text-[#7f756e] hover:text-black font-semibold cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories Horizontal Carousel */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#7f756e] select-none font-medium block">
                    {lang === 'ar' ? 'تصنيف المأكولات والمشروبات' : 'Catégories principali'}
                  </span>
                  <div className="overflow-x-auto hide-scrollbar -mx-2 px-1">
                    <div className="flex gap-1.5 whitespace-nowrap">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`text-[10px] tracking-wider uppercase px-4 py-2.5 border transition-all duration-300 font-sans cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-[#1a120a] text-white border-[#1a120a]'
                              : 'bg-white text-[#4d453f] border-[#d4c4a8]/50 hover:bg-[#f8f3ec]'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Advanced Filtering Options: Specialty Tags & Sort Dropdowns side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Specialty tag picker */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#7f756e] select-none font-medium block">
                      {lang === 'ar' ? 'النوعية الخاصة بالصنف' : 'Spécialités de la maison'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['all', 'SIGNATURE', 'FAVORI', 'VEGAN', 'NEW'] as const).map((tagKey) => (
                        <button
                          key={tagKey}
                          onClick={() => setSelectedTag(tagKey)}
                          className={`text-[9px] uppercase tracking-wider px-2.5 py-1.5 border transition-all duration-300 font-sans cursor-pointer ${
                            selectedTag === tagKey
                              ? 'bg-[#a07850] text-[#fef9f2] border-[#a07850]'
                              : 'bg-white text-[#4d453f] border-[#ede5d8] hover:bg-[#f8f3ec]'
                          }`}
                        >
                          {filterT[lang].tags[tagKey]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorter and Customizability block */}
                  <div className="space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-[#7f756e] select-none font-medium block mb-1">
                        {filterT[lang].sort.label}
                      </span>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full bg-white border border-[#d4c4a8]/70 text-[11px] uppercase tracking-wider px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850] rounded-none cursor-pointer appearance-none"
                          aria-label="Trier la liste"
                        >
                          <option value="default">{filterT[lang].sort.default}</option>
                          <option value="price-asc">{filterT[lang].sort['price-asc']}</option>
                          <option value="price-desc">{filterT[lang].sort['price-desc']}</option>
                          <option value="popular">{filterT[lang].sort.popular}</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#7f756e]">
                          <ChevronRight className="w-3.5 h-3.5 transform rotate-90" />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
                      <input
                        type="checkbox"
                        checked={onlyCustomizable}
                        onChange={(e) => setOnlyCustomizable(e.target.checked)}
                        className="rounded-none border-[#d4c4a8] text-[#1a120a] focus:ring-0 cursor-pointer accent-[#1a120a] w-3.5 h-3.5"
                      />
                      <span className="text-[10px] uppercase tracking-wider text-[#4d453f] font-light">
                        {filterT[lang].customizableOnly}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Price budget slider */}
                <div className="bg-[#f8f3ec]/60 px-4 py-3 border border-[#d4c4a8]/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#7f756e] select-none font-medium">
                    {lang === 'ar' ? 'السعر الأقصى المحدد' : 'Budget maximum'}: <strong className="text-[#1a120a]">{priceRange} DA</strong>
                  </span>
                  <input 
                    type="range" 
                    min="250" 
                    max="1500" 
                    step="50"
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="flex-grow accent-[#1a120a] h-1" 
                    aria-label="Price range filter"
                  />
                </div>

                {/* ACTIVE FILTER BADGES OR SUMMARY */}
                {(searchQuery !== '' || selectedCategory !== 'all' || selectedTag !== 'all' || onlyCustomizable || priceRange < 1500) && (
                  <div className="bg-[#fef9f2] p-3 border border-[#ede5d8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#a07850] font-semibold">
                        {filterT[lang].activeFilters}:
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setSelectedTag('all');
                          setOnlyCustomizable(false);
                          setPriceRange(1500);
                          setSortBy('default');
                        }}
                        className="text-[9px] uppercase tracking-wider text-[#7f756e] hover:text-[#1a120a] underline cursor-pointer"
                      >
                        {filterT[lang].clearAll}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {searchQuery !== '' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#f8f3ec] border border-[#d4c4a8] text-[9.5px] px-2 py-1 text-[#1a120a]">
                          <span>{lang === 'ar' ? `بحث: ${searchQuery}` : `Keyword: ${searchQuery}`}</span>
                          <X className="w-2.5 h-2.5 cursor-pointer text-[#7f756e] hover:text-[#1a120a]" onClick={() => setSearchQuery('')} />
                        </span>
                      )}

                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#f8f3ec] border border-[#d4c4a8] text-[9.5px] px-2 py-1 text-[#1a120a]">
                          <span>{lang === 'ar' ? `تصنيف: ${categoriesList.find(c => c.id === selectedCategory)?.label}` : `Catégorie: ${categoriesList.find(c => c.id === selectedCategory)?.label}`}</span>
                          <X className="w-2.5 h-2.5 cursor-pointer text-[#7f756e] hover:text-[#1a120a]" onClick={() => setSelectedCategory('all')} />
                        </span>
                      )}

                      {selectedTag !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 bg-[#f8f3ec] border border-[#d4c4a8] text-[9.5px] px-2 py-1 text-[#1a120a]">
                          <span>{filterT[lang].tags[selectedTag]}</span>
                          <X className="w-2.5 h-2.5 cursor-pointer text-[#7f756e] hover:text-[#1a120a]" onClick={() => setSelectedTag('all')} />
                        </span>
                      )}

                      {onlyCustomizable && (
                        <span className="inline-flex items-center gap-1.5 bg-[#f8f3ec] border border-[#d4c4a8] text-[9.5px] px-2 py-1 text-[#1a120a]">
                          <span className="flex items-center gap-1"><Settings className="w-3 h-3" /> {lang === 'ar' ? 'قابل للتخصيص' : 'Personnalisable'}</span>
                          <X className="w-2.5 h-2.5 cursor-pointer text-[#7f756e] hover:text-[#1a120a]" onClick={() => setOnlyCustomizable(false)} />
                        </span>
                      )}

                      {priceRange < 1500 && (
                        <span className="inline-flex items-center gap-1.5 bg-[#f8f3ec] border border-[#d4c4a8] text-[9.5px] px-2 py-1 text-[#1a120a]">
                          <span>Budget ≤ {priceRange} DA</span>
                          <X className="w-2.5 h-2.5 cursor-pointer text-[#7f756e] hover:text-[#1a120a]" onClick={() => setPriceRange(1500)} />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic filtered results */}
              <div className="space-y-8">
                {filterItems.length === 0 ? (
                  <div className="text-center py-12 border border-[#d4c4a8]/30 bg-white">
                    <p className="text-sm font-light text-[#7f756e] italic">
                      {lang === 'ar' ? 'عذراً، لم نعثر على أي نتائج تناسب تصفيتك الحالية.' : 'Aucun produit ne correspond à vos critères de recherche.'}
                    </p>
                    <button 
                      onClick={() => { 
                        setSearchQuery(''); 
                        setSelectedCategory('all'); 
                        setPriceRange(1500); 
                        setSelectedTag('all');
                        setOnlyCustomizable(false);
                        setSortBy('default');
                      }}
                      className="mt-4 text-xs tracking-widest uppercase border-b border-[#1a120a] pb-0.5 text-[#1a120a] font-medium cursor-pointer"
                    >
                      {lang === 'ar' ? 'إعادة ضبط كل المصافي' : 'Réinitialiser tous les filtres'}
                    </button>
                  </div>
                ) : (sortBy !== 'default' || selectedTag !== 'all' || searchQuery !== '') ? (
                  // Unified flat results display when active query / sorting is selected for premium layout behavior
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#ede5d8] pb-2">
                      <span className="font-serif text-sm italic text-[#1a120a]">
                        {lang === 'ar' 
                          ? `كافة النتائج المطابقة (${filterItems.length} صنف)` 
                          : `Tous les résultats filtrés (${filterItems.length} délices trouvés)`}
                      </span>
                      <span className="text-[10px] font-sans text-[#a07850] bg-[#a07850]/10 px-2 py-0.5 uppercase tracking-wide">
                        {sortBy === 'price-asc' ? (lang === 'ar' ? 'السعر كصاعد ↗' : 'Prix croissant') :
                         sortBy === 'price-desc' ? (lang === 'ar' ? 'السعر كنازل ↘' : 'Prix décroissant') :
                         sortBy === 'popular' ? (lang === 'ar' ? 'الأكثر تميزاً ⭐' : 'Par popularité') :
                         (lang === 'ar' ? 'نتائج مفصلة' : 'Recherche active')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filterItems.map((item) => (
                        <div 
                          key={item.id}
                          className="bg-white border border-[#d4c4a8]/50 p-4 hover:border-[#a07850] transition-colors flex flex-col justify-between group h-full"
                        >
                          <div className="space-y-2">
                            {item.image ? (
                              <div className="w-full aspect-square overflow-hidden select-none relative mb-2">
                                {item.tag && (
                                  <span className="absolute top-2 right-2 bg-[#1a120a] text-white text-[8px] tracking-widest px-1.5 py-0.5 z-10">
                                    {item.tag}
                                  </span>
                                )}
                                <img 
                                  src={item.image} 
                                  alt={getLocalizedName(item)} 
                                  className="w-full h-full object-cover img-sepia" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              // elegant text header with dots
                              <div className="flex justify-between items-baseline pt-1">
                                <span className="font-serif text-base text-[#1a120a] font-normal">
                                  {getLocalizedName(item)}
                                </span>
                                <div className="flex-grow border-b border-dotted border-[#d4c4a8] mx-2" />
                                <span className="font-serif text-base text-[#a07850] font-medium whitespace-nowrap">
                                  {item.price} {t('priceDZD')}
                                </span>
                              </div>
                            )}

                            {item.image && (
                              <div className="flex justify-between items-baseline">
                                <span className="font-serif text-base text-[#1a120a] font-normal">
                                  {getLocalizedName(item)}
                                </span>
                                <span className="font-serif text-base text-[#a07850] font-medium whitespace-nowrap">
                                  {item.price} {t('priceDZD')}
                                </span>
                              </div>
                            )}

                            <p className="text-xs text-[#4d453f] font-light leading-relaxed italic">
                              {getLocalizedDesc(item)}
                            </p>
                          </div>

                          <div className="pt-4 mt-3 border-t border-[#ede5d8] flex justify-between items-center">
                            {item.customizable && (
                              <span className="text-[9px] text-[#a07850] uppercase tracking-wider font-light">
                                {lang === 'ar' ? 'قابل للتخصيص' : 'Personnalisable'}
                              </span>
                            )}
                            <button
                              onClick={() => handleSelectItem(item)}
                              className="ml-auto px-4 py-1.5 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-[10px] tracking-widest uppercase font-sans font-light transition-all cursor-pointer"
                              id={`menu-add-${item.id}`}
                            >
                              {item.customizable ? t('customize') : t('addToCart')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Traditional categorised view
                  categoriesList.filter(c => c.id !== 'all').map((cat) => {
                    const itemsInCat = filterItems.filter(item => item.category === cat.id);
                    if (itemsInCat.length === 0) return null;

                    return (
                      <div key={cat.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-xl italic text-[#1a120a] tracking-normal">
                            {cat.label}
                          </h4>
                          <span className="text-[10px] font-sans text-[#a07850] bg-[#a07850]/10 px-2 py-0.5 uppercase tracking-wide">
                            {itemsInCat.length}
                          </span>
                        </div>

                        {/* Bento Menu Design Elements combined with detailed list view */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {itemsInCat.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-white border border-[#d4c4a8]/50 p-4 hover:border-[#a07850] transition-colors flex flex-col justify-between group h-full"
                            >
                              <div className="space-y-2">
                                {item.image ? (
                                  <div className="w-full aspect-square overflow-hidden select-none relative mb-2">
                                    {item.tag && (
                                      <span className="absolute top-2 right-2 bg-[#1a120a] text-white text-[8px] tracking-widest px-1.5 py-0.5 z-10">
                                        {item.tag}
                                      </span>
                                    )}
                                    <img 
                                      src={item.image} 
                                      alt={getLocalizedName(item)} 
                                      className="w-full h-full object-cover img-sepia" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ) : (
                                  // elegant text header with dots
                                  <div className="flex justify-between items-baseline pt-1">
                                    <span className="font-serif text-base text-[#1a120a] font-normal">
                                      {getLocalizedName(item)}
                                    </span>
                                    <div className="flex-grow border-b border-dotted border-[#d4c4a8] mx-2" />
                                    <span className="font-serif text-base text-[#a07850] font-medium whitespace-nowrap">
                                      {item.price} {t('priceDZD')}
                                    </span>
                                  </div>
                                )}

                                {item.image && (
                                  <div className="flex justify-between items-baseline">
                                    <span className="font-serif text-base text-[#1a120a] font-normal">
                                      {getLocalizedName(item)}
                                    </span>
                                    <span className="font-serif text-base text-[#a07850] font-medium whitespace-nowrap">
                                      {item.price} {t('priceDZD')}
                                    </span>
                                  </div>
                                )}

                                <p className="text-xs text-[#4d453f] font-light leading-relaxed italic">
                                  {getLocalizedDesc(item)}
                                </p>
                              </div>

                              <div className="pt-4 mt-3 border-t border-[#ede5d8] flex justify-between items-center">
                                {item.customizable && (
                                  <span className="text-[9px] text-[#a07850] uppercase tracking-wider font-light">
                                    {lang === 'ar' ? 'قابل للتخصيص' : 'Personnalisable'}
                                  </span>
                                )}
                                <button
                                  onClick={() => handleSelectItem(item)}
                                  className="ml-auto px-4 py-1.5 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-[10px] tracking-widest uppercase font-sans font-light transition-all cursor-pointer"
                                  id={`menu-add-${item.id}`}
                                >
                                  {item.customizable ? t('customize') : t('addToCart')}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-16 text-center text-[11px] text-[#4d453f] border-t border-[#ede5d8] pt-8 font-light italic">
                {t('allPricesExplanation')}
              </div>
            </motion.div>
          )}

          {currentView === 'admin' && (
            <AdminPanel 
              lang={lang}
              menuItems={menuItems}
              onAddItem={handleAddMenuItem}
              onDeleteItem={handleDeleteMenuItem}
              onBackToHome={() => setCurrentView('home')}
            />
          )}

        </AnimatePresence>
      </div>

      {/* Footer Area with clear classic alignments */}
      <footer className="bg-[#1a120a] text-[#fef9f2] mt-16 border-t border-[#a07850]/20 py-12">
        <div className="max-w-[680px] mx-auto px-6 text-center space-y-6">
          <h2 className="font-serif text-2xl font-light text-[#f1dfd1] tracking-wide select-none">
            Happy Space
          </h2>
          
          <div className="flex gap-6 justify-center items-center">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#fef9f2]/70 hover:text-white font-sans text-xs select-none hover:underline"
              referrerPolicy="no-referrer"
            >
              Instagram
            </a>
            <span className="text-[#a07850]/50">•</span>
            <a 
              href="mailto:contact@happyspacealgiers.com" 
              className="text-[#fef9f2]/70 hover:text-white font-sans text-xs select-none hover:underline"
            >
              Contact
            </a>
            <span className="text-[#a07850]/50">•</span>
            <button 
              onClick={() => { setCurrentView('home'); setTimeout(() => scrollToId('visit'), 100); }}
              className="text-[#fef9f2]/70 hover:text-white font-sans text-xs select-none hover:underline"
            >
              Location
            </button>
            <span className="text-[#a07850]/50">•</span>
            <button 
              onClick={() => setIsMyBookingsOpen(true)}
              className="text-[#fef9f2]/70 hover:text-white font-sans text-xs select-none hover:underline"
            >
              {t('myBookings')}
            </button>
            <span className="text-[#a07850]/50">•</span>
            <button 
              onClick={() => setCurrentView('admin')}
              className="text-[#fef9f2]/70 hover:text-white font-sans text-xs select-none hover:underline"
              id="footer-admin-btn"
            >
              <Key className="w-4 h-4 inline-block mr-1" /> {lang === 'ar' ? 'لوحة التحكم' : 'Espace Gestion'}
            </button>
          </div>

          <div className="w-8 h-[0.5px] bg-[#a07850] mx-auto" />

          <p className="text-[10px] text-[#fef9f2]/50 font-light select-none">
            © {new Date().getFullYear()} Happy Space Algiers. {t('allRightsReserved')}
          </p>
        </div>
      </footer>

      {/* ----------------- MODALS & DRAWERS ----------------- */}

      {/* 1. CUSTOMIZATION POPUP MODAL */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingItem(null)}
              className="absolute inset-0 bg-[#1a120a]/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#fef9f2] w-full max-w-[420px] hairline-border p-6 relative z-10"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            >
              <button 
                onClick={() => setCustomizingItem(null)}
                className="absolute top-4 right-4 p-1 hover:text-[#a07850] transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#a07850] font-bold">
                  {t('customize')}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1a120a] mt-1">
                  {getLocalizedName(customizingItem)}
                </h3>
                <p className="text-xs text-[#7f756e] font-light mt-1">
                  {getLocalizedDesc(customizingItem)}
                </p>
              </div>

              {/* Dynamic drink additions options */}
              <div className="space-y-5 my-6 text-sm">
                
                {/* A. Milk Choice */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#7f756e] mb-2 font-bold">{t('milkOption')}</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="milk" 
                        value="whole" 
                        checked={selectedMilk === 'whole'}
                        onChange={() => setSelectedMilk('whole')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('optionsLabelWhole')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="milk" 
                        value="oat" 
                        checked={selectedMilk === 'oat'}
                        onChange={() => setSelectedMilk('oat')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('optionsLabelOat')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="milk" 
                        value="almond" 
                        checked={selectedMilk === 'almond'}
                        onChange={() => setSelectedMilk('almond')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('optionsLabelAlmond')}</span>
                    </label>
                  </div>
                </div>

                {/* B. Sweetness Level */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#7f756e] mb-2 font-bold">{t('sweetnessOption')}</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="sweetness" 
                        value="normal" 
                        checked={selectedSweetness === 'normal'}
                        onChange={() => setSelectedSweetness('normal')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('sweetnessNormal')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="sweetness" 
                        value="less" 
                        checked={selectedSweetness === 'less'}
                        onChange={() => setSelectedSweetness('less')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('sweetnessLess')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                      <input 
                        type="radio" 
                        name="sweetness" 
                        value="none" 
                        checked={selectedSweetness === 'none'}
                        onChange={() => setSelectedSweetness('none')}
                        className="accent-[#1a120a]" 
                      />
                      <span>{t('sweetnessNone')}</span>
                    </label>
                  </div>
                </div>

                {/* C. Extras (Double Shot) */}
                <div className="pt-2 border-t border-[#ede5d8]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-light">
                    <input 
                      type="checkbox"
                      checked={extraShot}
                      onChange={(e) => setExtraShot(e.target.checked)}
                      className="accent-[#1a120a]"
                      id="extra-shot-checkbox"
                    />
                    <span>{t('extraShotOption')}</span>
                  </label>
                </div>

                {/* D. Remarks text */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#7f756e] mb-1 font-bold">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    className="w-full bg-white border border-[#d4c4a8]/50 text-xs p-2 text-[#1a120a] focus:outline-none focus:border-[#a07850] h-12"
                  />
                </div>

              </div>

              {/* Dynamic total price shown on popup */}
              <div className="flex items-center justify-between pt-4 border-t border-[#ede5d8]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#7f756e] block">{t('totalPrice')}</span>
                  <span className="font-serif text-xl text-[#a07850] font-bold">
                    {customizingItem.price + (selectedMilk !== 'whole' ? 80 : 0) + (extraShot ? 100 : 0)} DA
                  </span>
                </div>
                <button
                  onClick={handleAddCustomized}
                  className="px-6 py-2.5 bg-[#a07850] hover:bg-[#1a120a] text-white text-xs uppercase tracking-widest font-light transition-colors cursor-pointer"
                  id="confirm-custom-btn"
                >
                  {t('addToCart')}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SHOPPING CART DRAWER PANEL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCartOpen(false); setOrderSent(false); }}
              className="absolute inset-0 bg-[#1a120a]/80 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-[#fef9f2] w-full max-w-[440px] h-full shadow-2xl relative z-10 flex flex-col border-l border-[#d4c4a8]/40"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-[#ede5d8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#a07850]" />
                  <h3 className="font-serif text-xl font-light text-[#1a120a]">
                    {t('cartTitle')}
                  </h3>
                  <span className="text-xs bg-[#a07850]/20 text-[#a07850] px-2 py-0.5 font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setOrderSent(false); }}
                  className="p-1 hover:text-[#a07850] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                
                {/* Placed order progression status tracking */}
                {orderSent ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-[#a07850]/10 text-[#a07850] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif text-xl font-normal text-[#1a120a]">
                      {t('cartSuccess')}
                    </h4>
                    <p className="text-xs text-[#7f756e] font-light">
                      {t('orderPlaced')} <strong className="text-amber-800">{sentOrderNum}</strong>
                    </p>

                    {/* Step progression visually represented */}
                    <div className="bg-[#f8f3ec] p-4 border border-[#d4c4a8]/30 space-y-3 mt-6 text-left" style={{ direction: 'ltr' }}>
                      <span className="text-[9px] uppercase tracking-widest text-[#a07850] font-bold block mb-1">
                        Suivi en direct de votre table :
                      </span>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeOrderStep >= 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
                        <span className={activeOrderStep === 1 ? 'font-bold' : 'font-light'}>
                          1. Commande reçue au bar
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeOrderStep >= 2 ? 'bg-green-600 animate-ping' : 'bg-gray-300'}`} />
                        <span className={activeOrderStep === 2 ? 'font-bold text-amber-700' : 'font-light'}>
                          2. Préparation artisanale (Infusion/Montage)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2.5 h-2.5 rounded-full ${activeOrderStep >= 3 ? 'bg-green-600' : 'bg-gray-200'}`} />
                        <span className={activeOrderStep === 3 ? 'font-bold text-green-700' : 'font-light'}>
                          3. Servie avec le sourire !
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setOrderSent(false); setIsCartOpen(false); }}
                      className="w-full py-3 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-xs uppercase tracking-widest font-light transition-all cursor-pointer"
                    >
                      {t('close')}
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Coffee className="w-12 h-12 text-[#d4c4a8] mx-auto opacity-60" />
                    <p className="text-xs text-[#7f756e] font-light max-w-[240px] mx-auto italic">
                      {t('cartEmpty')}
                    </p>
                    <button 
                      onClick={() => { setIsCartOpen(false); setCurrentView('menu'); }}
                      className="text-xs uppercase tracking-widest text-[#a07850] font-semibold underline"
                    >
                      {t('viewMenu')}
                    </button>
                  </div>
                ) : (
                  // Items List in cart
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white border border-[#d4c4a8]/35 p-3 flex gap-3 relative hover:border-[#a07850] transition-colors"
                      >
                        <div className="flex-grow space-y-1">
                          <h4 className="text-xs font-medium text-[#1a120a] font-serif">
                            {getLocalizedName(item.menuItem)}
                          </h4>
                          
                          {item.notes && (
                            <span className="block text-[10px] text-[#a07850] italic">
                              {item.notes}
                            </span>
                          )}

                          <span className="block text-xs font-semibold text-[#a07850]">
                            {item.totalPrice} DA
                          </span>
                        </div>

                        {/* Quantity adjust counters */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#f8f3ec] text-[#4d453f] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-medium min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#f8f3ec] text-[#4d453f] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Cart Footer order setup form */}
              {cart.length > 0 && !orderSent && (
                <div className="p-6 bg-[#f8f3ec] border-t border-[#ede5d8] space-y-4">
                  <form onSubmit={handleCheckout} className="space-y-3">
                    
                    {/* Setup table or takeaway selection */}
                    <div className="flex items-center gap-4 py-1 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer font-light">
                        <input
                          type="radio"
                          name="serving"
                          checked={!isTakeaway}
                          onChange={() => setIsTakeaway(false)}
                          className="accent-[#1a120a]"
                        />
                        <span>{t('servingTypeTable')}</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-light">
                        <input
                          type="radio"
                          name="serving"
                          checked={isTakeaway}
                          onChange={() => setIsTakeaway(true)}
                          className="accent-[#1a120a]"
                        />
                        <span>{t('servingTypeTakeaway')}</span>
                      </label>
                    </div>

                    {!isTakeaway ? (
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[#a07850] font-bold">
                          {t('cartTableNum')}
                        </label>
                        <input
                          type="text"
                          required
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder={t('tablePlaceholder')}
                          className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="block text-[9px] uppercase tracking-wider text-[#a07850] font-bold">
                          {lang === 'ar' ? 'ساعة الاستلام' : 'Heure de retrait'}
                        </label>
                        <input
                          type="time"
                          required
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                        />
                      </div>
                    )}

                    <div className="border-t border-[#ede5d8]/60 my-2 pt-2 flex justify-between items-baseline text-sm">
                      <span className="font-serif italic font-light text-[#1a120a]">{t('total')}</span>
                      <span className="font-serif text-lg text-[#a07850] font-bold">
                        {getCartTotal()} DZD
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-xs uppercase tracking-widest font-light transition-all uppercase cursor-pointer"
                      id="checkout-btn"
                    >
                      {t('orderNow')}
                    </button>
                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. TABLE RESERVATION FORM MODAL */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsBookingOpen(false); setBookingSuccess(false); }}
              className="absolute inset-0 bg-[#1a120a]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#fef9f2] w-full max-w-[460px] hairline-border p-6 relative z-10 max-h-[90vh] overflow-y-auto"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            >
              <button 
                onClick={() => { setIsBookingOpen(false); setBookingSuccess(false); }}
                className="absolute top-4 right-4 p-1 hover:text-[#a07850] transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#a07850] font-bold">
                  {t('bookingTitle')}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1a120a] mt-1">
                  Table d’Hôtes & Jazz
                </h3>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-green-55 border border-[#a07850] rounded-full flex items-center justify-center mx-auto text-[#a07850]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg text-[#1a120a]">
                    {t('bookingSuccess')}
                  </h4>
                  <p className="text-xs text-[#7f756e] font-light">
                    {t('bookingUnderReview')}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => { setIsBookingOpen(false); setBookingSuccess(false); }}
                      className="px-6 py-2 bg-[#1a120a] text-white text-xs uppercase tracking-widest font-light hover:bg-[#a07850] transition-colors cursor-pointer"
                    >
                      {t('close')}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={bFullName}
                      onChange={(e) => setBFullName(e.target.value)}
                      placeholder="Ex: Yacine Bencherif"
                      className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                      {t('phoneNumberLabel')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bPhone}
                      onChange={(e) => setBPhone(e.target.value)}
                      placeholder="Ex: +213 555 12 34 56"
                      className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                      style={{ direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }}
                    />
                  </div>

                  {/* Row Guests / Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                        {t('guestsNumber')}
                      </label>
                      <select
                        value={bGuests}
                        onChange={(e) => setBGuests(Number(e.target.value))}
                        className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                        aria-label="Guests selector"
                      >
                        {[1, 2, 3, 4, 5, 6, 8].map(n => (
                          <option key={n} value={n}>{n} {n > 1 ? (lang === 'ar' ? 'أفراد' : 'personnes') : (lang === 'ar' ? 'فرد' : 'personne')}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                        {t('bookingDate')} *
                      </label>
                      <input
                        type="date"
                        required
                        value={bDate}
                        onChange={(e) => setBDate(e.target.value)}
                        className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                      />
                    </div>
                  </div>

                  {/* Row Hours / Seating Choice */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                        {t('bookingTime')}
                      </label>
                      <input
                        type="time"
                        required
                        value={bTime}
                        onChange={(e) => setBTime(e.target.value)}
                        className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                        {t('seatingArea')}
                      </label>
                      <select
                        value={bSeatingArea}
                        onChange={(e) => setBSeatingArea(e.target.value as any)}
                        className="w-full bg-white border border-[#d4c4a8]/50 text-xs px-3 py-2 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                        aria-label="Seating area selector"
                      >
                        <option value="salle_principale">{t('seatingOptions').salle_principale}</option>
                        <option value="jazz_corner">{t('seatingOptions').jazz_corner}</option>
                        <option value="window_view">{t('seatingOptions').window_view}</option>
                        <option value="terrace">{t('seatingOptions').terrace}</option>
                      </select>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-wider text-[#7f756e] font-bold">
                      {t('specialRequests')}
                    </label>
                    <textarea
                      value={bRemarks}
                      onChange={(e) => setBRemarks(e.target.value)}
                      placeholder="Ex: besoin d'une chaise haute bébé, anniversaire..."
                      className="w-full bg-white border border-[#d4c4a8]/50 text-xs p-2 text-[#1a120a] focus:outline-none focus:border-[#a07850] h-16"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-xs uppercase tracking-widest font-light transition-all cursor-pointer"
                      id="confirm-booking-btn"
                    >
                      {t('confirmBooking')}
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MY BOOKINGS ACTIVE OVERVIEW */}
      <AnimatePresence>
        {isMyBookingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMyBookingsOpen(false)}
              className="absolute inset-0 bg-[#1a120a]/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#fef9f2] w-full max-w-[420px] hairline-border p-6 relative z-10 max-h-[80vh] overflow-y-auto"
              style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
            >
              <button 
                onClick={() => setIsMyBookingsOpen(false)}
                className="absolute top-4 right-4 p-1 hover:text-[#a07850] transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#a07850] font-bold">
                  {t('myBookings')}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1a120a] mt-1">
                  {lang === 'ar' ? 'مسيرة الضيافة الخاصة بك' : 'Votre parcours gastronomique'}
                </h3>
              </div>

              <div className="space-y-4 my-6">
                {reservations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-[#d4c4a8] mx-auto opacity-60 mb-2" />
                    <p className="text-xs text-[#7f756e] font-light">
                      {t('noReservations')}
                    </p>
                  </div>
                ) : (
                  reservations.map((res) => (
                    <div 
                      key={res.id}
                      className="bg-white border border-[#d4c4a8]/40 p-4 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-medium text-[#a07850]">
                          ID: {res.id}
                        </span>
                        <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold ${
                          res.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-500 line-through'
                        }`}>
                          {res.status === 'confirmed' ? t('confirmedStatus') : 'Annulée'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[#4d453f] font-light">
                        <p className="font-serif text-[#1a120a] font-normal">
                          {res.fullName}
                        </p>
                        <p>{res.date} à <strong className="text-[#1a120a]">{res.time}</strong></p>
                        <p>Invités: {res.guests} personnes</p>
                        <p className="text-[10px] text-[#a07850] mt-1">
                          Section: {t('seatingOptions')[res.seatingArea]}
                        </p>
                      </div>

                      {res.status === 'confirmed' && (
                        <button
                          onClick={() => cancelReservation(res.id)}
                          className="w-full mt-3 py-1.5 border border-[#ba1a1a]/40 hover:bg-[#ba1a1a] hover:text-white text-[#ba1a1a] text-[10px] tracking-widest uppercase transition-colors font-light cursor-pointer"
                        >
                          {t('cancel')}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={() => setIsMyBookingsOpen(false)}
                className="w-full py-2.5 bg-[#1a120a] text-white text-xs uppercase tracking-widest font-light hover:bg-[#a07850]"
              >
                {t('close')}
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. LIGHTBOX MODAL FOR IMAGES */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-[#1a120a]/95 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-w-[500px] w-full"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 p-1.5 text-white hover:text-[#a07850]"
                aria-label="Fermer lightbox"
                id="lightbox-close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-[#fef9f2] p-2 border border-[#d4c4a8] shadow-2xl">
                <img 
                  src={selectedImage} 
                  alt="Atmosphere zoom close-up" 
                  className="w-full h-auto object-contain max-h-[80vh] border border-[#d4c4a8]" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
