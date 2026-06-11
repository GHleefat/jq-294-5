import StatusBar from "../components/StatusBar";
import WaitingQueue from "../components/WaitingQueue";
import GroomingStation from "../components/GroomingStation";
import UpgradeShop from "../components/UpgradeShop";
import SettlementPopup from "../components/SettlementPopup";
import GameOverScreen from "../components/GameOverScreen";
import ReportPanel from "../components/ReportPanel";
import { useGameStore } from "../store/gameStore";
import { useGameLoop } from "../hooks/useGameLoop";

export default function GamePage() {
  useGameLoop();
  const stations = useGameStore((s) => s.stations);
  const addPetToQueue = useGameStore((s) => s.addPetToQueue);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <StatusBar />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 flex-shrink-0 p-3">
          <WaitingQueue />
        </div>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-orange-800 text-lg flex items-center gap-2">
              🏠 美容工作台
            </h2>
            <button
              onClick={addPetToQueue}
              className="px-3 py-1 bg-orange-300 hover:bg-orange-400 text-orange-900 rounded-full text-sm font-medium transition-colors"
            >
              + 召唤宠物
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {stations.map((station) => (
              <GroomingStation key={station.id} station={station} />
            ))}
          </div>
        </div>

        <div className="w-64 flex-shrink-0 p-3">
          <UpgradeShop />
        </div>
      </div>

      <SettlementPopup />
      <GameOverScreen />
      <ReportPanel />
    </div>
  );
}
