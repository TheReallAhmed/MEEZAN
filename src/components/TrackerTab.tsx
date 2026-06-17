import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Sparkles, ListChecks, Plus, X, StickyNote } from 'lucide-react';
import FoodSearch from './FoodSearch';
import FoodList from './FoodList';
import NutritionSummary from './NutritionSummary';
import type { FoodEntry, NutritionValues, SavedMeal, UserProfile, DailyExtraFood, ExtraMealType, EatenMeal, EatenExtraFood } from '../types';
import { unitLabels } from '../data/foodDatabase';

interface TrackerTabProps {
  onSaveMeal: (meal: SavedMeal) => void;
  entries: FoodEntry[];
  setEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  profile: UserProfile | null;
  extraFoods: DailyExtraFood[];
  onAddExtraFood: (food: DailyExtraFood) => void;
  onRemoveExtraFood: (id: string) => void;
  eatenMeals: EatenMeal[];
  eatenExtras: EatenExtraFood[];
  todayTotal: NutritionValues;
  onClearToday: () => void;
}

const emptyNutrition: NutritionValues = {
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0, grams: 0,
};

const EGYPTIAN_FOODS = [
  'عيش بلدي', 'طعمية', 'فلافل', 'فول مدمس', 'عدس مطبوخ', 'كشري', 'ملوخية',
  'بامية', 'محشي', 'ورق عنب', 'دوالي', 'مسقعة', 'بابا غنوج', 'حمص',
  'كنافة', 'بليلة', 'أم علي', 'رز بلبن', 'سحلب', 'فطير مشلتت', 'حواوشي',
  'أرز بالشعيرية', 'شوربة عدس', 'سمك بلطي'
];

function sumNutrition(entries: FoodEntry[]): NutritionValues {
  return entries.reduce(
    (acc, e) => ({
      calories: Math.round((acc.calories + e.nutrition.calories) * 10) / 10,
      protein: Math.round((acc.protein + e.nutrition.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + e.nutrition.carbs) * 10) / 10,
      fat: Math.round((acc.fat + e.nutrition.fat) * 10) / 10,
      fiber: Math.round((acc.fiber + e.nutrition.fiber) * 10) / 10,
      sugar: Math.round((acc.sugar + e.nutrition.sugar) * 10) / 10,
      sodium: Math.round((acc.sodium + e.nutrition.sodium) * 10) / 10,
      iron: Math.round((acc.iron + e.nutrition.iron) * 10) / 10,
      calcium: Math.round((acc.calcium + e.nutrition.calcium) * 10) / 10,
      vitaminC: Math.round((acc.vitaminC + e.nutrition.vitaminC) * 10) / 10,
      grams: Math.round((acc.grams + e.nutrition.grams) * 10) / 10,
    }),
    { ...emptyNutrition }
  );
}

export { sumNutrition };

