import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Sparkles, ListChecks, Plus, X, StickyNote, Clock, UtensilsCrossed, Search, Check, TrendingUp, Target, Zap, Crown, Medal, Gem, Rocket } from 'lucide-react';
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

  // ===== حساب النسب المئوية لـ "اصنع وجبتك" =====
  const mealTotal = sumNutrition(mealEntries);
  const mealCalPercent = Math.min((mealTotal.calories / targets.calories) * 100, 100);
  const mealProteinPercent = Math.min((mealTotal.protein / targets.protein) * 100, 100);
  const mealCarbsPercent = Math.min((mealTotal.carbs / targets.carbs) * 100, 100);
  const mealFatPercent = Math.min((mealTotal.fat / targets.fat) * 100, 100);

  const isMealCalComplete = mealCalPercent >= 100;
  const isMealProteinComplete = mealProteinPercent >= 100;
  const isMealCarbsComplete = mealCarbsPercent >= 100;
  const isMealFatComplete = mealFatPercent >= 100;

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

  // ===== Progress Bar مع أنيميشن قوي =====
  const AnimatedProgressBar = ({ percent, isComplete, gradient, delay }: { percent: number; isComplete: boolean; gradient: string; delay: number }) => (
    <div className="mt-3 w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5 relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ 
          duration: 2.5, 
          delay, 
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`h-full rounded-full ${isComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : gradient} relative`}
        style={{ 
          boxShadow: isComplete ? '0 0 30px rgba(74, 222, 128, 0.5)' : '0 0 30px rgba(251, 146, 60, 0.3)',
        }}
      >
        {/* أنيميشن تموج على الشريط */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ============================================================
          🔥 القسم 1: أكلت اليوم
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1, delay: 0.1 }}
        className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/15 shadow-2xl shadow-emerald-500/5"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: '0 0 60px rgba(16, 185, 129, 0.5)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFoodModal(true)}
              className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/40 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>أضف أكل اليوم</span>
              <Zap size={16} className="text-yellow-300 animate-pulse" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }}
              className="flex items-center gap-3"
            >
              <ListChecks size={22} className="text-emerald-400" />
              <h2 className="text-xl font-black text-white/90 flex items-center gap-2">
                ✅ أكلت اليوم
                {todayFoods.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="text-sm text-white/30 bg-white/10 px-3 py-0.5 rounded-full font-bold backdrop-blur-sm border border-white/10"
                  >
                    {todayFoods.length}
                  </motion.span>
                )}
              </h2>
            </motion.div>
          </div>

          {todayFoods.length > 0 ? (
            <>
              {/* ===== خانات الماكروز مع أنيميشن Progress Bar ===== */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5"
              >
                {/* السعرات */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.05, type: 'spring', bounce: 0.6, duration: 0.9 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`relative bg-gradient-to-br from-orange-500/20 via-red-500/10 to-amber-500/5 rounded-2xl p-5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isCalComplete ? 'border-green-500/50 shadow-2xl shadow-green-500/20' : 'border-orange-500/20 hover:border-orange-500/40'
                  }`}
                >
                  {isCalComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-2 left-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={14} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-3xl">🔥</motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-4xl font-black mt-1 ${isCalComplete ? 'text-green-400' : 'text-orange-400'}`} style={{ textShadow: isCalComplete ? '0 0 40px rgba(74, 222, 128, 0.3)' : '0 0 40px rgba(251, 146, 60, 0.3)' }}>
                      {Math.round(todayTotal.calories)}
                    </motion.div>
                    <div className="text-sm text-white/40 font-bold tracking-wider">سعرات</div>
                    <AnimatedProgressBar 
                      percent={calPercent} 
                      isComplete={isCalComplete} 
                      gradient="bg-gradient-to-r from-orange-500 to-red-500"
                      delay={0.4}
                    />
                    <div className="mt-1.5 text-xs font-bold text-white/30">
                      {isCalComplete ? '✅ مكتمل!' : `${Math.round(calPercent)}% من الهدف`}
                    </div>
                  </div>
                </motion.div>

                {/* البروتين */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.6, duration: 0.9 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`relative bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-indigo-500/5 rounded-2xl p-5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isProteinComplete ? 'border-green-500/50 shadow-2xl shadow-green-500/20' : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  {isProteinComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-2 left-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={14} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl">💪</motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={`text-4xl font-black mt-1 ${isProteinComplete ? 'text-green-400' : 'text-blue-400'}`} style={{ textShadow: isProteinComplete ? '0 0 40px rgba(74, 222, 128, 0.3)' : '0 0 40px rgba(96, 165, 250, 0.3)' }}>
                      {Math.round(todayTotal.protein)}<span className="text-xl font-normal opacity-50">g</span>
                    </motion.div>
                    <div className="text-sm text-white/40 font-bold tracking-wider">بروتين</div>
                    <AnimatedProgressBar 
                      percent={proteinPercent} 
                      isComplete={isProteinComplete} 
                      gradient="bg-gradient-to-r from-blue-500 to-cyan-400"
                      delay={0.45}
                    />
                    <div className="mt-1.5 text-xs font-bold text-white/30">
                      {isProteinComplete ? '✅ مكتمل!' : `${Math.round(proteinPercent)}% من الهدف`}
                    </div>
                  </div>
                </motion.div>

                {/* الكارب */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.15, type: 'spring', bounce: 0.6, duration: 0.9 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`relative bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/5 rounded-2xl p-5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isCarbsComplete ? 'border-green-500/50 shadow-2xl shadow-green-500/20' : 'border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  {isCarbsComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-2 left-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={14} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="text-3xl">🌾</motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`text-4xl font-black mt-1 ${isCarbsComplete ? 'text-green-400' : 'text-amber-400'}`} style={{ textShadow: isCarbsComplete ? '0 0 40px rgba(74, 222, 128, 0.3)' : '0 0 40px rgba(245, 158, 11, 0.3)' }}>
                      {Math.round(todayTotal.carbs)}<span className="text-xl font-normal opacity-50">g</span>
                    </motion.div>
                    <div className="text-sm text-white/40 font-bold tracking-wider">كربوهيدرات</div>
                    <AnimatedProgressBar 
                      percent={carbsPercent} 
                      isComplete={isCarbsComplete} 
                      gradient="bg-gradient-to-r from-amber-500 to-yellow-400"
                      delay={0.5}
                    />
                    <div className="mt-1.5 text-xs font-bold text-white/30">
                      {isCarbsComplete ? '✅ مكتمل!' : `${Math.round(carbsPercent)}% من الهدف`}
                    </div>
                  </div>
                </motion.div>

                {/* الدهون */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.6, duration: 0.9 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`relative bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-fuchsia-500/5 rounded-2xl p-5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isFatComplete ? 'border-green-500/50 shadow-2xl shadow-green-500/20' : 'border-pink-500/20 hover:border-pink-500/40'
                  }`}
                >
                  {isFatComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-2 left-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={14} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-3xl">🧈</motion.div>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={`text-4xl font-black mt-1 ${isFatComplete ? 'text-green-400' : 'text-pink-400'}`} style={{ textShadow: isFatComplete ? '0 0 40px rgba(74, 222, 128, 0.3)' : '0 0 40px rgba(236, 72, 153, 0.3)' }}>
                      {Math.round(todayTotal.fat)}<span className="text-xl font-normal opacity-50">g</span>
                    </motion.div>
                    <div className="text-sm text-white/40 font-bold tracking-wider">دهون</div>
                    <AnimatedProgressBar 
                      percent={fatPercent} 
                      isComplete={isFatComplete} 
                      gradient="bg-gradient-to-r from-pink-500 to-rose-400"
                      delay={0.55}
                    />
                    <div className="mt-1.5 text-xs font-bold text-white/30">
                      {isFatComplete ? '✅ مكتمل!' : `${Math.round(fatPercent)}% من الهدف`}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ===== تفاصيل إضافية ===== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-center justify-end gap-4 mb-4 text-xs text-white/30 bg-white/5 rounded-2xl px-4 py-2.5 border border-white/5 backdrop-blur-sm"
              >
                <motion.span whileHover={{ scale: 1.1, color: '#4ade80' }} className="flex items-center gap-1.5 font-medium">🥬 ألياف: <span className="text-white/50">{Math.round(todayTotal.fiber)}g</span></motion.span>
                <span className="w-px h-4 bg-white/10" />
                <motion.span whileHover={{ scale: 1.1, color: '#c084fc' }} className="flex items-center gap-1.5 font-medium">🍬 سكر: <span className="text-white/50">{Math.round(todayTotal.sugar)}g</span></motion.span>
                <span className="w-px h-4 bg-white/10" />
                <motion.span whileHover={{ scale: 1.1, color: '#f472b6' }} className="flex items-center gap-1.5 font-medium">🧂 صوديوم: <span className="text-white/50">{Math.round(todayTotal.sodium)}mg</span></motion.span>
                <span className="w-px h-4 bg-white/10" />
                <motion.span whileHover={{ scale: 1.1, color: '#fcd34d' }} className="flex items-center gap-1.5 font-medium">⚖️ <span className="text-white/50">{Math.round(todayTotal.grams)}g</span></motion.span>
              </motion.div>

              {/* ===== قائمة الأكلات ===== */}
              <div className="space-y-2.5">
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
                      'وجبة رئيسية': 'border-blue-500/40 bg-blue-500/10 text-blue-400',
                      'سناك': 'border-amber-500/40 bg-amber-500/10 text-amber-400',
                      'مشروب': 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
                      'حلويات': 'border-pink-500/40 bg-pink-500/10 text-pink-400',
                      'فواكه': 'border-green-500/40 bg-green-500/10 text-green-400',
                    };

                    const isSavedMeal = food.isMeal && food.source === 'saved_meal';

                    return (
                      <motion.div
                        key={food.id}
                        layout
                        initial={{ opacity: 0, x: 100, scale: 0.85, rotateZ: -8 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotateZ: 0 }}
                        exit={{ opacity: 0, x: -100, scale: 0.85, rotateZ: 8 }}
                        transition={{ type: 'spring', bounce: 0.4, delay: index * 0.06, duration: 0.6 }}
                        whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.15)' }}
                        className={`group bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 backdrop-blur-sm ${
                          isSavedMeal ? 'border-primary-500/40 bg-primary-500/10' : ''
                        }`}
                      >
                        <motion.button whileHover={{ scale: 1.25, rotate: 90 }} whileTap={{ scale: 0.8 }} onClick={() => onRemoveFoodFromToday(food.id)} className="text-white/20 hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-500/15 shrink-0">
                          <X size={16} />
                        </motion.button>

                        <div className="flex-1 flex flex-wrap gap-2 items-center">
                          {isSavedMeal && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-[10px] px-2.5 py-1 rounded-full font-bold border border-primary-500/40 bg-primary-500/15 text-primary-400 uppercase tracking-wider">📦 وجبة كاملة</motion.span>
                          )}
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${mealTypeColors[food.mealType]}`}>{mealTypeEmojis[food.mealType]} {food.mealType}</span>
                          <span className="text-[10px] text-orange-400/80 bg-orange-400/15 px-2.5 py-1 rounded-full font-bold border border-orange-400/20">{food.nutrition.calories} cal</span>
                          <span className="text-[10px] text-blue-400/80 bg-blue-400/15 px-2.5 py-1 rounded-full font-bold border border-blue-400/20">{food.nutrition.protein}g P</span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-white/90 font-bold text-base">{food.nameAr}{isSavedMeal && <span className="text-[10px] text-primary-400/60 mr-1.5 font-normal">(وجبة)</span>}</div>
                          <div className="text-white/30 text-xs mt-0.5 font-medium">{food.quantity} {unitLabels[food.unit] || food.unit}{food.notes && <span className="mr-2 text-white/15">📝 {food.notes}</span>}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex justify-end mt-4">
                <motion.button whileHover={{ scale: 1.08, color: '#ef4444' }} whileTap={{ scale: 0.92 }} onClick={onClearToday} className="text-white/25 hover:text-red-400 text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 font-medium">
                  <RotateCcw size={14} /> مسح اليوم
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-center py-14">
              <motion.div animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-6xl mb-4 opacity-20">🍽️</motion.div>
              <p className="text-white/25 text-lg font-bold">لم تأكل أي شيء اليوم</p>
              <p className="text-white/15 text-sm mt-1.5">اضغط على <span className="text-emerald-400/60 font-bold">"أضف أكل اليوم"</span> لتسجيل ما أكلته</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ============================================================
          ⚡ القسم 2: اصنع وجبتك
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1, delay: 0.2 }}
        className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-7 border border-primary-500/15 shadow-2xl shadow-primary-500/5"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            {mealEntries.length > 0 && (
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={clearMealBuilder} className="text-white/25 hover:text-red-400 text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 font-medium">
                  <RotateCcw size={14} /> مسح الكل
                </motion.button>
                <motion.button whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' }} whileTap={{ scale: 0.92 }} onClick={() => setShowSaveMealDialog(true)} disabled={mealEntries.length === 0} className="group relative flex items-center gap-2 px-5 py-2 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-primary-500 to-emerald-500 shadow-lg shadow-primary-500/30 disabled:opacity-30 transition-all duration-300 overflow-hidden">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Save size={14} /> حفظ كوجبة
                </motion.button>
              </div>
            )}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }} className="flex items-center gap-3">
              <UtensilsCrossed size={22} className="text-primary-400" />
              <h2 className="text-xl font-black text-white/90 flex items-center gap-2">
                ⚡ اصنع وجبتك
                {mealEntries.length > 0 && (
                  <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-sm text-white/30 bg-white/10 px-3 py-0.5 rounded-full font-bold backdrop-blur-sm border border-white/10">
                    {mealEntries.length}
                  </motion.span>
                )}
              </h2>
            </motion.div>
          </div>

          <p className="text-white/25 text-sm text-right mb-4 font-medium">🔍 أضف أطعمة لتكوين وجبتك ثم احفظها في "وجباتي"</p>

          <FoodSearch onAddEntry={addToMealBuilder} />

          {mealEntries.length > 0 ? (
            <>
              {/* ===== خانات الماكروز لـ "اصنع وجبتك" ===== */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5"
              >
                {/* السعرات */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.05, type: 'spring', bounce: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`relative bg-gradient-to-br from-orange-500/15 to-red-500/5 rounded-2xl p-3.5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isMealCalComplete ? 'border-green-500/40 shadow-lg shadow-green-500/15' : 'border-orange-500/20 hover:border-orange-500/40'
                  }`}
                >
                  {isMealCalComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-1.5 left-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={11} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <span className="text-xl">🔥</span>
                    <div className={`text-2xl font-black mt-0.5 ${isMealCalComplete ? 'text-green-400' : 'text-orange-400'}`}>{Math.round(mealTotal.calories)}</div>
                    <div className="text-[10px] text-white/30 font-bold">سعرات</div>
                    <AnimatedProgressBar 
                      percent={mealCalPercent} 
                      isComplete={isMealCalComplete} 
                      gradient="bg-gradient-to-r from-orange-500 to-red-500"
                      delay={0.3}
                    />
                    <div className="mt-1 text-[9px] font-bold text-white/25">{isMealCalComplete ? '✅' : `${Math.round(mealCalPercent)}%`}</div>
                  </div>
                </motion.div>

                {/* البروتين */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`relative bg-gradient-to-br from-blue-500/15 to-cyan-500/5 rounded-2xl p-3.5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isMealProteinComplete ? 'border-green-500/40 shadow-lg shadow-green-500/15' : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  {isMealProteinComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-1.5 left-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={11} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <span className="text-xl">💪</span>
                    <div className={`text-2xl font-black mt-0.5 ${isMealProteinComplete ? 'text-green-400' : 'text-blue-400'}`}>{Math.round(mealTotal.protein)}<span className="text-xs font-normal opacity-50">g</span></div>
                    <div className="text-[10px] text-white/30 font-bold">بروتين</div>
                    <AnimatedProgressBar 
                      percent={mealProteinPercent} 
                      isComplete={isMealProteinComplete} 
                      gradient="bg-gradient-to-r from-blue-500 to-cyan-400"
                      delay={0.35}
                    />
                    <div className="mt-1 text-[9px] font-bold text-white/25">{isMealProteinComplete ? '✅' : `${Math.round(mealProteinPercent)}%`}</div>
                  </div>
                </motion.div>

                {/* الكارب */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.15, type: 'spring', bounce: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`relative bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-2xl p-3.5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isMealCarbsComplete ? 'border-green-500/40 shadow-lg shadow-green-500/15' : 'border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  {isMealCarbsComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-1.5 left-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={11} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <span className="text-xl">🌾</span>
                    <div className={`text-2xl font-black mt-0.5 ${isMealCarbsComplete ? 'text-green-400' : 'text-amber-400'}`}>{Math.round(mealTotal.carbs)}<span className="text-xs font-normal opacity-50">g</span></div>
                    <div className="text-[10px] text-white/30 font-bold">كارب</div>
                    <AnimatedProgressBar 
                      percent={mealCarbsPercent} 
                      isComplete={isMealCarbsComplete} 
                      gradient="bg-gradient-to-r from-amber-500 to-yellow-400"
                      delay={0.4}
                    />
                    <div className="mt-1 text-[9px] font-bold text-white/25">{isMealCarbsComplete ? '✅' : `${Math.round(mealCarbsPercent)}%`}</div>
                  </div>
                </motion.div>

                {/* الدهون */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.2, type: 'spring', bounce: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  className={`relative bg-gradient-to-br from-pink-500/15 to-rose-500/5 rounded-2xl p-3.5 text-center overflow-hidden border-2 transition-all duration-300 ${
                    isMealFatComplete ? 'border-green-500/40 shadow-lg shadow-green-500/15' : 'border-pink-500/20 hover:border-pink-500/40'
                  }`}
                >
                  {isMealFatComplete && (
                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="absolute top-1.5 left-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40"><Check size={11} className="text-green-400" /></div>
                    </motion.div>
                  )}
                  <div className="relative z-10">
                    <span className="text-xl">🧈</span>
                    <div className={`text-2xl font-black mt-0.5 ${isMealFatComplete ? 'text-green-400' : 'text-pink-400'}`}>{Math.round(mealTotal.fat)}<span className="text-xs font-normal opacity-50">g</span></div>
                    <div className="text-[10px] text-white/30 font-bold">دهون</div>
                    <AnimatedProgressBar 
                      percent={mealFatPercent} 
                      isComplete={isMealFatComplete} 
                      gradient="bg-gradient-to-r from-pink-500 to-rose-400"
                      delay={0.45}
                    />
                    <div className="mt-1 text-[9px] font-bold text-white/25">{isMealFatComplete ? '✅' : `${Math.round(mealFatPercent)}%`}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ===== قائمة مكونات الوجبة ===== */}
              <div className="mt-4 space-y-2">
                <AnimatePresence mode="popLayout">
                  {mealEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: 80, scale: 0.85 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -80, scale: 0.85 }}
                      transition={{ type: 'spring', bounce: 0.3, delay: index * 0.04, duration: 0.5 }}
                      className="bg-white/5 hover:bg-white/10 border border-white/8 rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-300 backdrop-blur-sm"
                    >
                      <motion.button whileHover={{ scale: 1.25, rotate: 90 }} whileTap={{ scale: 0.8 }} onClick={() => removeFromMealBuilder(entry.id)} className="text-white/20 hover:text-red-400 transition-all p-1.5 rounded-xl hover:bg-red-500/15 shrink-0">
                        <X size={14} />
                      </motion.button>

                      <div className="flex-1 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-orange-400/80 bg-orange-400/15 px-2.5 py-0.5 rounded-full font-bold border border-orange-400/20">{entry.nutrition.calories} cal</span>
                        <span className="text-[10px] text-blue-400/80 bg-blue-400/15 px-2.5 py-0.5 rounded-full font-bold border border-blue-400/20">{entry.nutrition.protein}g</span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-white/80 font-bold text-sm">{entry.foodNameAr}</div>
                        <div className="text-white/25 text-xs mt-0.5">{entry.quantity} {unitLabels[entry.unit] || entry.unit}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 pt-3 border-t-2 border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/30 font-bold">📊 إجمالي الوجبة</span>
                    <div className="flex gap-4 flex-wrap justify-end">
                      <span className="text-orange-400/90 font-black">{Math.round(mealTotal.calories)} سعرة</span>
                      <span className="text-blue-400/70 font-bold">💪 {mealTotal.protein}g</span>
                      <span className="text-amber-400/70 font-bold">🌾 {mealTotal.carbs}g</span>
                      <span className="text-pink-400/70 font-bold">🧈 {mealTotal.fat}g</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="text-5xl mb-3 opacity-15">🔍</div>
              <p className="text-white/20 text-lg font-bold">ابحث عن أطعمة لتكوين وجبتك</p>
              <p className="text-white/15 text-sm mt-1">ستحفظ في <span className="text-primary-400/60 font-bold">"وجباتي"</span> وستظهر كوجبة كاملة في <span className="text-emerald-400/60 font-bold">"أكلت اليوم"</span></p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ===== مودال: أضف أكل اليوم ===== */}
      <AnimatePresence>
        {showFoodModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={() => setShowFoodModal(false)}>
            <motion.div initial={{ scale: 0.7, opacity: 0, y: 60, rotateX: 20 }} animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.7, opacity: 0, y: 60, rotateX: 20 }} transition={{ type: 'spring', bounce: 0.5 }} className="glass-strong rounded-3xl p-8 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-5xl mb-3">📊</motion.div>
                <h3 className="text-2xl font-black text-white">أضف أكل اليوم</h3>
                <p className="text-sm text-white/30 mt-1">اختر الطعام وحدد التصنيف المناسب</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-white/40 font-bold block">🔍 ابحث عن الطعام</label>
                <FoodSearch onAddEntry={(entry) => { setSelectedFood(entry); }} />
                {selectedFood && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <span className="text-white font-bold">{selectedFood.foodNameAr}</span>
                    <span className="text-white/30 text-xs mr-2">{selectedFood.nutrition.calories} سعرة</span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/40 font-bold block">📋 التصنيف</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['وجبة رئيسية', 'سناك', 'مشروب', 'حلويات', 'فواكه'] as const).map((type) => {
                    const emojis: Record<string, string> = { 'وجبة رئيسية': '🍽️', 'سناك': '🍿', 'مشروب': '☕', 'حلويات': '🍰', 'فواكه': '🍎' };
                    const colors: Record<string, string> = {
                      'وجبة رئيسية': 'border-blue-500/40 data-[active=true]:bg-blue-500/30 data-[active=true]:border-blue-400',
                      'سناك': 'border-amber-500/40 data-[active=true]:bg-amber-500/30 data-[active=true]:border-amber-400',
                      'مشروب': 'border-cyan-500/40 data-[active=true]:bg-cyan-500/30 data-[active=true]:border-cyan-400',
                      'حلويات': 'border-pink-500/40 data-[active=true]:bg-pink-500/30 data-[active=true]:border-pink-400',
                      'فواكه': 'border-green-500/40 data-[active=true]:bg-green-500/30 data-[active=true]:border-green-400',
                    };
                    return (
                      <motion.button key={type} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} data-active={mealType === type} onClick={() => setMealType(type)} className={`py-2.5 px-1 rounded-xl text-xs font-bold border-2 transition-all data-[active=true]:scale-95 ${colors[type]} data-[active=false]:bg-white/5 data-[active=false]:text-white/40 hover:data-[active=false]:bg-white/10`}>
                        <div className="text-xl">{emojis[type]}</div>
                        <div className="text-[10px] mt-0.5">{type}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/40 font-bold block flex items-center gap-1"><StickyNote size={14} /> ملاحظات (اختياري)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="مثلاً: أكلت بعد التمرين..." className="w-full px-5 py-3.5 rounded-xl text-right text-sm bg-white/5 border border-white/10 focus:border-primary-500/50 outline-none transition-all" dir="rtl" />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowFoodModal(false)} className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all font-bold border border-white/10">إلغاء</motion.button>
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16, 185, 129, 0.5)' }} whileTap={{ scale: 0.95 }} onClick={() => { if (!selectedFood) return; handleAddFoodFromModal(selectedFood); }} disabled={!selectedFood} className="flex-1 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-emerald-500/30">أضف لأكل اليوم ✓</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== مودال: حفظ وجبة ===== */}
      <AnimatePresence>
        {showSaveMealDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl" onClick={() => setShowSaveMealDialog(false)}>
            <motion.div initial={{ scale: 0.7, opacity: 0, y: 60, rotateX: 20 }} animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.7, opacity: 0, y: 60, rotateX: 20 }} transition={{ type: 'spring', bounce: 0.5 }} className="glass-strong rounded-3xl p-8 w-full max-w-md space-y-5 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-5xl mb-3">🍱</motion.div>
                <h3 className="text-2xl font-black text-white">حفظ كوجبة</h3>
                <p className="text-sm text-white/30 mt-1">{mealEntries.length} عنصر — <span className="text-orange-400 font-bold">{Math.round(sumNutrition(mealEntries).calories)}</span> سعرة</p>
                <p className="text-xs text-primary-400/50 mt-1 font-bold">📌 سيتم حفظها في "وجباتي"</p>
              </div>
              <input type="text" value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="اسم الوجبة..." className="w-full px-5 py-3.5 rounded-xl text-right text-base bg-white/5 border border-white/10 focus:border-primary-500/50 outline-none transition-all" dir="rtl" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveMeal()} />
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowSaveMealDialog(false)} className="flex-1 py-3.5 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all font-bold border border-white/10">إلغاء</motion.button>
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(16, 185, 129, 0.5)' }} whileTap={{ scale: 0.95 }} onClick={handleSaveMeal} disabled={!mealName.trim()} className="flex-1 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r from-primary-500 to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-primary-500/30">حفظ ✓</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Toast: حفظ وجبة ===== */}
      <AnimatePresence>
        {mealSaved && (
          <motion.div initial={{ opacity: 0, y: 80, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 80, scale: 0.7 }} transition={{ type: 'spring', bounce: 0.6 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-primary-600 to-emerald-500 text-white px-10 py-5 rounded-2xl shadow-2xl shadow-primary-500/40 font-bold text-base border border-white/20 backdrop-blur-sm">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="inline-block mr-3 text-xl">✅</motion.span>
            تم حفظ الوجبة في "وجباتي"! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}