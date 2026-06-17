import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Sparkles, ListChecks, Plus, X, StickyNote, Clock, UtensilsCrossed, Search } from 'lucide-react';
import FoodSearch from './FoodSearch';
import type { FoodEntry, NutritionValues, SavedMeal, UserProfile, DailyEatenFood } from '../types';
import { unitLabels } from '../data/foodDatabase';

interface TrackerTabProps {
  onSaveMeal: (meal: SavedMeal) => void;
  eatenFoods: DailyEatenFood[];
  onAddFoodToToday: (food: DailyEatenFood) => void;
  onRemoveFoodFromToday: (id: string) => void;
  onClearToday: () => void;
  profile: UserProfile | null;
  todayTotal: NutritionValues;
}

const emptyNutrition: NutritionValues = {
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0, grams: 0,
};

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
  eatenFoods,
  onAddFoodToToday,
  onRemoveFoodFromToday,
  onClearToday,
  profile,
  todayTotal,
}: TrackerTabProps) {
  // ===== State لصنع وجبة =====
  const [mealEntries, setMealEntries] = useState<FoodEntry[]>([]);
  const [mealName, setMealName] = useState('');
  const [showSaveMealDialog, setShowSaveMealDialog] = useState(false);
  const [mealSaved, setMealSaved] = useState(false);

  // ===== State لأكلات اليوم =====
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const [mealType, setMealType] = useState<'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه'>('سناك');
  const [notes, setNotes] = useState('');

  // حساب أكلات اليوم
  const today = new Date().toISOString().split('T')[0];
  const todayFoods = eatenFoods.filter(f => {
    const date = new Date(f.eatenAt).toISOString().split('T')[0];
    return date === today;
  });

  // ===== دوال صنع الوجبة =====
  function addToMealBuilder(entry: FoodEntry) {
    setMealEntries(prev => [...prev, entry]);
  }

  function removeFromMealBuilder(id: string) {
    setMealEntries(prev => prev.filter(e => e.id !== id));
  }

  function clearMealBuilder() {
    setMealEntries([]);
  }

  function handleSaveMeal() {
    if (!mealName.trim() || mealEntries.length === 0) return;
    
    const total = sumNutrition(mealEntries);
    
    const meal: SavedMeal = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: mealName.trim(),
      entries: mealEntries,
      totalNutrition: total,
      createdAt: new Date().toISOString(),
    };
    onSaveMeal(meal);
    setShowSaveMealDialog(false);
    setMealName('');
    setMealEntries([]);
    setMealSaved(true);
    setTimeout(() => setMealSaved(false), 2500);
  }

  // ===== دوال أكلات اليوم =====
  function handleAddFoodFromModal(entry: FoodEntry) {
    const newFood: DailyEatenFood = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: entry.foodName,
      nameAr: entry.foodNameAr,
      nutrition: entry.nutrition,
      quantity: entry.quantity,
      unit: entry.unit,
      eatenAt: new Date().toISOString(),
      mealType: mealType,
      notes: notes.trim() || undefined,
      source: 'manual',
      isMeal: false,
    };
    onAddFoodToToday(newFood);
    setSelectedFood(null);
    setNotes('');
    setShowFoodModal(false);
  }

  return (
    <div className="space-y-6">
      {/* ============================================================
          القسم 1: أكلت اليوم - مع خانات UI عصرية
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFoodModal(true)}
            className="btn-glow text-sm flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
          >
            <Plus size={16} />
            أضف أكل اليوم
          </motion.button>
          <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
            <ListChecks size={18} className="text-emerald-400" />
            ✅ أكلت اليوم
            {todayFoods.length > 0 && (
              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal">
                {todayFoods.length}
              </span>
            )}
          </h2>
        </div>

        {todayFoods.length > 0 ? (
          <>
            {/* ===== خانات الماكروز العصرية ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
            >
              {/* السعرات */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, type: 'spring', bounce: 0.3 }}
                className="relative bg-gradient-to-br from-orange-500/15 to-red-500/5 rounded-2xl p-4 text-center overflow-hidden border border-orange-500/20"
              >
                <div className="relative z-10">
                  <span className="text-lg">🔥</span>
                  <div className="text-2xl font-black text-orange-400 mt-1">
                    {Math.round(todayTotal.calories)}
                  </div>
                  <div className="text-[10px] text-white/30 font-medium">سعرات</div>
                </div>
              </motion.div>

              {/* البروتين */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
                className="relative bg-gradient-to-br from-blue-500/15 to-cyan-500/5 rounded-2xl p-4 text-center overflow-hidden border border-blue-500/20"
              >
                <div className="relative z-10">
                  <span className="text-lg">💪</span>
                  <div className="text-2xl font-black text-blue-400 mt-1">
                    {Math.round(todayTotal.protein)}<span className="text-sm font-normal opacity-50">g</span>
                  </div>
                  <div className="text-[10px] text-white/30 font-medium">بروتين</div>
                </div>
              </motion.div>

              {/* الكارب */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', bounce: 0.3 }}
                className="relative bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-2xl p-4 text-center overflow-hidden border border-amber-500/20"
              >
                <div className="relative z-10">
                  <span className="text-lg">🌾</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {Math.round(todayTotal.carbs)}<span className="text-sm font-normal opacity-50">g</span>
                  </div>
                  <div className="text-[10px] text-white/30 font-medium">كربوهيدرات</div>
                </div>
              </motion.div>

              {/* الدهون */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
                className="relative bg-gradient-to-br from-pink-500/15 to-rose-500/5 rounded-2xl p-4 text-center overflow-hidden border border-pink-500/20"
              >
                <div className="relative z-10">
                  <span className="text-lg">🧈</span>
                  <div className="text-2xl font-black text-pink-400 mt-1">
                    {Math.round(todayTotal.fat)}<span className="text-sm font-normal opacity-50">g</span>
                  </div>
                  <div className="text-[10px] text-white/30 font-medium">دهون</div>
                </div>
              </motion.div>
            </motion.div>

            {/* ===== تفاصيل إضافية ===== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center justify-end gap-3 mb-3 text-[9px] text-white/20 bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.03]"
            >
              <span>🥬 ألياف: {Math.round(todayTotal.fiber)}g</span>
              <span className="w-px h-3 bg-white/5" />
              <span>🍬 سكر: {Math.round(todayTotal.sugar)}g</span>
              <span className="w-px h-3 bg-white/5" />
              <span>🧂 صوديوم: {Math.round(todayTotal.sodium)}mg</span>
              <span className="w-px h-3 bg-white/5" />
              <span>⚖️ {Math.round(todayTotal.grams)}g</span>
            </motion.div>

            {/* ===== قائمة الأكلات ===== */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {todayFoods.map((food, index) => {
                  const mealTypeEmojis: Record<string, string> = {
                    'وجبة رئيسية': '🍽️',
                    'سناك': '🍿',
                    'مشروب': '☕',
                    'حلويات': '🍰',
                    'فواكه': '🍎',
                  };
                  const mealTypeColors: Record<string, string> = {
                    'وجبة رئيسية': 'border-blue-500/30 bg-blue-500/10 text-blue-400',
                    'سناك': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                    'مشروب': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
                    'حلويات': 'border-pink-500/30 bg-pink-500/10 text-pink-400',
                    'فواكه': 'border-green-500/30 bg-green-500/10 text-green-400',
                  };

                  const isSavedMeal = food.isMeal && food.source === 'saved_meal';

                  return (
                    <motion.div
                      key={food.id}
                      layout
                      initial={{ opacity: 0, x: 60, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -60, scale: 0.8 }}
                      transition={{ type: 'spring', bounce: 0.2, delay: index * 0.03 }}
                      className={`group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-300 ${
                        isSavedMeal ? 'border-primary-500/30 bg-primary-500/5' : ''
                      }`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemoveFoodFromToday(food.id)}
                        className="text-white/10 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
                      >
                        <X size={15} />
                      </motion.button>

                      <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                        {isSavedMeal && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary-500/30 bg-primary-500/10 text-primary-400">
                            📦 وجبة كاملة
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${mealTypeColors[food.mealType]}`}>
                          {mealTypeEmojis[food.mealType]} {food.mealType}
                        </span>
                        <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                          {food.nutrition.calories} cal
                        </span>
                        <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2 py-0.5 rounded-full font-medium">
                          {food.nutrition.protein}g P
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-white/80 font-semibold text-sm">
                          {food.nameAr}
                          {isSavedMeal && (
                            <span className="text-[8px] text-primary-400/50 mr-1">(وجبة)</span>
                          )}
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
            </div>

            {/* ===== زر مسح اليوم ===== */}
            <div className="flex justify-end mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearToday}
                className="text-white/20 hover:text-red-400 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <RotateCcw size={13} />
                مسح اليوم
              </motion.button>
            </div>
          </>
        ) : (
          /* ===== حالة عدم وجود أكلات ===== */
          <div className="text-center py-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-3 opacity-20"
            >
              🍽️
            </motion.div>
            <p className="text-white/20 text-sm font-medium">لم تأكل أي شيء اليوم</p>
            <p className="text-white/10 text-xs mt-1">اضغط على "أضف أكل اليوم" لتسجيل ما أكلته</p>
          </div>
        )}
      </motion.div>

      {/* ============================================================
          القسم 2: اصنع وجبتك - منفصل تماماً
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', bounce: 0.2 }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-primary-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          {mealEntries.length > 0 && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearMealBuilder}
                className="text-white/20 hover:text-red-400 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <RotateCcw size={13} />
                مسح الكل
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSaveMealDialog(true)}
                disabled={mealEntries.length === 0}
                className="btn-glow text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-medium disabled:opacity-30"
              >
                <Save size={13} />
                حفظ كوجبة
              </motion.button>
            </div>
          )}
          <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-primary-400" />
            اصنع وجبتك
            {mealEntries.length > 0 && (
              <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal">
                {mealEntries.length}
              </span>
            )}
          </h2>
        </div>

        <p className="text-white/20 text-xs text-right mb-3">أضف أطعمة لتكوين وجبتك ثم احفظها في "وجباتي" (لن تظهر في أكلت اليوم)</p>

        {/* ===== البحث لإضافة أطعمة للوجبة ===== */}
        <FoodSearch onAddEntry={addToMealBuilder} />

        {/* ===== قائمة مكونات الوجبة ===== */}
        {mealEntries.length > 0 ? (
          <div className="mt-4 space-y-2">
            <AnimatePresence mode="popLayout">
              {mealEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: 60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.8 }}
                  transition={{ type: 'spring', bounce: 0.2, delay: index * 0.03 }}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] rounded-2xl p-3 flex items-center gap-3 transition-all duration-300"
                >
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromMealBuilder(entry.id)}
                    className="text-white/10 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-500/10 shrink-0"
                  >
                    <X size={14} />
                  </motion.button>

                  <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                      {entry.nutrition.calories} cal
                    </span>
                    <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2 py-0.5 rounded-full font-medium">
                      {entry.nutrition.protein}g
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-white/70 font-medium text-sm">
                      {entry.foodNameAr}
                    </div>
                    <div className="text-white/20 text-xs mt-0.5">
                      {entry.quantity} {unitLabels[entry.unit] || entry.unit}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ===== إجمالي الوجبة ===== */}
            <div className="mt-3 pt-3 border-t border-white/[0.05]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/20">📊 إجمالي الوجبة</span>
                <div className="flex gap-3 flex-wrap justify-end">
                  <span className="text-orange-400/80 font-bold">
                    {Math.round(sumNutrition(mealEntries).calories)} سعرة
                  </span>
                  <span className="text-blue-400/60">💪 {sumNutrition(mealEntries).protein}g</span>
                  <span className="text-amber-400/60">🌾 {sumNutrition(mealEntries).carbs}g</span>
                  <span className="text-pink-400/60">🧈 {sumNutrition(mealEntries).fat}g</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-white/15 text-sm">🔍 ابحث عن أطعمة وأضفها لتكوين وجبتك</p>
            <p className="text-white/10 text-xs mt-1">ستحفظ الوجبة في "وجباتي" وستظهر كوجبة كاملة عند إضافتها لأكلت اليوم</p>
          </div>
        )}
      </motion.div>

      {/* ============================================================
          مودال: أضف أكل اليوم
          ============================================================ */}
      <AnimatePresence>
        {showFoodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowFoodModal(false)}
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
                  setSelectedFood(entry);
                }} />
                
                {selectedFood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.06]"
                  >
                    <span className="text-white font-medium">{selectedFood.foodNameAr}</span>
                    <span className="text-white/30 text-xs mr-2">
                      {selectedFood.nutrition.calories} سعرة
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/30 font-medium block">📋 التصنيف</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['وجبة رئيسية', 'سناك', 'مشروب', 'حلويات', 'فواكه'] as const).map((type) => {
                    const emojis: Record<string, string> = {
                      'وجبة رئيسية': '🍽️',
                      'سناك': '🍿',
                      'مشروب': '☕',
                      'حلويات': '🍰',
                      'فواكه': '🍎',
                    };
                    const colors: Record<string, string> = {
                      'وجبة رئيسية': 'border-blue-500/30 data-[active=true]:bg-blue-500/20 data-[active=true]:border-blue-400',
                      'سناك': 'border-amber-500/30 data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-400',
                      'مشروب': 'border-cyan-500/30 data-[active=true]:bg-cyan-500/20 data-[active=true]:border-cyan-400',
                      'حلويات': 'border-pink-500/30 data-[active=true]:bg-pink-500/20 data-[active=true]:border-pink-400',
                      'فواكه': 'border-green-500/30 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-400',
                    };
                    return (
                      <button
                        key={type}
                        data-active={mealType === type}
                        onClick={() => setMealType(type)}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثلاً: أكلت بعد التمرين..."
                  className="w-full px-4 py-3 rounded-xl text-right text-sm"
                  dir="rtl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowFoodModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 transition-all font-medium border border-white/[0.04]"
                >
                  إلغاء
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!selectedFood) return;
                    handleAddFoodFromModal(selectedFood);
                  }}
                  disabled={!selectedFood}
                  className="flex-1 py-3 rounded-2xl text-white font-bold bg-gradient-to-r from-emerald-500 to-green-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                >
                  أضف لأكل اليوم ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          مودال: حفظ وجبة
          ============================================================ */}
      <AnimatePresence>
        {showSaveMealDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowSaveMealDialog(false)}
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
                <div className="text-4xl mb-2">🍱</div>
                <h3 className="text-lg font-bold text-white">حفظ كوجبة</h3>
                <p className="text-xs text-white/25 mt-1">
                  {mealEntries.length} عنصر — {Math.round(sumNutrition(mealEntries).calories)} سعرة
                </p>
                <p className="text-[10px] text-primary-400/30 mt-1">📌 سيتم حفظها في "وجباتي"</p>
              </div>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="اسم الوجبة..."
                className="w-full px-5 py-3.5 rounded-2xl text-right text-base"
                dir="rtl"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveMeal()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveMealDialog(false)}
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
                  حفظ ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          Toast: حفظ وجبة
          ============================================================ */}
      <AnimatePresence>
        {mealSaved && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-emerald-500 text-white px-8 py-3.5 rounded-2xl shadow-2xl shadow-primary-500/30 font-bold z-50 text-sm"
          >
            ✅ تم حفظ الوجبة في "وجباتي"!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}