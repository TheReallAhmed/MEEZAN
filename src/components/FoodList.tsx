import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';
import { unitLabels } from '../data/foodDatabase';
import type { FoodEntry } from '../types';

interface FoodListProps {
  entries: FoodEntry[];
  onRemoveEntry: (id: string) => void;
}

export default function FoodList({ entries, onRemoveEntry }: FoodListProps) {
  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-4 opacity-20"
        >
          🍽️
        </motion.div>
        <p className="text-white/20 text-base font-medium">قائمتك فاضية</p>
        <p className="text-white/10 text-sm mt-1">ابحث عن طعام وأضفه هنا</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', bounce: 0.2, delay: index * 0.03 }}
            className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl p-3.5 flex items-center gap-3 transition-all duration-300"
          >
            {/* Drag handle hint */}
            <div className="text-white/[0.06] group-hover:text-white/10 transition-colors">
              <GripVertical size={14} />
            </div>

            {/* Delete */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemoveEntry(entry.id)}
              className="text-white/10 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
            >
              <Trash2 size={15} />
            </motion.button>

            {/* Nutrition pills */}
            <div className="flex-1 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-orange-400/70 bg-orange-400/10 px-2 py-0.5 rounded-full font-medium">
                {entry.nutrition.calories} cal
              </span>
              <span className="text-[10px] text-blue-400/70 bg-blue-400/10 px-2 py-0.5 rounded-full font-medium">
                {entry.nutrition.protein}g P
              </span>
              <span className="text-[10px] text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                {entry.nutrition.carbs}g C
              </span>
              <span className="text-[10px] text-pink-400/70 bg-pink-400/10 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                {entry.nutrition.fat}g F
              </span>
            </div>

            {/* Food name */}
            <div className="text-right shrink-0">
              <div className="text-white/80 font-semibold text-sm">{entry.foodNameAr}</div>
              <div className="text-white/20 text-xs mt-0.5 font-medium">
                {entry.quantity} {unitLabels[entry.unit] || entry.unit}
              </div>
            </div>

            {/* Accent line */}
            <div className="absolute right-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-primary-500/30 to-emerald-500/30" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
