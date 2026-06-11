import { useGameStore } from "../store/gameStore";
import {
  Coins,
  Star,
  Award,
  Pause,
  Play,
  RotateCcw,
  BarChart3,
  Users,
} from "lucide-react";

export default function StatusBar() {
  const coins = useGameStore((s) => s.coins);
  const reputation = useGameStore((s) => s.reputation);
  const petsServed = useGameStore((s) => s.petsServed);
  const isPaused = useGameStore((s) => s.isPaused);
  const togglePause = useGameStore((s) => s.togglePause);
  const resetGame = useGameStore((s) => s.resetGame);
  const customers = useGameStore((s) => s.customers);
  const toggleReportPanel = useGameStore((s) => s.toggleReportPanel);

  const level = Math.floor(petsServed / 10) + 1;
  const regularCount = customers.filter((c) => c.totalVisits >= 3).length;

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b-2 border-orange-200 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-full">
          <Coins className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-amber-800 text-lg tabular-nums">
            {coins}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-100 px-4 py-1.5 rounded-full">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
          <span className="font-bold text-yellow-800 text-lg tabular-nums">
            {reputation}
          </span>
          <span className="text-yellow-600 text-sm">口碑</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-100 px-4 py-1.5 rounded-full">
          <Award className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-emerald-800">Lv.{level}</span>
        </div>
        <div className="text-orange-600 text-sm font-medium">
          已服务 <span className="font-bold">{petsServed}</span> 只宠物
        </div>
        <div className="flex items-center gap-1.5 bg-sky-100 px-4 py-1.5 rounded-full">
          <Users className="w-5 h-5 text-sky-600" />
          <span className="font-bold text-sky-800 text-sm">
            {customers.length}
          </span>
          <span className="text-sky-600 text-xs">客户</span>
          {regularCount > 0 && (
            <span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
              ⭐{regularCount}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleReportPanel}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-200 to-purple-200 hover:from-indigo-300 hover:to-purple-300 rounded-full transition-colors text-indigo-800 font-medium shadow-sm"
        >
          <BarChart3 className="w-4 h-4" />
          经营报表
        </button>
        <button
          onClick={togglePause}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-200 hover:bg-orange-300 rounded-full transition-colors text-orange-800 font-medium"
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
          {isPaused ? "继续" : "暂停"}
        </button>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-red-100 hover:bg-red-200 rounded-full transition-colors text-red-700 font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          重来
        </button>
      </div>
    </div>
  );
}