export default function TrackerTab({ 
  onSaveMeal, 
  entries, 
  setEntries, 
  profile,
  extraFoods,
  onAddExtraFood,
  onRemoveExtraFood,
  eatenMeals,
  eatenExtras,
  todayTotal,
  onClearToday
}: TrackerTabProps) {
  const [mealName, setMealName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExtraFoodModal, setShowExtraFoodModal] = useState(false);
  const [selectedExtraFood, setSelectedExtraFood] = useState<FoodEntry | null>(null);
  const [extraMealType, setExtraMealType] = useState<ExtraMealType>('سناك');
  const [extraNotes, setExtraNotes] = useState('');

  const total = sumNutrition(entries);
  const extraTotal = sumNutrition(extraFoods.map(f => ({
    ...f,
    foodId: f.id,
    foodName: f.foodName,
    foodNameAr: f.foodNameAr,
    category: f.category,
    nutrition: f.nutrition,
    quantity: f.quantity,
    unit: f.unit,
    id: f.id
  } as FoodEntry)));

  function isEgyptianMeal(entries: FoodEntry[]): boolean {
    return entries.some(entry => 
      EGYPTIAN_FOODS.some(food => 
        entry.foodNameAr.includes(food) || entry.foodName.includes(food)
      )
    );
  }

  function suggestEgyptianMealName(entries: FoodEntry[]): string {
    const egyptianItems = entries.filter(entry =>
      EGYPTIAN_FOODS.some(food => 
        entry.foodNameAr.includes(food) || entry.foodName.includes(food)
      )
    );
    
    if (egyptianItems.length === 0) return 'وجبة جديدة';
    
    const names = egyptianItems.map(e => e.foodNameAr);
    if (names.includes('فول مدمس') && names.includes('طعمية')) return 'وجبة فول وطعمية';
    if (names.includes('كشري')) return 'وجبة كشري';
    if (names.includes('ملوخية')) return 'وجبة ملوخية';
    if (names.includes('عدس مطبوخ')) return 'شوربة عدس';
    if (names.includes('عيش بلدي')) return 'ساندويتش عيش بلدي';
    return `${names[0]} و ${names.slice(1, 3).join(' و ')}`;
  }

  function addEntry(entry: FoodEntry) {
    setEntries((prev) => [...prev, entry]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    setEntries([]);
  }

  function handleSaveMeal() {
    if (!mealName.trim() || entries.length === 0) return;
    
    const finalName = mealName.trim();
    
    const meal: SavedMeal = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: finalName,
      entries: [...entries],
      totalNutrition: total,
      createdAt: new Date().toISOString(),
    };
    onSaveMeal(meal);
    setShowSaveDialog(false);
    setMealName('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function openSaveDialog() {
    if (entries.length === 0) return;
    
    if (isEgyptianMeal(entries) && !mealName) {
      setMealName(suggestEgyptianMealName(entries));
    }
    setShowSaveDialog(true);
  }

  function handleAddExtraFoodFromSearch(entry: FoodEntry) {
    const extraFood: DailyExtraFood = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      foodName: entry.foodName,
      foodNameAr: entry.foodNameAr,
      category: entry.category,
      nutrition: entry.nutrition,
      quantity: entry.quantity,
      unit: entry.unit,
      timestamp: new Date().toISOString(),
      mealType: extraMealType,
      notes: extraNotes.trim() || undefined,
    };
    onAddExtraFood(extraFood);
    setSelectedExtraFood(null);
    setExtraNotes('');
    setShowExtraFoodModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6"
      >
        <h2 className="text-base font-bold text-white/80 text-right mb-5 flex items-center justify-end gap-2">
          <Sparkles size={16} className="text-primary-400" />
          ابحث وأضف طعامك {isEgyptianMeal(entries) && '🇪🇬'}
        </h2>
        <FoodSearch onAddEntry={addEntry} />
      </motion.div>

      {/* Food List Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: 'spring', bounce: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          {entries.length > 0 && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="text-white/20 hover:text-red-400 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <RotateCcw size={13} />
                مسح
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSaveDialog}
                className="btn-glow text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-medium"
              >
                <Save size={13} />
                حفظ كوجبة {isEgyptianMeal(entries) && '🇪🇬'}
              </motion.button>
            </div>
          )}
          <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
            <ListChecks size={16} className="text-emerald-400" />
            قائمتك
            {entries.length > 0 && (
              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal">
                {entries.length}
              </span>
            )}
            {isEgyptianMeal(entries) && (
              <span className="text-xs text-amber-400/30 bg-amber-500/5 px-2 py-0.5 rounded-full font-normal">
                🇪🇬
              </span>
            )}
          </h2>
        </div>
        <FoodList entries={entries} onRemoveEntry={removeEntry} />
      </motion.div>

      {/* Extra Foods Section - شو أكلت اليوم */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', bounce: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-amber-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExtraFoodModal(true)}
              className="btn-glow text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/20"
            >
              <Plus size={13} />
              إضافة أكل اليوم
            </motion.button>
          </div>
          <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
            <span className="text-lg">📊</span>
            شو أكلت اليوم
            {extraFoods.length > 0 && (
              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal">
                {extraFoods.length}
              </span>
            )}
          </h2>
        </div>

        {extraFoods.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-white/15 text-sm">📭 لم تضف أي أكلات إضافية اليوم</p>
            <p className="text-white/10 text-xs mt-1">سناك، مشروب، حلويات... أي شيء خارج الوجبات</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {extraFoods.map((food, index) => {
                const mealTypeEmojis: Record<ExtraMealType, string> = {
                  'وجبة رئيسية': '🍽️',
                  'سناك': '🍿',
                  'مشروب': '☕',
                  'حلويات': '🍰',
                  'فواكه': '🍎',
                };
                const mealTypeColors: Record<ExtraMealType, string> = {
                  'وجبة رئيسية': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
                  'سناك': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                  'مشروب': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
                  'حلويات': 'border-pink-500/30 bg-pink-500/10 text-pink-400',
                  'فواكه': 'border-green-500/30 bg-green-500/10 text-green-400',
                };

                return (
                  <motion.div
                    key={food.id}
                    layout
                    initial={{ opacity: 0, x: 60, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -60, scale: 0.8 }}
                    transition={{ type: 'spring', bounce: 0.2, delay: index * 0.03 }}
                    className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-300"
                  >
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onRemoveExtraFood(food.id)}
                      className="text-white/10 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
                    >
                      <X size={15} />
                    </motion.button>

                    <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${mealTypeColors[food.mealType]}`}>
                        {mealTypeEmojis[food.mealType]} {food.mealType}
                      </span>
                      <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                        {food.nutrition.calories} cal
                      </span>
                      <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2 py-0.5 rounded-full font-medium">
                        {food.nutrition.protein}g P
                      </span>
                      <span className="text-[10px] text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                        {food.nutrition.carbs}g C
                      </span>
                      <span className="text-[10px] text-pink-400/70 bg-pink-400/10 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                        {food.nutrition.fat}g F
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-white/80 font-semibold text-sm">
                        {food.foodNameAr}
                      </div>
                      <div className="text-white/20 text-xs mt-0.5 font-medium">
                        {food.quantity} {unitLabels[food.unit] || food.unit}
                        {food.notes && (
                          <span className="mr-2 text-white/10">📝 {food.notes}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/20">📊 إجمالي الإضافات</span>
                <div className="flex gap-3 flex-wrap justify-end">
                  <span className="text-orange-400/80 font-bold">{Math.round(extraTotal.calories)} سعرة</span>
                  <span className="text-blue-400/60">💪 {extraTotal.protein}g</span>
                  <span className="text-amber-400/60">🌾 {extraTotal.carbs}g</span>
                  <span className="text-pink-400/60">🧈 {extraTotal.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ===== قسم "أكلت اليوم" ===== */}
      {(eatenMeals.length > 0 || eatenExtras.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.2 }}
          className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearToday}
                className="text-white/20 hover:text-red-400 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <RotateCcw size={13} />
                مسح قائمة اليوم
              </motion.button>
            </div>
            <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
              <span className="text-lg">✅</span>
              أكلت اليوم
              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal">
                {eatenMeals.length + eatenExtras.length}
              </span>
            </h2>
          </div>

          <div className="space-y-2">
            {eatenMeals.map((meal, idx) => (
              <motion.div
                key={`meal-${meal.mealId}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-3.5 flex items-center gap-3"
              >
                <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-emerald-400/70 bg-emerald-400/10 px-2 py-0.5 rounded-full font-medium">
                    🍽️ وجبة
                  </span>
                  <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                    {Math.round(meal.totalNutrition.calories)} cal
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white/80 font-semibold text-sm">
                    {meal.mealName}
                  </div>
                  <div className="text-white/20 text-xs mt-0.5">
                    {new Date(meal.eatenAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}

            {eatenExtras.map((food, idx) => {
              const mealTypeEmojis: Record<ExtraMealType, string> = {
                'وجبة رئيسية': '🍽️',
                'سناك': '🍿',
                'مشروب': '☕',
                'حلويات': '🍰',
                'فواكه': '🍎',
              };
              const mealTypeColors: Record<ExtraMealType, string> = {
                'وجبة رئيسية': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
                'سناك': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                'مشروب': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
                'حلويات': 'border-pink-500/30 bg-pink-500/10 text-pink-400',
                'فواكه': 'border-green-500/30 bg-green-500/10 text-green-400',
              };
              return (
                <motion.div
                  key={`extra-${food.id}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (eatenMeals.length + idx) * 0.03 }}
                  className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-3.5 flex items-center gap-3"
                >
                  <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${mealTypeColors[food.mealType]}`}>
                      {mealTypeEmojis[food.mealType]} {food.mealType}
                    </span>
                    <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                      {food.nutrition.calories} cal
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 font-semibold text-sm">
                      {food.foodNameAr}
                    </div>
                    <div className="text-white/20 text-xs mt-0.5">
                      {food.quantity} {unitLabels[food.unit] || food.unit}
                      {food.notes && <span className="mr-2">📝 {food.notes}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/20">📊 إجمالي ما أكلت اليوم</span>
                <div className="flex gap-3 flex-wrap justify-end">
                  <span className="text-orange-400/80 font-bold">{Math.round(todayTotal.calories)} سعرة</span>
                  <span className="text-blue-400/60">💪 {todayTotal.protein}g</span>
                  <span className="text-amber-400/60">🌾 {todayTotal.carbs}g</span>
                  <span className="text-pink-400/60">🧈 {todayTotal.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Meal Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.25 }}
              className="glass-strong rounded-3xl p-7 w-full max-w-md space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{isEgyptianMeal(entries) ? '🇪🇬' : '🍱'}</div>
                <h3 className="text-lg font-bold text-white">
                  حفظ كوجبة {isEgyptianMeal(entries) && 'مصرية'}
                </h3>
                <p className="text-xs text-white/25 mt-1">
                  {entries.length} عنصر — {Math.round(total.calories)} سعرة
                  {isEgyptianMeal(entries) && ' 🧆'}
                </p>
                {isEgyptianMeal(entries) && (
                  <p className="text-[10px] text-amber-400/20 mt-1">
                    تحتوي على أكلات مصرية تقليدية
                  </p>
                )}
              </div>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder={isEgyptianMeal(entries) ? 'اسم الوجبة المصرية...' : 'اسم الوجبة...'}
                className="w-full px-5 py-3.5 rounded-2xl text-right text-base"
                dir="rtl"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveMeal()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 transition-all font-medium border border-white/[0.04]"
                >
                  إلغاء
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveMeal}
                  disabled={!mealName.trim()}
                  className="flex-1 btn-success py-3 rounded-2xl text-white font-bold disabled:opacity-30"
                >
                  حفظ ✓ {isEgyptianMeal(entries) && '🇪🇬'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extra Food Modal */}
      <AnimatePresence>
        {showExtraFoodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowExtraFoodModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.25 }}
              className="glass-strong rounded-3xl p-7 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-bold text-white">أضف أكل اليوم</h3>
                <p className="text-xs text-white/25 mt-1">اختر الطعام وحدد التصنيف المناسب</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-white/30 font-medium block">🔍 ابحث عن الطعام</label>
                <FoodSearch onAddEntry={(entry) => {
                  setSelectedExtraFood(entry);
                }} />
                
                {selectedExtraFood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.06]"
                  >
                    <span className="text-white font-medium">{selectedExtraFood.foodNameAr}</span>
                    <span className="text-white/30 text-xs mr-2">
                      {selectedExtraFood.nutrition.calories} سعرة
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/30 font-medium block">📋 التصنيف</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['وجبة رئيسية', 'سناك', 'مشروب', 'حلويات', 'فواكه'] as ExtraMealType[]).map((type) => {
                    const emojis: Record<ExtraMealType, string> = {
                      'وجبة رئيسية': '🍽️',
                      'سناك': '🍿',
                      'مشروب': '☕',
                      'حلويات': '🍰',
                      'فواكه': '🍎',
                    };
                    const colors: Record<ExtraMealType, string> = {
                      'وجبة رئيسية': 'border-blue-500/30 data-[active=true]:bg-blue-500/20 data-[active=true]:border-blue-400',
                      'سناك': 'border-amber-500/30 data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-400',
                      'مشروب': 'border-cyan-500/30 data-[active=true]:bg-cyan-500/20 data-[active=true]:border-cyan-400',
                      'حلويات': 'border-pink-500/30 data-[active=true]:bg-pink-500/20 data-[active=true]:border-pink-400',
                      'فواكه': 'border-green-500/30 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-400',
                    };
                    return (
                      <button
                        key={type}
                        data-active={extraMealType === type}
                        onClick={() => setExtraMealType(type)}
                        className={`py-2 px-1 rounded-xl text-xs border transition-all data-[active=true]:scale-95 ${colors[type]} data-[active=false]:bg-white/[0.02] data-[active=false]:text-white/40 hover:data-[active=false]:bg-white/[0.05]`}
                      >
                        <div className="text-lg">{emojis[type]}</div>
                        <div className="text-[9px] mt-0.5">{type}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/30 font-medium block flex items-center gap-1">
                  <StickyNote size={12} /> ملاحظات (اختياري)
                </label>
                <input
                  type="text"
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="مثلاً: أكلت بعد التمرين، مع قهوة..."
                  className="w-full px-4 py-3 rounded-xl text-right text-sm"
                  dir="rtl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowExtraFoodModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 transition-all font-medium border border-white/[0.04]"
                >
                  إلغاء
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!selectedExtraFood) return;
                    handleAddExtraFoodFromSearch(selectedExtraFood);
                  }}
                  disabled={!selectedExtraFood}
                  className="flex-1 py-3 rounded-2xl text-white font-bold bg-gradient-to-r from-amber-500 to-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
                >
                  أضف للقائمة ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/30 font-bold z-50 text-sm"
          >
            ✅ تم حفظ الوجبة {isEgyptianMeal(entries) ? 'المصرية' : ''} بنجاح! {isEgyptianMeal(entries) && '🇪🇬'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nutrition Summary */}
      <NutritionSummary 
        total={total} 
        entryCount={entries.length} 
        profile={profile}
        extraTotal={extraTotal}
        extraCount={extraFoods.length}
        todayTotal={todayTotal}
        todayCount={eatenMeals.length + eatenExtras.length}
      />
    </div>
  );
}