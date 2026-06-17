import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
import {
  searchFood,
  calculateNutrition,
  unitLabels,
  categories,
  foodDatabase,
  type FoodItem,
} from '../data/foodDatabase';
import type { FoodEntry } from '../types';

// الأكلات المصرية الشائعة للـ Quick Add
const egyptianQuickAdds = [
  { id: 'baladi_bread', name: 'عيش بلدي' },
  { id: 'tameya', name: 'طعمية' },
  { id: 'fava_beans', name: 'فول مدمس' },
  { id: 'koshary', name: 'كشري' },
  { id: 'molokhiya', name: 'ملوخية' },
  { id: 'lentils_cooked', name: 'عدس مطبوخ' },
  { id: 'baleela', name: 'بليلة' },
  { id: 'umm_ali', name: 'أم علي' },
];

// الأكلات الفلسطينية الشائعة للـ Quick Add
const palestinianQuickAdds = [
  { id: 'musakhan', name: 'مسخن' },
  { id: 'maqluba_palestinian', name: 'مقلوبة' },
  { id: 'mansaf_palestinian', name: 'منسف' },
  { id: 'knafeh_nabulsi', name: 'كنافة نابلسية' },
  { id: 'hummus_palestinian', name: 'حمص فلسطيني' },
  { id: 'falafel_palestinian', name: 'فلافل فلسطيني' },
  { id: 'maamoul_palestinian', name: 'معمول' },
  { id: 'zaatar_bread_palestinian', name: 'خبز زعتر' },
];

interface FoodSearchProps {
  onAddEntry: (entry: FoodEntry) => void;
}

