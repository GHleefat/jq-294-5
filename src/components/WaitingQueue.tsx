import { useGameStore } from "../store/gameStore";
import PetCard from "./PetCard";
import { Clock, Users, Cookie } from "lucide-react";

export default function WaitingQueue() {
  const queue = useGameStore((s) => s.queue);
  const maxQueueSize = useGameStore((s) => s.maxQueueSize);
  const snackCount = useGameStore((s) => s.snackCount);
  const feedPet = useGameStore((s) => s.feedPet);
  const feedingPetId = useGameStore((s) => s.feedingPetId);

  const handleFeed = (petId: string) => {
    feedPet(petId, "queue");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl border-2 border-orange-200 shadow-inner overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-orange-100 border-b border-orange-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          <span className="font-bold text-orange-800">等候区</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full">
            <Cookie className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-amber-700 tabular-nums">{snackCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="tabular-nums">{queue.length}/{maxQueueSize}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-orange-300 py-8">
            <span className="text-4xl mb-2">🏠</span>
            <span className="text-sm">等待宠物光临...</span>
          </div>
        ) : (
          queue.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              inQueue
              showFeedButton
              onFeed={() => handleFeed(pet.id)}
              isFeeding={feedingPetId === pet.id}
            />
          ))
        )}
      </div>
      {queue.length > 0 && (
        <div className="px-4 py-2 bg-orange-100/50 border-t border-orange-200 text-center">
          <span className="text-xs text-orange-500">⬆ 拖拽宠物到美容台 · 🍪 点击投喂恢复耐心</span>
        </div>
      )}
    </div>
  );
}
