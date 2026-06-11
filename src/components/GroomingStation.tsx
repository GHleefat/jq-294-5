import { useGameStore, StationState } from "../store/gameStore";
import { ServiceType, SERVICE_DATA } from "../utils/petData";
import { calculateServiceTime } from "../utils/gameLogic";
import PetCard from "./PetCard";
import { Scissors, Cookie } from "lucide-react";

interface GroomingStationProps {
  station: StationState;
}

export default function GroomingStation({ station }: GroomingStationProps) {
  const assignPetToStation = useGameStore((s) => s.assignPetToStation);
  const selectService = useGameStore((s) => s.selectService);
  const selectedStationId = useGameStore((s) => s.selectedStationId);
  const draggedPetId = useGameStore((s) => s.draggedPetId);
  const equipments = useGameStore((s) => s.equipments);
  const snackCount = useGameStore((s) => s.snackCount);
  const feedPet = useGameStore((s) => s.feedPet);
  const feedingPetId = useGameStore((s) => s.feedingPetId);

  const isSelected = selectedStationId === station.id;
  const progressRatio = station.progressMax > 0 ? station.progress / station.progressMax : 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const petId = e.dataTransfer.getData("petId");
    if (petId && !station.pet) {
      assignPetToStation(petId, station.id);
    }
  };

  const handleServiceSelect = (serviceType: ServiceType) => {
    selectService(station.id, serviceType);
  };

  const handleFeed = () => {
    if (station.pet && snackCount > 0) {
      feedPet(station.pet.id, "station", station.id);
    }
  };

  const isDropTarget = draggedPetId && !station.pet;
  const canFeed = station.pet && snackCount > 0;

  const getActualServiceTime = (serviceType: ServiceType) => {
    return calculateServiceTime(serviceType, equipments);
  };

  const getTimeSaved = (serviceType: ServiceType) => {
    const base = SERVICE_DATA[serviceType].duration;
    const actual = getActualServiceTime(serviceType);
    const saved = base - actual;
    if (saved > 0) {
      return `⚡ -${Math.round((saved / base) * 100)}%`;
    }
    return null;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[260px]
        ${station.pet && station.isWorking
          ? "bg-blue-50 border-blue-300 border-solid shadow-md"
          : station.pet
            ? "bg-amber-50 border-amber-300 border-solid shadow-sm"
            : isDropTarget
              ? "bg-emerald-50 border-emerald-400 border-solid scale-[1.02] shadow-lg"
              : "bg-white/50 border-orange-200"
        }
        ${station.feedAnimation ? "ring-4 ring-amber-300" : ""}
      `}
    >
      {!station.pet && (
        <>
          <div className="text-4xl mb-2 opacity-30">🪑</div>
          <span className="text-sm text-orange-300 font-medium">空美容台</span>
          {isDropTarget && (
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 animate-pulse flex items-center justify-center">
              <span className="text-emerald-600 font-bold">放在这里 ✨</span>
            </div>
          )}
        </>
      )}

      {station.pet && !station.isWorking && !isSelected && (
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="w-full relative">
            <PetCard
              pet={station.pet}
              inQueue={false}
              showFeedButton
              onFeed={handleFeed}
              isFeeding={feedingPetId === station.pet.id}
            />
          </div>
          <button
            onClick={() => useGameStore.setState({ selectedStationId: station.id })}
            className="w-full py-2.5 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm"
          >
            选择服务 ✨
          </button>
        </div>
      )}

      {station.pet && isSelected && !station.isWorking && (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="text-lg font-bold text-orange-800">选择服务</div>
          <div className="grid grid-cols-3 gap-2 w-full">
            {(["bath", "styling", "spa"] as ServiceType[]).map((type) => {
              const info = SERVICE_DATA[type];
              const actualTime = getActualServiceTime(type);
              const timeSaved = getTimeSaved(type);

              return (
                <button
                  key={type}
                  onClick={() => handleServiceSelect(type)}
                  className="flex flex-col items-center gap-1 p-3 bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-400 rounded-xl transition-all hover:scale-105 relative"
                >
                  {timeSaved && (
                    <span className="absolute -top-2 -right-2 text-xs bg-emerald-400 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {timeSaved}
                    </span>
                  )}
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="text-xs font-bold text-orange-800">{info.name}</span>
                  <span className="text-xs text-amber-600 font-semibold">{info.price} 💰</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 line-through">
                      {(info.duration / 1000).toFixed(0)}秒
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">
                      {(actualTime / 1000).toFixed(0)}秒
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => useGameStore.setState({ selectedStationId: null })}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            取消
          </button>
        </div>
      )}

      {station.isWorking && station.pet && (
        <div className="flex flex-col items-center gap-3 w-full">
          <div className={`text-3xl relative ${station.feedAnimation ? "animate-bounce" : ""}`}>
            {station.pet.emoji}
            {station.feedAnimation && (
              <span className="absolute -top-3 -right-3 text-xl animate-ping">🍪</span>
            )}
          </div>
          <div className="text-sm font-bold text-blue-800">
            {SERVICE_DATA[station.serviceType!]?.emoji} {SERVICE_DATA[station.serviceType!]?.name}中...
          </div>
          <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300 ease-linear relative"
              style={{ width: `${progressRatio * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Scissors className="w-4 h-4 animate-spin" style={{ animationDuration: "1s" }} />
            <span className="text-sm font-medium tabular-nums">
              {Math.round(progressRatio * 100)}%
            </span>
          </div>
          <div className="w-full bg-orange-50 rounded-xl p-2 border border-orange-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-600 font-medium">{station.pet.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFeed}
                  disabled={!canFeed}
                  className={`
                    p-1 rounded-lg transition-all
                    ${canFeed
                      ? "bg-amber-200 hover:bg-amber-300 text-amber-700 hover:scale-110"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                  title={canFeed ? "投喂零食恢复耐心" : "没有零食了"}
                >
                  <Cookie className="w-4 h-4" />
                </button>
                <span className="text-xs text-orange-400">
                  耐心 {Math.ceil(station.pet.patienceCurrent / 1000)}秒
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full rounded-full transition-all duration-300 ${station.pet.patienceCurrent / station.pet.patienceMax > 0.3 ? "bg-emerald-400" : "bg-red-400"}`}
                style={{ width: `${(station.pet.patienceCurrent / station.pet.patienceMax) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
