import { useGameStore } from "../store/gameStore";
import { RotateCcw } from "lucide-react";

export default function GameOverScreen() {
  const isGameOver = useGameStore((s) => s.isGameOver);
  const petsServed = useGameStore((s) => s.petsServed);
  const coins = useGameStore((s) => s.coins);
  const resetGame = useGameStore((s) => s.resetGame);

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">😿</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">店铺关门了</h2>
        <p className="text-gray-500 mb-6">
          口味降至零，宠物们不再光临...
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 p-3 rounded-xl">
            <div className="text-2xl font-bold text-amber-700">{petsServed}</div>
            <div className="text-sm text-amber-500">服务宠物数</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl">
            <div className="text-2xl font-bold text-orange-700">{coins}</div>
            <div className="text-sm text-orange-500">累计金币</div>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="w-full py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          重新开业
        </button>
      </div>
    </div>
  );
}