export default function FoodSearch({ onAddEntry }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('');
  const [showCategory, setShowCategory] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchFood(query));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setUnit(food.defaultUnit);
    setQuantity(1);
    setQuery('');
    setShowResults(false);
    setShowCategory(null);
  }

  function handleAdd() {
    if (!selectedFood || quantity <= 0) return;
    const nutrition = calculateNutrition(selectedFood, quantity, unit);
    const entry: FoodEntry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      foodNameAr: selectedFood.nameAr,
      category: selectedFood.category,
      quantity,
      unit,
      nutrition,
    };
    onAddEntry(entry);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setSelectedFood(null);
      setQuantity(1);
      setUnit('');
    }, 600);
  }

  function getCategoryFoods(categoryId: string) {
    return foodDatabase.filter((f) => f.category === categoryId);
  }

  function quickAddFood(foodId: string) {
    const food = foodDatabase.find((f) => f.id === foodId);
    if (food) selectFood(food);
  }

  const preview = selectedFood ? calculateNutrition(selectedFood, quantity, unit) : null;

  // جلب الإيموجي للتصنيف
  function getCategoryEmoji(categoryId: string): string {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.emoji || '🍽️';
  }

  return (
    <div className="space-y-5">
      {/* Search Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative group">
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setShowResults(true)}
            placeholder="🔍 ابحث عن طعام... بندورة، دجاج، كشري، مسخن..."
            className="w-full pr-12 pl-4 py-4 rounded-2xl text-right text-base bg-white/5 border border-white/10 focus:border-primary-500/50 outline-none transition-all"
            dir="rtl"
          />
          <div className="absolute inset-0 rounded-2xl pointer-events-none neon-border opacity-0 group-focus-within:opacity-100 transition-opacity" />
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute z-40 w-full mt-2 rounded-2xl glass-strong overflow-hidden max-h-80 overflow-y-auto custom-scroll shadow-2xl shadow-black/30"
            >
              {results.map((food, i) => {
                const emoji = getCategoryEmoji(food.category);
                return (
                  <motion.button
                    key={food.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => selectFood(food)}
                    className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.06] transition-all border-b border-white/[0.03] last:border-0 group"
                  >
                    <span className="text-xs text-white/25 group-hover:text-primary-400 transition-colors font-mono">
                      {food.nutritionPer100g.calories} cal
                    </span>
                    <span className="flex items-center gap-2.5 text-right">
                      <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                        {food.nameAr}
                      </span>
                      <span className="text-lg">{emoji}</span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
          {showResults && query.length > 0 && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute z-40 w-full mt-2 rounded-2xl glass-strong p-6 text-center"
            >
              <p className="text-white/30 text-sm">لم يتم العثور على نتائج 😕</p>
              <p className="text-white/10 text-xs mt-1">جرب تكتب 'مسخن' أو 'مقلوبة' أو 'كنافة'</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Add - Egyptian Favorites */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-white/20 text-xs">🇪🇬 أكلات مصرية سريعة</p>
          <TrendingUp size={14} className="text-primary-400/40" />
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {egyptianQuickAdds.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => quickAddFood(item.id)}
              className="px-3 py-1.5 rounded-xl text-xs bg-primary-500/10 text-primary-300/70 hover:bg-primary-500/20 hover:text-primary-300 border border-primary-500/10 hover:border-primary-500/20 transition-all"
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Add - Palestinian Favorites 🇵🇸 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-white/20 text-xs">🇵🇸 أكلات فلسطينية سريعة</p>
          <TrendingUp size={14} className="text-emerald-400/40" />
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {palestinianQuickAdds.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => quickAddFood(item.id)}
              className="px-3 py-1.5 rounded-xl text-xs bg-emerald-500/10 text-emerald-300/70 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/10 hover:border-emerald-500/20 transition-all"
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Browse */}
      <div className="space-y-3">
        <p className="text-white/25 text-xs text-right font-medium">أو تصفح حسب الفئة</p>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setShowCategory(showCategory === cat.id ? null : cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                showCategory === cat.id
                  ? 'bg-primary-600/80 text-white border border-primary-400/30 shadow-lg shadow-primary-500/20'
                  : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60 border border-transparent'
              }`}
            >
              <ChevronDown size={10} className={`transition-transform duration-300 ${showCategory === cat.id ? 'rotate-180' : ''}`} />
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showCategory && (
            <motion.div
              key={showCategory}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
                {getCategoryFoods(showCategory).map((food, i) => (
                  <motion.button
                    key={food.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => selectFood(food)}
                    className="glass-card rounded-xl px-3 py-2.5 text-right text-xs text-white/50 hover:text-white transition-all hover:bg-white/[0.05]"
                  >
                    <span className="ml-1.5">{getCategoryEmoji(food.category)}</span>
                    {food.nameAr}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Food Configuration */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.25 }}
            className="glass-card rounded-3xl p-5 space-y-5 border border-primary-500/10"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedFood(null)}
                className="text-white/20 hover:text-white/60 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
              <div className="text-right">
                <h3 className="text-lg font-bold text-white">
                  {getCategoryEmoji(selectedFood.category)} {selectedFood.nameAr}
                </h3>
                <p className="text-xs text-white/25 mt-0.5">{selectedFood.name}</p>
              </div>
            </div>

            <div className="flex gap-3" dir="rtl">
              <div className="flex-1">
                <label className="block text-xs text-white/30 mb-1.5 font-medium">الكمية</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 rounded-xl text-center text-lg font-bold bg-white/5 border border-white/10 focus:border-primary-500/50 outline-none transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/30 mb-1.5 font-medium">الوحدة</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-center appearance-none cursor-pointer font-medium bg-white/5 border border-white/10 focus:border-primary-500/50 outline-none transition-all"
                  dir="rtl"
                >
                  {selectedFood.availableUnits.map((u) => (
                    <option key={u} value={u}>{unitLabels[u] || u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nutrition Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-5 gap-2 text-center"
              >
                {[
                  { val: preview.calories, label: 'سعرات', color: 'from-orange-500/20 to-red-500/10', text: 'text-orange-400' },
                  { val: `${preview.protein}g`, label: 'بروتين', color: 'from-blue-500/20 to-cyan-500/10', text: 'text-blue-400' },
                  { val: `${preview.carbs}g`, label: 'كارب', color: 'from-amber-500/20 to-yellow-500/10', text: 'text-amber-400' },
                  { val: `${preview.fat}g`, label: 'دهون', color: 'from-pink-500/20 to-rose-500/10', text: 'text-pink-400' },
                  { val: `${preview.fiber}g`, label: 'ألياف', color: 'from-green-500/20 to-emerald-500/10', text: 'text-green-400' },
                ].map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-gradient-to-br ${n.color} rounded-xl p-2.5`}
                  >
                    <div className={`text-base font-extrabold ${n.text}`}>{n.val}</div>
                    <div className="text-[9px] text-white/30 mt-0.5">{n.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Display total grams */}
            <div className="text-center text-xs text-white/20">
              الوزن التقريبي: {preview?.grams || 0} غرام
            </div>

            <motion.button
              onClick={handleAdd}
              disabled={quantity <= 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
                justAdded ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'btn-success'
              }`}
            >
              {justAdded ? (
                <>
                  <Sparkles size={20} />
                  تمت الإضافة ✓
                </>
              ) : (
                <>
                  <Plus size={20} />
                  أضف للقائمة
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}