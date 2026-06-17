import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, Clock, Send, UtensilsCrossed, Calculator, Zap, PlusCircle } from 'lucide-react';
import { unitLabels } from '../data/foodDatabase';
import type { SavedMeal, NutritionValues } from '../types';

interface MealsTabProps {
  meals: SavedMeal[];
  onDeleteMeal: (id: string) => void;
  onSendToTelegram: (meal: SavedMeal) => void;
  telegramConfigured: boolean;
  onAddMealToToday: (meal: SavedMeal) => void;
}

const emptyNutrition: NutritionValues = {
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0, grams: 0,
};

const egyptianFoods = [
  'عيش بلدي', 'طعمية', 'فلافل', 'فول مدمس', 'عدس', 'كشري', 'ملوخية',
  'بامية', 'محشي', 'ورق عنب', 'دوالي', 'مسقعة', 'بابا غنوج', 'حمص',
  'كنافة', 'بليلة', 'أم علي', 'رز بلبن', 'سحلب', 'فطير مشلتت', 'حواوشي'
];

const mealEmojis = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍿',
  dessert: '🍰',
  egyptian: '🇪🇬',
  international: '🌍',
};

const egyptianTips = [
  '💡 الفول والطعمية غنيان بالبروتين النباتي، مثاليان لوجبة الفطور',
  '🌾 الكشري وجبة متكاملة تحتوي على كاربوهيدرات وبروتين وألياف',
  '🥬 الملوخية غنية بالحديد وفيتامين C، مفيدة للدم',
  '🧄 الثوم والبصل في الأكل المصري يعززان المناعة',
  '🌿 البقدونس والكزبرة غنيان بالحديد والفيتامينات',
  '🍚 الأرز بالشعيرية وجبة أساسية في المطبخ المصري',
  '🧆 الحمص والطعمية مصدر ممتاز للبروتين النباتي',
  '🍲 الشوربة العدس غنية بالبروتين والألياف ومفيدة للجهاز الهضمي',
];

