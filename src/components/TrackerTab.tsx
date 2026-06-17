import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Sparkles, ListChecks, Plus, X, StickyNote, Clock, UtensilsCrossed, Search, Check, TrendingUp, Target } from 'lucide-react';
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

  // ===== حساب النسب المئوية للأهداف =====
  const getTargets = () => {
    if (profile) {
      return {
        calories: profile.targetCalories || 2000,
        protein: profile.targetProtein || 50,
        carbs: profile.targetCarbs || 300,
        fat: profile.targetFat || 65,
      };
    }
    return {
      calories: 2000,
      protein: 50,
      carbs: 380,
      fat: 60,
    };
  };

  const targets = getTargets();

  const calPercent = Math.min((todayTotal.calories / targets.calories) * 100, 100);
  const proteinPercent = Math.min((todayTotal.protein / targets.protein) * 100, 100);
  const carbsPercent = Math.min((todayTotal.carbs / targets.carbs) * 100, 100);
  const fatPercent = Math.min((todayTotal.fat / targets.fat) * 100, 100);

  const isCalComplete = calPercent >= 100;
  const isProteinComplete = proteinPercent >= 100;
  const isCarbsComplete = carbsPercent >= 100;
  const isFatComplete = fatPercent >= 100;

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
          القسم 1: أكلت اليوم - مع خانات UI عصرية وأنيميشن قوي
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          bounce: 0.4, 
          duration: 0.8,
          delay: 0.1 
        }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-emerald-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowFoodModal(true)}
            className="btn-glow text-sm flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 transition-all duration-300"
          >
            <Plus size={16} className="animate-pulse" />
            أضف أكل اليوم
          </motion.button>
          <h2 className="text-base font-bold text-white/80 flex items-center gap-2">
            <ListChecks size={18} className="text-emerald-400" />
            ✅ أكلت اليوم
            {todayFoods.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal"
              >
                {todayFoods.length}
              </motion.span>
            )}
          </h2>
        </div>

        {todayFoods.length > 0 ? (
          <>
            {/* ===== خانات الماكروز مع أشرطة التقدم ===== */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
            >
              {/* ===== السعرات ===== */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.05, 
                  type: 'spring', 
                  bounce: 0.5,
                  duration: 0.7
                }}
                className={`relative bg-gradient-to-br from-orange-500/15 to-red-500/5 rounded-2xl p-4 text-center overflow-hidden border transition-all duration-300 ${
                  isCalComplete ? 'border-green-500/40 shadow-lg shadow-green-500/10' : 'border-orange-500/20'
                }`}
              >
                {isCalComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute top-2 left-2"
                  >
                    <Check size={14} className="text-green-400" />
                  </motion.div>
                )}
                <div className="relative z-10">
                  <motion.span 
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }}
                    className="text-lg inline-block"
                  >
                    🔥
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-2xl font-black mt-1 ${isCalComplete ? 'text-green-400' : 'text-orange-400'}`}
                  >
                    {Math.round(todayTotal.calories)}
                  </motion.div>
                  <div className="text-[10px] text-white/30 font-medium">سعرات</div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-2 nutrient-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(calPercent, 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className={`nutrient-bar-fill h-full ${
                        isCalComplete ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                    />
                  </div>
                  <div className="text-[8px] text-white/20 mt-1">
                    {isCalComplete ? '✅ مكتمل!' : `${Math.round(calPercent)}%`}
                  </div>
                </div>
              </motion.div>

              {/* ===== البروتين ===== */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.1, 
                  type: 'spring', 
                  bounce: 0.5,
                  duration: 0.7
                }}
                className={`relative bg-gradient-to-br from-blue-500/15 to-cyan-500/5 rounded-2xl p-4 text-center overflow-hidden border transition-all duration-300 ${
                  isProteinComplete ? 'border-green-500/40 shadow-lg shadow-green-500/10' : 'border-blue-500/20'
                }`}
              >
                {isProteinComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute top-2 left-2"
                  >
                    <Check size={14} className="text-green-400" />
                  </motion.div>
                )}
                <div className="relative z-10">
                  <motion.span 
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                    className="text-lg inline-block"
                  >
                    💪
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className={`text-2xl font-black mt-1 ${isProteinComplete ? 'text-green-400' : 'text-blue-400'}`}
                  >
                    {Math.round(todayTotal.protein)}<span className="text-sm font-normal opacity-50">g</span>
                  </motion.div>
                  <div className="text-[10px] text-white/30 font-medium">بروتين</div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-2 nutrient-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(proteinPercent, 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className={`nutrient-bar-fill h-full ${
                        isProteinComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                    />
                  </div>
                  <div className="text-[8px] text-white/20 mt-1">
                    {isProteinComplete ? '✅ مكتمل!' : `${Math.round(proteinPercent)}%`}
                  </div>
                </div>
              </motion.div>

              {/* ===== الكارب ===== */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.15, 
                  type: 'spring', 
                  bounce: 0.5,
                  duration: 0.7
                }}
                className={`relative bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-2xl p-4 text-center overflow-hidden border transition-all duration-300 ${
                  isCarbsComplete ? 'border-green-500/40 shadow-lg shadow-green-500/10' : 'border-amber-500/20'
                }`}
              >
                {isCarbsComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute top-2 left-2"
                  >
                    <Check size={14} className="text-green-400" />
                  </motion.div>
                )}
                <div className="relative z-10">
                  <motion.span 
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.25, type: 'spring', bounce: 0.5 }}
                    className="text-lg inline-block"
                  >
                    🌾
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl font-black mt-1 ${isCarbsComplete ? 'text-green-400' : 'text-amber-400'}`}
                  >
                    {Math.round(todayTotal.carbs)}<span className="text-sm font-normal opacity-50">g</span>
                  </motion.div>
                  <div className="text-[10px] text-white/30 font-medium">كربوهيدرات</div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-2 nutrient-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(carbsPercent, 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className={`nutrient-bar-fill h-full ${
                        isCarbsComplete ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      }`}
                    />
                  </div>
                  <div className="text-[8px] text-white/20 mt-1">
                    {isCarbsComplete ? '✅ مكتمل!' : `${Math.round(carbsPercent)}%`}
                  </div>
                </div>
              </motion.div>

              {/* ===== الدهون ===== */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: 'spring', 
                  bounce: 0.5,
                  duration: 0.7
                }}
                className={`relative bg-gradient-to-br from-pink-500/15 to-rose-500/5 rounded-2xl p-4 text-center overflow-hidden border transition-all duration-300 ${
                  isFatComplete ? 'border-green-500/40 shadow-lg shadow-green-500/10' : 'border-pink-500/20'
                }`}
              >
                {isFatComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="absolute top-2 left-2"
                  >
                    <Check size={14} className="text-green-400" />
                  </motion.div>
                )}
                <div className="relative z-10">
                  <motion.span 
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                    className="text-lg inline-block"
                  >
                    🧈
                  </motion.span>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className={`text-2xl font-black mt-1 ${isFatComplete ? 'text-green-400' : 'text-pink-400'}`}
                  >
                    {Math.round(todayTotal.fat)}<span className="text-sm font-normal opacity-50">g</span>
                  </motion.div>
                  <div className="text-[10px] text-white/30 font-medium">دهون</div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-2 nutrient-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(fatPercent, 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      className={`nutrient-bar-fill h-full ${
                        isFatComplete ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-rose-400'
                      }`}
                    />
                  </div>
                  <div className="text-[8px] text-white/20 mt-1">
                    {isFatComplete ? '✅ مكتمل!' : `${Math.round(fatPercent)}%`}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ===== تفاصيل إضافية مع أنيميشن ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center justify-end gap-3 mb-3 text-[9px] text-white/20 bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.03]"
            >
              <motion.span whileHover={{ scale: 1.1 }}>🥬 ألياف: {Math.round(todayTotal.fiber)}g</motion.span>
              <span className="w-px h-3 bg-white/5" />
              <motion.span whileHover={{ scale: 1.1 }}>🍬 سكر: {Math.round(todayTotal.sugar)}g</motion.span>
              <span className="w-px h-3 bg-white/5" />
              <motion.span whileHover={{ scale: 1.1 }}>🧂 صوديوم: {Math.round(todayTotal.sodium)}mg</motion.span>
              <span className="w-px h-3 bg-white/5" />
              <motion.span whileHover={{ scale: 1.1 }}>⚖️ {Math.round(todayTotal.grams)}g</motion.span>
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
                      initial={{ opacity: 0, x: 80, scale: 0.85, rotateZ: -5 }}
                      animate={{ opacity: 1, x: 0, scale: 1, rotateZ: 0 }}
                      exit={{ opacity: 0, x: -80, scale: 0.85, rotateZ: 5 }}
                      transition={{ 
                        type: 'spring', 
                        bounce: 0.3, 
                        delay: index * 0.05,
                        duration: 0.5
                      }}
                      className={`group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-300 ${
                        isSavedMeal ? 'border-primary-500/30 bg-primary-500/5' : ''
                      }`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onRemoveFoodFromToday(food.id)}
                        className="text-white/10 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
                      >
                        <X size={15} />
                      </motion.button>

                      <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                        {isSavedMeal && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.6 }}
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium border border-primary-500/30 bg-primary-500/10 text-primary-400"
                          >
                            📦 وجبة كاملة
                          </motion.span>
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
                whileHover={{ scale: 1.08, color: '#ef4444' }}
                whileTap={{ scale: 0.92 }}
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="text-center py-10"
          >
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-3 opacity-20"
            >
              🍽️
            </motion.div>
            <p className="text-white/20 text-sm font-medium">لم تأكل أي شيء اليوم</p>
            <p className="text-white/10 text-xs mt-1">اضغط على "أضف أكل اليوم" لتسجيل ما أكلته</p>
          </motion.div>
        )}
      </motion.div>

      {/* ============================================================
          القسم 2: اصنع وجبتك - منفصل تماماً
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: 'spring', 
          bounce: 0.4, 
          duration: 0.8,
          delay: 0.2 
        }}
        className="glass-card rounded-3xl p-5 sm:p-6 border border-primary-500/10"
      >
        <div className="flex items-center justify-between mb-4">
          {mealEntries.length > 0 && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={clearMealBuilder}
                className="text-white/20 hover:text-red-400 text-xs flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <RotateCcw size={13} />
                مسح الكل
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.92 }}
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
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded-full font-normal"
              >
                {mealEntries.length}
              </motion.span>
            )}
          </h2>
        </div>

        <p className="text-white/20 text-xs text-right mb-3">أضف أطعمة لتكوين وجبتك ثم احفظها في "وجباتي" (لن تظهر في أكلت اليوم)</p>

        {/* ===== البحث لإضافة أطعمة للوجبة ===== */}
        <FoodSearch onAddEntry={addToMealBuilder} />

        {/* ===== قائمة مكونات الوجبة ===== */}
        {mealEntries.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {mealEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: 80, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80, scale: 0.85 }}
                  transition={{ 
                    type: 'spring', 
                    bounce: 0.3, 
                    delay: index * 0.03 
                  }}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] rounded-2xl p-3 flex items-center gap-3 transition-all duration-300"
                >
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.8 }}
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 pt-3 border-t border-white/[0.05]"
            >
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
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <p className="text-white/15 text-sm">🔍 ابحث عن أطعمة وأضفها لتكوين وجبتك</p>
            <p className="text-white/10 text-xs mt-1">ستحفظ الوجبة في "وجباتي" وستظهر كوجبة كاملة عند إضافتها لأكلت اليوم</p>
          </motion.div>
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
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="glass-strong rounded-3xl p-7 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                  className="text-4xl mb-2"
                >
                  📊
                </motion.div>
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
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
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
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-active={mealType === type}
                        onClick={() => setMealType(type)}
                        className={`py-2 px-1 rounded-xl text-xs border transition-all data-[active=true]:scale-95 ${colors[type]} data-[active=false]:bg-white/[0.02] data-[active=false]:text-white/40 hover:data-[active=false]:bg-white/[0.05]`}
                      >
                        <div className="text-lg">{emojis[type]}</div>
                        <div className="text-[9px] mt-0.5">{type}</div>
                      </motion.button>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFoodModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 transition-all font-medium border border-white/[0.04]"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
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
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="glass-strong rounded-3xl p-7 w-full max-w-md space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.6 }}
                  className="text-4xl mb-2"
                >
                  🍱
                </motion.div>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveMealDialog(false)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50 transition-all font-medium border border-white/[0.04]"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
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
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.8 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-emerald-500 text-white px-8 py-3.5 rounded-2xl shadow-2xl shadow-primary-500/30 font-bold z-50 text-sm"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="inline-block mr-2"
            >
              ✅
            </motion.span>
            تم حفظ الوجبة في "وجباتي"!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}