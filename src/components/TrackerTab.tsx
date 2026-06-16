import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Sparkles, ListChecks } from 'lucide-react';
import FoodSearch from './FoodSearch';
import FoodList from './FoodList';
import NutritionSummary from './NutritionSummary';
import type { FoodEntry, NutritionValues, SavedMeal, UserProfile } from '../types';

interface TrackerTabProps {
  onSaveMeal: (meal: SavedMeal) => void;
  entries: FoodEntry[];
  setEntries: React.Dispatch<React.SetStateAction<FoodEntry[]>>;
  profile: UserProfile | null;
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

export default function TrackerTab({ onSaveMeal, entries, setEntries, profile }: TrackerTabProps) {
  const [mealName, setMealName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = sumNutrition(entries);

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
    const meal: SavedMeal = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: mealName.trim(),
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
          ابحث وأضف طعامك
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
                onClick={() => setShowSaveDialog(true)}
                className="btn-glow text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white font-medium"
              >
                <Save size={13} />
                حفظ كوجبة
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
          </h2>
        </div>
        <FoodList entries={entries} onRemoveEntry={removeEntry} />
      </motion.div>

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
                <div className="text-4xl mb-2">🍱</div>
                <h3 className="text-lg font-bold text-white">حفظ كوجبة</h3>
                <p className="text-xs text-white/25 mt-1">{entries.length} عنصر — {Math.round(total.calories)} سعرة</p>
              </div>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="اسم الوجبة (مثلاً: فطور صباحي)"
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
                  حفظ ✓
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
            ✅ تم حفظ الوجبة بنجاح!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nutrition Summary */}
      <NutritionSummary total={total} entryCount={entries.length} profile={profile} />
    </div>
  );
}