export default function MealsTab({ 
  meals, 
  onDeleteMeal, 
  onSendToTelegram, 
  telegramConfigured,
  onAddMealToToday
}: MealsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalAllMeals = useMemo(() => {
    return meals.reduce((acc, meal) => ({
      calories: Math.round((acc.calories + meal.totalNutrition.calories) * 10) / 10,
      protein: Math.round((acc.protein + meal.totalNutrition.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + meal.totalNutrition.carbs) * 10) / 10,
      fat: Math.round((acc.fat + meal.totalNutrition.fat) * 10) / 10,
      fiber: Math.round((acc.fiber + meal.totalNutrition.fiber) * 10) / 10,
      sugar: Math.round((acc.sugar + meal.totalNutrition.sugar) * 10) / 10,
      sodium: Math.round((acc.sodium + meal.totalNutrition.sodium) * 10) / 10,
      iron: Math.round((acc.iron + meal.totalNutrition.iron) * 10) / 10,
      calcium: Math.round((acc.calcium + meal.totalNutrition.calcium) * 10) / 10,
      vitaminC: Math.round((acc.vitaminC + meal.totalNutrition.vitaminC) * 10) / 10,
      grams: Math.round((acc.grams + meal.totalNutrition.grams) * 10) / 10,
    }), { ...emptyNutrition });
  }, [meals]);

  function isEgyptianMeal(meal: SavedMeal): boolean {
    return meal.entries.some(entry => 
      egyptianFoods.some(food => 
        entry.foodNameAr.includes(food) || entry.foodName.includes(food)
      )
    );
  }

  function getMealEmoji(meal: SavedMeal): string {
    if (isEgyptianMeal(meal)) return '🇪🇬';
    const hour = new Date(meal.createdAt).getHours();
    if (hour >= 5 && hour < 11) return mealEmojis.breakfast;
    if (hour >= 11 && hour < 16) return mealEmojis.lunch;
    if (hour >= 16 && hour < 21) return mealEmojis.dinner;
    return mealEmojis.snack;
  }

  function getMealTip(meal: SavedMeal): string | null {
    if (!isEgyptianMeal(meal)) return null;
    const tipIndex = meal.entries.reduce((acc, entry) => 
      acc + entry.foodNameAr.length, 0
    ) % egyptianTips.length;
    return egyptianTips[tipIndex];
  }

  function countEgyptianItems(meal: SavedMeal): number {
    return meal.entries.filter(entry =>
      egyptianFoods.some(food => 
        entry.foodNameAr.includes(food) || entry.foodName.includes(food)
      )
    ).length;
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('ar', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  if (meals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-16 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-5 opacity-20"
        >
          🍱
        </motion.div>
        <h3 className="text-lg font-bold text-white/20 mb-2">لا توجد وجبات محفوظة</h3>
        <p className="text-white/10 text-sm">أضف أطعمة في الحاسبة واحفظها كوجبة</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Total Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-primary-500/10 via-emerald-500/5 to-amber-500/10 border border-primary-500/20"
        style={{ boxShadow: '0 0 40px rgba(14, 165, 233, 0.1), 0 0 80px rgba(16, 185, 129, 0.05)' }}
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-white/30 text-xs bg-white/[0.03] px-3 py-1.5 rounded-full">
              <Calculator size={12} />
              <span>{meals.length} وجبة محفوظة</span>
              {meals.some(m => isEgyptianMeal(m)) && (
                <span className="mr-1 text-amber-400/50">🇪🇬</span>
              )}
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              إجمالي جميع الوجبات
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl p-4 text-center border border-orange-500/20"
            >
              <div className="text-3xl font-black text-orange-400" style={{ textShadow: '0 0 20px rgba(249, 115, 22, 0.5)' }}>
                {Math.round(totalAllMeals.calories)}
              </div>
              <div className="text-[10px] text-white/30 mt-1">🔥 سعرات</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl p-4 text-center border border-blue-500/20"
            >
              <div className="text-3xl font-black text-blue-400" style={{ textShadow: '0 0 20px rgba(14, 165, 233, 0.5)' }}>
                {Math.round(totalAllMeals.protein)}g
              </div>
              <div className="text-[10px] text-white/30 mt-1">💪 بروتين</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-2xl p-4 text-center border border-amber-500/20"
            >
              <div className="text-3xl font-black text-amber-400" style={{ textShadow: '0 0 20px rgba(245, 158, 11, 0.5)' }}>
                {Math.round(totalAllMeals.carbs)}g
              </div>
              <div className="text-[10px] text-white/30 mt-1">🌾 كارب</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-pink-500/20 to-rose-500/10 rounded-2xl p-4 text-center border border-pink-500/20"
            >
              <div className="text-3xl font-black text-pink-400" style={{ textShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}>
                {Math.round(totalAllMeals.fat)}g
              </div>
              <div className="text-[10px] text-white/30 mt-1">🧈 دهون</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
            {[
              { label: 'ألياف', val: `${totalAllMeals.fiber}g`, emoji: '🥬', color: 'text-green-400' },
              { label: 'سكر', val: `${totalAllMeals.sugar}g`, emoji: '🍬', color: 'text-purple-400' },
              { label: 'صوديوم', val: `${Math.round(totalAllMeals.sodium)}mg`, emoji: '🧂', color: 'text-slate-400' },
              { label: 'حديد', val: `${totalAllMeals.iron}mg`, emoji: '🩸', color: 'text-red-400' },
              { label: 'كالسيوم', val: `${Math.round(totalAllMeals.calcium)}mg`, emoji: '🦴', color: 'text-teal-400' },
              { label: 'الوزن', val: `${Math.round(totalAllMeals.grams)}g`, emoji: '⚖️', color: 'text-white/40' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="bg-white/[0.02] rounded-xl p-2 text-center border border-white/[0.03]"
              >
                <span className="text-sm">{item.emoji}</span>
                <div className={`text-xs font-bold ${item.color}`}>{item.val}</div>
                <div className="text-[8px] text-white/20">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-sm font-bold text-white/60 flex items-center gap-2">
          <UtensilsCrossed size={14} className="text-primary-400" />
          الوجبات المحفوظة
        </h2>
      </motion.div>

      {/* Meals list */}
      <AnimatePresence>
        {meals.map((meal, i) => {
          const isExpanded = expandedId === meal.id;
          const isEgyptian = isEgyptianMeal(meal);
          const egyptianCount = countEgyptianItems(meal);
          const mealEmoji = getMealEmoji(meal);
          const tip = getMealTip(meal);

          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-3xl overflow-hidden transition-all duration-300 ${
                isEgyptian ? 'border-amber-500/20 border' : ''
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : meal.id)}
                className="w-full p-5 flex items-start justify-between text-right"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 text-white/15"
                >
                  <ChevronDown size={18} />
                </motion.div>

                <div className="flex-1 mr-3">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-lg">{mealEmoji}</span>
                    <h3 className="text-white font-bold text-base">
                      {meal.name}
                      {isEgyptian && (
                        <span className="text-amber-400/50 text-xs mr-1.5">🇪🇬</span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 text-[10px] text-white/20 mt-1 flex-wrap">
                    <Clock size={10} />
                    <span>{formatDate(meal.createdAt)}</span>
                    <span>•</span>
                    <span>{meal.entries.length} عنصر</span>
                    {isEgyptian && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400/30">{egyptianCount} أكلات مصرية</span>
                      </>
                    )}
                  </div>

                  {tip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 text-[10px] text-amber-400/40 bg-amber-500/5 rounded-xl px-3 py-1.5 border border-amber-500/10"
                    >
                      {tip}
                    </motion.div>
                  )}

                  <div className="flex flex-wrap gap-1.5 justify-end mt-3">
                    <span className="text-[10px] bg-gradient-to-r from-orange-500/15 to-red-500/10 text-orange-400/90 px-2.5 py-1 rounded-full font-semibold border border-orange-500/20">
                      🔥 {Math.round(meal.totalNutrition.calories)}
                    </span>
                    <span className="text-[10px] bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-400/90 px-2.5 py-1 rounded-full font-semibold border border-blue-500/20">
                      💪 {Math.round(meal.totalNutrition.protein)}g
                    </span>
                    <span className="text-[10px] bg-gradient-to-r from-amber-500/15 to-yellow-500/10 text-amber-400/90 px-2.5 py-1 rounded-full font-semibold border border-amber-500/20">
                      🌾 {Math.round(meal.totalNutrition.carbs)}g
                    </span>
                    <span className="text-[10px] bg-gradient-to-r from-pink-500/15 to-rose-500/10 text-pink-400/90 px-2.5 py-1 rounded-full font-semibold border border-pink-500/20">
                      🧈 {Math.round(meal.totalNutrition.fat)}g
                    </span>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 border-t border-white/[0.03] pt-4">
                      {meal.entries.map((entry, j) => {
                        const isEgyptianFood = egyptianFoods.some(food => 
                          entry.foodNameAr.includes(food) || entry.foodName.includes(food)
                        );
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.03 }}
                            className={`flex items-center justify-between text-xs rounded-xl px-3 py-2.5 border ${
                              isEgyptianFood 
                                ? 'bg-amber-500/5 border-amber-500/15' 
                                : 'bg-white/[0.02] border-white/[0.03]'
                            }`}
                          >
                            <span className="text-white/25 font-mono text-[10px]">{entry.nutrition.calories} cal</span>
                            <span className="text-white/50 text-right text-[11px] flex items-center gap-2">
                              {isEgyptianFood && <span className="text-amber-400/30">🇪🇬</span>}
                              {entry.foodNameAr} — {entry.quantity} {unitLabels[entry.unit] || entry.unit}
                            </span>
                          </motion.div>
                        );
                      })}

                      <div className="flex gap-2 mt-4 flex-wrap">
                        {/* زر إضافة الوجبة إلى اليوم */}
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onAddMealToToday(meal)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-emerald-500/5 text-primary-400/70 hover:text-primary-400 transition-all text-xs font-medium border border-primary-500/10 hover:border-primary-500/30"
                        >
                          <PlusCircle size={14} />
                          أضف لقائمة اليوم
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => onDeleteMeal(meal.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/5 text-red-400/70 hover:text-red-400 transition-all text-xs font-medium border border-red-500/10 hover:border-red-500/30"
                        >
                          <Trash2 size={14} />
                          حذف
                        </motion.button>
                        {telegramConfigured && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSendToTelegram(meal)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/5 text-blue-400/70 hover:text-blue-400 transition-all text-xs font-medium border border-blue-500/10 hover:border-blue-500/30"
                          >
                            <Send size={14} />
                            إرسال لتيليغرام
                          </motion.button>
                        )}
                      </div>

                      {isEgyptian && (
                        <div className="text-center text-[9px] text-amber-400/20 bg-amber-500/5 rounded-xl py-1.5 border border-amber-500/5">
                          🧆 وجبة مصرية تحتوي على {egyptianCount} أكلات تقليدية
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}