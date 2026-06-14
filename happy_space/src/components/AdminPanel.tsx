import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Coffee,
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Check, 
  Tag, 
  Sparkles, 
  Layout, 
  RefreshCw, 
  AlertCircle, 
  Image as ImageIcon 
} from 'lucide-react';
import { MenuItem } from '../types';

interface AdminPanelProps {
  lang: 'fr' | 'ar';
  menuItems: MenuItem[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onBackToHome: () => void;
}

const ADMIN_DICT = {
  fr: {
    title: 'Espace Gestion - Happy Space',
    subtitle: 'La console d\'administration pour piloter la carte du café',
    passcodePrompt: 'Veuillez saisir le code d\'accès gérant',
    passcodeHint: 'Conseil : Utilisez le code d\'accès de démonstration 1962 ou 1234',
    incorrectPasscode: 'Code invalide. Veuillez réessayer.',
    unlockBtn: 'Déverrouiller l\'accès',
    backToHome: 'Retour à l\'accueil',
    addItemTitle: 'Ajouter un nouveau délice',
    nameFrLabel: 'Nom de l\'article',
    nameArLabel: 'Nom en Arabe (Optionnel, affiché en mode RTL)',
    categoryLabel: 'Catégorie de la carte',
    priceLabel: 'Prix (en DA / dinars)',
    tagLabel: 'Badge spécial (Optionnel)',
    descFrLabel: 'Description',
    descArLabel: 'Description en Arabe (Optionnelle, affichée en mode RTL)',
    imageUrlLabel: 'Lien d\'image (Optionnel, saisissez un URL ou cliquez sur une suggestion)',
    imageStockHelper: 'Galerie d\'images de démonstration (Cliquez pour utiliser) :',
    customizableLabel: 'Activer la personnalisation avancée (lait, sucre, etc.)',
    addBtn: 'Inscrire à la Carte',
    addSuccess: 'Le délice a été ajouté à la carte avec succès !',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet article de la carte ?',
    deleteSuccess: 'Article retiré.',
    allProducts: 'Liste de la Carte Actuelle',
    menuItemsCount: 'délices inscrits à la carte',
    noItemsInCategory: 'Aucun article dans cette catégorie.',
    categories: {
      cafes: 'Cafés & Thés',
      boissons: 'Boissons Rafraîchissantes',
      patisseries: 'Douceurs & Pâtisseries',
      salades: 'Salades & Snacking'
    },
    tags: {
      none: 'Aucun badge élevé',
      SIGNATURE: 'Signature ✨',
      FAVORI: 'Favori ❤️',
      VEGAN: 'Végétarien 🍃',
      NEW: 'Nouveau 🆕'
    },
    customizable: 'Personnalisable ⚙️',
    yes: 'Oui',
    no: 'Non'
  },
  ar: {
    title: 'قسم التحكم - هابي سبيس',
    subtitle: 'شاشة الإدارة الخاصة بالتحكم في قائمة المأكولات والمشروبات',
    passcodePrompt: 'يرجى إدخال رمز دخول المدير',
    passcodeHint: 'تلميح: رمز الدخول للتجربة هو 1962 أو 1234',
    incorrectPasscode: 'الرمز غير صحيح، يرجى المحاولة مرة أخرى.',
    unlockBtn: 'طلب الدخول',
    backToHome: 'العودة للرئيسية',
    addItemTitle: 'إضافة صنف جديد للقائمة',
    nameFrLabel: 'الاسم (بالفرنسية أو العام)',
    nameArLabel: 'الاسم (بالعربية - يظهر في الواجهة العربية)',
    categoryLabel: 'فئة الصنف',
    priceLabel: 'السعر (دينار جزائري DA)',
    tagLabel: 'شارة خاصة (اختياري)',
    descFrLabel: 'الوصف (بالفرنسية أو العام)',
    descArLabel: 'الوصف (بالعربية - يظهر في الواجهة العربية)',
    imageUrlLabel: 'رابط الصورة (اختياري، الصق رابطاً أو اختر من المعرض أدناه)',
    imageStockHelper: 'معرض الصور السريعة (اضغط لتطبيق الرابط تلقائياً):',
    customizableLabel: 'تفعيل إضافات التخصيص (الحليب، السكر، اللقطة الإضافية)',
    addBtn: 'إدراج الصنف في القائمة',
    addSuccess: 'تمت إضافة الصنف الجديد بنجاح إلى قائمة الطعام!',
    deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا الصنف بالكامل من البطاقة؟',
    deleteSuccess: 'تم حذف الصنف بنجاح من القائمة.',
    allProducts: 'قائمة الأصناف الحالية في الكارت',
    menuItemsCount: 'أصناف مسجلة حالياً',
    noItemsInCategory: 'لا توجد أصناف في هذه الفئة حالياً.',
    categories: {
      cafes: 'قهوة وشاي',
      boissons: 'مشروبات وعصائر باردة',
      patisseries: 'معجنات وحلويات شهية',
      salades: 'وجبات وسلطات غنية'
    },
    tags: {
      none: 'بدون شارة',
      SIGNATURE: 'توقيع الدار ✨',
      FAVORI: 'المفضلة ❤️',
      VEGAN: 'نباتي 🍃',
      NEW: 'جديد 🆕'
    },
    customizable: 'قابل للتخصيص ⚙️',
    yes: 'نعم',
    no: 'لا'
  }
};

const SUGGESTED_IMAGES = [
  { name: 'Espresso', url: 'https://images.unsplash.com/photo-1510972527409-cef19031741e?w=500&auto=format&fit=crop&q=60' },
  { name: 'Cappuccino', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60' },
  { name: 'Iced Latte', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60' },
  { name: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
  { name: 'Choco Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' },
  { name: 'Salade Bowl', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' }
];

export default function AdminPanel({ lang, menuItems, onAddItem, onDeleteItem, onBackToHome }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // New Item states
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState<'cafes' | 'boissons' | 'patisseries' | 'salades'>('cafes');
  const [price, setPrice] = useState('');
  const [tag, setTag] = useState<'SIGNATURE' | 'FAVORI' | 'VEGAN' | 'NEW' | 'none'>('none');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [image, setImage] = useState('');
  const [customizable, setCustomizable] = useState(false);
  
  const [toast, setToast] = useState('');

  const tAdmin = ADMIN_DICT[lang];

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === '1962' || passcode === '1234') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg(tAdmin.incorrectPasscode);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 4000);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) return;

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) return;

    const newItem: Omit<MenuItem, 'id'> = {
      name,
      category,
      price: parsedPrice,
      description,
      customizable,
      ...(nameAr.trim() !== '' ? { nameAr } : {}),
      ...(descriptionAr.trim() !== '' ? { descriptionAr } : {}),
      ...(image.trim() !== '' ? { image } : {}),
      ...(tag !== 'none' ? { tag } : {})
    };

    onAddItem(newItem);
    showToast(tAdmin.addSuccess);

    // reset fields
    setName('');
    setNameAr('');
    setPrice('');
    setTag('none');
    setDescription('');
    setDescriptionAr('');
    setImage('');
    setCustomizable(false);
  };

