const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import Menu icon
if (!code.includes('Menu,')) {
    code = code.replace(/Utensils,/, "Utensils,\n  Menu,");
}

// 2. Add State
if (!code.includes('isMobileMenuOpen')) {
    code = code.replace(/const \[isCartOpen, setIsCartOpen\] = useState\(false\);/, 
        "const [isCartOpen, setIsCartOpen] = useState(false);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);");
}

// 3. Update Header Navigation Links
code = code.replace(/<nav className="flex items-center gap-2 sm:gap-4 flex-wrap">/, '<nav className="hidden sm:flex items-center gap-4">');

// 4. Hide Cart on mobile
code = code.replace(/className="p-2 bg-\[#1a120a\] text-\[#fef9f2\] hover:bg-\[#a07850\] transition-colors relative flex items-center justify-center cursor-pointer"/, 
    'className="hidden sm:flex p-2 bg-[#1a120a] text-[#fef9f2] hover:bg-[#a07850] transition-colors relative items-center justify-center cursor-pointer"');

// 5. Add Hamburger Menu Button to Icon controls
const hamburgerButton = `
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden p-2 border border-[#d4c4a8]/50 hover:bg-[#1a120a] hover:text-[#fef9f2] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
`;
if (!code.includes('setIsMobileMenuOpen(true)')) {
    code = code.replace(/{ \/\* Shopping Cart Trigger \*\/ }/, hamburgerButton + '\n            {/* Shopping Cart Trigger */}');
}

// 6. Add Mobile Menu Side Panel
const mobileMenuSidePanel = `
        {/* Mobile Sidebar Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#1a120a]/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-[80vw] max-w-sm h-full bg-[#fef9f2] border-l border-[#d4c4a8] shadow-2xl flex flex-col"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#ede5d8]">
                <h2 className="font-serif text-2xl text-[#1a120a] italic">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[#f8f3ec] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#4d453f]" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <button 
                  onClick={() => { setCurrentView('home'); scrollToId('hero'); setIsMobileMenuOpen(false); }}
                  className={\`text-left text-lg tracking-widest transition-colors \${
                    currentView === 'home' 
                      ? 'text-[#a07850] font-medium' 
                      : 'text-[#4d453f]'
                  }\`}
                >
                  {t('home')}
                </button>
                <button 
                  onClick={() => { setCurrentView('menu'); setIsMobileMenuOpen(false); }}
                  className={\`text-left text-lg tracking-widest transition-colors \${
                    currentView === 'menu' 
                      ? 'text-[#a07850] font-medium' 
                      : 'text-[#4d453f]'
                  }\`}
                >
                  {t('menu')}
                </button>
                
                {/* Cart Access */}
                <button 
                  onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-between text-left text-lg tracking-widest text-[#4d453f]"
                >
                  <span>Panier</span>
                  <span className="bg-[#a07850] text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </button>

                <div className="mt-8 pt-8 border-t border-[#ede5d8]">
                  <button 
                    onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }}
                    className={\`flex items-center gap-2 text-left text-sm tracking-widest transition-colors \${
                      currentView === 'admin' 
                        ? 'text-[#a07850] font-medium' 
                        : 'text-[#4d453f]'
                    }\`}
                  >
                    <Key className="w-4 h-4" /> {lang === 'ar' ? 'الإدارة' : 'Admin'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
`;

if (!code.includes('Mobile Sidebar Menu')) {
    code = code.replace(/\{ \/\* Shopping Cart Drawer \*\/ \}/, mobileMenuSidePanel + '\n\n        {/* Shopping Cart Drawer */}');
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
