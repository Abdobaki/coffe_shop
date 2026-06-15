const fs = require('fs');
function processFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');

    if (filePath.includes('App.tsx')) {
        code = code.replace(/Utensils\n\} from 'lucide-react';/, "Utensils,\n  Leaf,\n  Settings,\n  Key,\n  Cake,\n  Star,\n  ArrowUpRight,\n  ArrowDownRight\n} from 'lucide-react';");
    } else if (filePath.includes('AdminPanel.tsx')) {
        code = code.replace(/Image as ImageIcon \n\} from 'lucide-react';/, "Image as ImageIcon,\n  Leaf,\n  Settings,\n  Heart,\n  Camera,\n  Cake\n} from 'lucide-react';");
    }

    // Replace strings
    code = code.replace(/Signature ✨/g, 'Signature');
    code = code.replace(/Favoris ❤️/g, 'Favoris');
    code = code.replace(/Favori ❤️/g, 'Favori');
    code = code.replace(/Végétarien 🍃/g, 'Végétarien');
    code = code.replace(/Nouveau 🆕/g, 'Nouveau');

    code = code.replace(/توقيع الدار ✨/g, 'توقيع الدار');
    code = code.replace(/المفضلة ❤️/g, 'المفضلة');
    code = code.replace(/نباتي 🍃/g, 'نباتي');
    code = code.replace(/جديد 🆕/g, 'جديد');

    code = code.replace(/Personnalisables uniquement ⚙️/g, 'Personnalisables uniquement');
    code = code.replace(/Personnalisable ⚙️/g, 'Personnalisable');
    code = code.replace(/قابل للتخصيص فقط ⚙️/g, 'قابل للتخصيص فقط');
    code = code.replace(/قابل للتخصيص ⚙️/g, 'قابل للتخصيص');

    code = code.replace(/Prix croissant ↗/g, 'Prix croissant');
    code = code.replace(/Prix décroissant ↘/g, 'Prix décroissant');
    code = code.replace(/Popularité ⭐/g, 'Popularité');

    code = code.replace(/السعر: من الأقل للأعلى ↗/g, 'السعر: من الأقل للأعلى');
    code = code.replace(/السعر: من الأعلى للأقل ↘/g, 'السعر: من الأعلى للأقل');
    code = code.replace(/الأكثر شعبية ⭐/g, 'الأكثر شعبية');

    if (filePath.includes('App.tsx')) {
        code = code.replace(/🔑 \{lang === 'ar' \? 'الإدارة' : 'Admin'\}/g, "<Key className=\"w-4 h-4 inline-block mr-1\" /> {lang === 'ar' ? 'الإدارة' : 'Admin'}");
        code = code.replace(/🔑 \{lang === 'ar' \? 'لوحة التحكم' : 'Espace Gestion'\}/g, "<Key className=\"w-4 h-4 inline-block mr-1\" /> {lang === 'ar' ? 'لوحة التحكم' : 'Espace Gestion'}");

        code = code.replace(/✨ \{lang === 'ar' \? 'تواقيع الدار' : 'Signatures'\}/g, "<Sparkles className=\"w-3 h-3 inline-block mr-1\" /> {lang === 'ar' ? 'تواقيع الدار' : 'Signatures'}");
        code = code.replace(/❤️ \{lang === 'ar' \? 'المفضلة' : 'Favoris'\}/g, "<Heart className=\"w-3 h-3 inline-block mr-1\" /> {lang === 'ar' ? 'المفضلة' : 'Favoris'}");
        code = code.replace(/☕ \{lang === 'ar' \? 'القهوة والشاي' : 'Cafés & Thés'\}/g, "<Coffee className=\"w-3 h-3 inline-block mr-1\" /> {lang === 'ar' ? 'القهوة والشاي' : 'Cafés & Thés'}");
        code = code.replace(/🍰 \{lang === 'ar' \? 'الحلويات' : 'Pâtisseries'\}/g, "<Cake className=\"w-3 h-3 inline-block mr-1\" /> {lang === 'ar' ? 'الحلويات' : 'Pâtisseries'}");

        code = code.replace(/<span>⚙️ \{lang === 'ar' \? 'قابل للتخصيص' : 'Personnalisable'\}<\/span>/g, "<span className=\"flex items-center gap-1\"><Settings className=\"w-3 h-3\" /> {lang === 'ar' ? 'قابل للتخصيص' : 'Personnalisable'}</span>");
    }

    if (filePath.includes('AdminPanel.tsx')) {
        code = code.replace(/\{lang === 'ar' \? 'قفل الجلسة 🔒' : 'Verrouiller la session 🔒'\}/g, "<span className=\"flex items-center gap-1\"><Lock className=\"w-3 h-3\" /> {lang === 'ar' ? 'قفل الجلسة' : 'Verrouiller la session'}</span>");
        code = code.replace(/📷 \{imgObj\.name\}/g, "<Camera className=\"w-4 h-4 inline-block mr-1\" /> {imgObj.name}");
        code = code.replace(/☕/g, "<Coffee className=\"w-5 h-5 text-[#a07850] opacity-50\" />");
    }

    fs.writeFileSync(filePath, code);
}

processFile('src/App.tsx');
processFile('src/components/AdminPanel.tsx');