  const confirmDelete = (id: string, itemName: string) => {
    const confirmation = window.confirm(`${tAdmin.deleteConfirm} \n\n-> ${itemName}`);
    if (confirmation) {
      onDeleteItem(id);
      showToast(`${tAdmin.deleteSuccess} (${itemName})`);
    }
  };

  const selectSuggestedImage = (url: string) => {
    setImage(url);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="px-6 py-12 max-w-[480px] mx-auto text-center"
        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
      >
        <div className="bg-white border border-[#d4c4a8] p-8 space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-[#1a120a] text-[#a07850] rounded-none flex items-center justify-center mx-auto border border-[#a07850]/40">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-xl font-normal text-[#1a120a]">
              {tAdmin.title}
            </h2>
            <p className="text-xs text-[#7f756e] font-light">
              {tAdmin.subtitle}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-[#7f756e] font-semibold text-start">
                {tAdmin.passcodePrompt}
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="••••"
                className="w-full bg-[#f8f3ec] border border-[#d4c4a8] text-center px-4 py-3 select-all focus:outline-none focus:border-[#a07850] tracking-[0.4em] font-mono text-lg text-[#1a120a]"
                id="admin-passcode-input"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-serif text-red-600 italic bg-red-50 border border-red-200 py-1 px-3">
                {errorMsg}
              </p>
            )}

            <p className="text-[10px] text-[#a07850] bg-[#a07850]/5 py-2 px-3 border border-[#d4c4a8]/30 font-mono italic leading-relaxed">
              {tAdmin.passcodeHint}
            </p>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-xs uppercase tracking-widest font-sans font-light transition-all cursor-pointer border border-[#1a120a]"
                id="admin-unlock-btn"
              >
                {tAdmin.unlockBtn}
              </button>
              
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-2.5 bg-white border border-[#d4c4a8] hover:bg-[#f8f3ec] text-[#4d453f] text-xs uppercase tracking-widest font-sans transition-all cursor-pointer"
                id="admin-back-btn"
              >
                {tAdmin.backToHome}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  // Authenticated Owner View
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 px-4 py-8"
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#1a120a] border border-[#a07850] text-[#fef9f2] text-xs px-5 py-3 shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#a07850]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Admin section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#ede5d8] pb-4">
        <div>
          <button 
            type="button"
            onClick={onBackToHome}
            className="text-[10px] text-[#a07850] hover:text-[#1a120a] uppercase tracking-widest flex items-center gap-1 cursor-pointer font-sans mb-1"
          >
            ← {tAdmin.backToHome}
          </button>
          <div className="flex items-center gap-2">
            <Unlock className="w-5 h-5 text-[#a07850]" />
            <h2 className="font-serif text-2xl text-[#1a120a] font-normal leading-tight">
              {tAdmin.title}
            </h2>
          </div>
          <span className="text-[10px] text-[#7f756e] block uppercase tracking-[0.1em] font-sans">
            {menuItems.length} {tAdmin.menuItemsCount}
          </span>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            setPasscode('');
          }}
          className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#d4c4a8] hover:bg-[#1a120a] hover:text-white transition-colors cursor-pointer"
          id="admin-lock-session"
        >
          {lang === 'ar' ? 'قفل الجلسة 🔒' : 'Verrouiller la session 🔒'}
        </button>
      </div>

      {/* Grid: Left Addition, Right Menu Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form: Add Item to Menu Card */}
        <div className="lg:col-span-6 bg-white border border-[#d4c4a8] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f3eadf] pb-3 mb-2">
            <Plus className="w-4 h-4 text-[#a07850]" />
            <h3 className="font-serif text-base text-[#1a120a] font-light">
              {tAdmin.addItemTitle}
            </h3>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-start">
            {/* Name input FR */}
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                {tAdmin.nameFrLabel} *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Iced Matcha Latte"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                id="admin-form-name"
              />
            </div>

            {/* Name input AR */}
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold text-right">
                {tAdmin.nameArLabel}
              </label>
              <input
                type="text"
                placeholder="مثال: ماتشا لاتيه مثلج"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850] text-right"
                style={{ direction: 'rtl' }}
                id="admin-form-name-ar"
              />
            </div>

            {/* Row Category & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                  {tAdmin.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                  aria-label="Category input"
                  id="admin-form-category"
                >
                  <option value="cafes">{tAdmin.categories.cafes}</option>
                  <option value="boissons">{tAdmin.categories.boissons}</option>
                  <option value="patisseries">{tAdmin.categories.patisseries}</option>
                  <option value="salades">{tAdmin.categories.salades}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                  {tAdmin.priceLabel} *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="10000"
                  placeholder="650"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                  id="admin-form-price"
                />
              </div>
            </div>

            {/* Specialty tag picker */}
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                {tAdmin.tagLabel}
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as any)}
                className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                aria-label="Specialty tag input"
                id="admin-form-tag"
              >
                <option value="none">{tAdmin.tags.none}</option>
                <option value="SIGNATURE">{tAdmin.tags.SIGNATURE}</option>
                <option value="FAVORI">{tAdmin.tags.FAVORI}</option>
                <option value="VEGAN">{tAdmin.tags.VEGAN}</option>
                <option value="NEW">{tAdmin.tags.NEW}</option>
              </select>
            </div>

            {/* Description FR */}
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                {tAdmin.descFrLabel} *
              </label>
              <textarea
                required
                placeholder="Ex: Café double avec lait d'avoine aromatisé, servi frais."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs p-3 text-[#1a120a] focus:outline-none focus:border-[#a07850] h-16"
                id="admin-form-desc"
              />
            </div>

            {/* Description AR */}
            <div className="space-y-1">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold text-right">
                {tAdmin.descArLabel}
              </label>
              <textarea
                placeholder="مثال: إسبريسو مزدوج ممزوج مع رغوة حليب الشوفان المنكه بالكراميل."
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs p-3 text-[#1a120a] focus:outline-none focus:border-[#a07850] h-16 text-right"
                style={{ direction: 'rtl' }}
                id="admin-form-desc-ar"
              />
            </div>

            {/* Customizability toggle */}
            <div className="bg-[#fcf8edf5] border border-[#ede5d8] px-4 py-3 flex items-center justify-between select-none">
              <div className="space-y-0.5">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#a07850]">
                  {lang === 'ar' ? 'خيارات التخصيص للمشروب' : 'Options de Personnalisation'}
                </span>
                <span className="block text-[9px] text-[#7f756e] font-light leading-snug">
                  {lang === 'ar' 
                    ? 'إضافة الحليب، مستويات السكر والإسبريسو الإضافي في كرت الطلب' 
                    : 'Permet d\'ajouter les préférences lait, sucre, dose suppl. pour cet ingrédient'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={customizable}
                onChange={(e) => setCustomizable(e.target.checked)}
                className="rounded-none border-[#ede5d8] text-[#1a120a] accent-[#1a120a] focus:ring-0 cursor-pointer w-4 h-4 ml-2"
                id="admin-form-customizable"
              />
            </div>

            {/* Image URL input */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="block text-[10px] font-sans uppercase tracking-wider text-[#7f756e] font-semibold">
                  {tAdmin.imageUrlLabel}
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#fef9f2] border border-[#ede5d8] text-xs px-3 py-2.5 text-[#1a120a] focus:outline-none focus:border-[#a07850]"
                  id="admin-form-image"
                />
              </div>

              {/* Suggestions grid click-to-fill */}
              <div className="space-y-1.5 p-3 bg-[#f8f3ec]/60 border border-[#d4c4a8]/30">
                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[#7f756e] font-semibold">
                  <ImageIcon className="w-3 h-3 text-[#a07850]" />
                  {tAdmin.imageStockHelper}
                </span>

                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_IMAGES.map((imgObj, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => selectSuggestedImage(imgObj.url)}
                      className="text-[8px] tracking-wide px-2 py-1.5 border border-[#ede5d8] hover:border-[#a07850] hover:bg-[#1a120a] hover:text-white transition-all font-sans cursor-pointer bg-white"
                      id={`stock-btn-${idx}`}
                    >
                      📷 {imgObj.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#1a120a] hover:bg-[#a07850] text-[#fef9f2] text-xs uppercase tracking-widest font-sans font-medium transition-all cursor-pointer border border-[#1a120a] shadow-sm"
                id="admin-submit-btn"
              >
                {tAdmin.addBtn}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Products List & Deletions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#d4c4a8] p-6 text-start">
            <div className="flex items-center gap-2 border-b border-[#f3eadf] pb-3 mb-4">
              <Layout className="w-4 h-4 text-[#a07850]" />
              <h3 className="font-serif text-base text-[#1a120a] font-light">
                {tAdmin.allProducts}
              </h3>
            </div>

            {/* List all items grouped by Category */}
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
              {(['cafes', 'boissons', 'patisseries', 'salades'] as const).map((catId) => {
                const itemsInCat = menuItems.filter(item => item.category === catId);
                return (
                  <div key={catId} className="space-y-3">
                    <span className="block text-[10px] uppercase tracking-[0.15em] text-[#a07850] font-bold border-b border-[#ede5d8] pb-1">
                      {tAdmin.categories[catId]} ({itemsInCat.length})
                    </span>

                    {itemsInCat.length === 0 ? (
                      <p className="text-[10px] text-[#7f756e] font-light italic pl-2">
                        {tAdmin.noItemsInCategory}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {itemsInCat.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-[#fef9f2]/70 border border-[#ede5d8] p-3 flex justify-between gap-3 hover:border-[#a07850] transition-all"
                          >
                            <div className="flex gap-2.5 items-start">
                              {item.image ? (
                                <div className="w-12 h-12 flex-shrink-0 bg-white border border-[#ede5d8] overflow-hidden select-none">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover img-sepia" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 flex-shrink-0 bg-[#f8f3ec] border border-[#ede5d8] flex items-center justify-center text-xs">
                                  ☕
                                </div>
                              )}

                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-baseline gap-1.5">
                                  <h4 className="font-serif text-sm font-normal text-[#1a120a]">
                                    {lang === 'ar' && item.nameAr ? item.nameAr : item.name}
                                  </h4>
                                  <span className="font-sans text-[10px] font-bold text-[#a07850]">
                                    {item.price} DA
                                  </span>
                                </div>

                                <p className="text-[10px] text-[#7f756e] font-light leading-relaxed line-clamp-2">
                                  {lang === 'ar' && item.descriptionAr ? item.descriptionAr : item.description}
                                </p>

                                <div className="flex flex-wrap gap-1 pt-1">
                                  {item.tag && (
                                    <span className="bg-[#1a120a] text-white text-[7.5px] uppercase tracking-widest px-1 py-0.5 font-bold">
                                      {tAdmin.tags[item.tag] || item.tag}
                                    </span>
                                  )}
                                  {item.customizable && (
                                    <span className="bg-[#a07850]/15 text-[#a07850] border border-[#a07850]/20 text-[7px] uppercase tracking-wider px-1 py-0.5">
                                      {tAdmin.customizable}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => confirmDelete(item.id, (lang === 'ar' && item.nameAr ? item.nameAr : item.name))}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors self-start cursor-pointer flex items-center justify-center"
                              title="Delete Item"
                              id={`admin-del-${item.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
