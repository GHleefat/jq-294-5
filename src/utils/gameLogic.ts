import {
  Pet,
  PetSpecies,
  PetTemperament,
  ServiceType,
  SPECIES_DATA,
  TEMPERAMENT_DATA,
  SERVICE_DATA,
  PET_NAMES,
  Equipment,
  CustomerRecord,
  TransactionRecord,
  ReportData,
} from "./petData";

const ALL_SPECIES: PetSpecies[] = [
  "orange_cat",
  "british_shorthair",
  "ragdoll",
  "siamese",
  "maine_coon",
  "corgi",
  "golden_retriever",
  "shiba",
  "poodle",
  "husky",
];

const TEMPERAMENTS: PetTemperament[] = ["calm", "normal", "impatient"];
const TEMPERAMENT_WEIGHTS = [0.3, 0.45, 0.25];

let petCounter = 0;
let customerCounter = 0;
let transactionCounter = 0;

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function generateBirthday(): string {
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function isBirthdayToday(birthday: string): boolean {
  const today = new Date();
  const todayStr = `${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  return birthday === todayStr;
}

export function isBirthdaySoon(
  birthday: string,
  daysWithin: number = 7,
): boolean {
  const today = new Date();
  const [bMonth, bDay] = birthday.split("-").map(Number);
  const thisYear = today.getFullYear();
  const birthdayDate = new Date(thisYear, bMonth - 1, bDay);
  if (birthdayDate < today) {
    birthdayDate.setFullYear(thisYear + 1);
  }
  const diffMs = birthdayDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= daysWithin;
}

export function getRegularDiscountTier(visitCount: number): {
  tier: number;
  discount: number;
  label: string;
} {
  if (visitCount >= 10) return { tier: 3, discount: 0.2, label: "VIP熟客 8折" };
  if (visitCount >= 5) return { tier: 2, discount: 0.1, label: "老顾客 9折" };
  if (visitCount >= 3) return { tier: 1, discount: 0.05, label: "熟客 95折" };
  return { tier: 0, discount: 0, label: "" };
}

export function calculateFinalPrice(
  serviceType: ServiceType,
  visitCount: number,
  isBirthday: boolean,
): {
  basePrice: number;
  regularDiscount: number;
  birthdayBonus: number;
  finalPrice: number;
  discountLabel: string;
} {
  const basePrice = SERVICE_DATA[serviceType].price;
  const { discount: regularDiscount, label } =
    getRegularDiscountTier(visitCount);
  const birthdayBonus = isBirthday ? 0.15 : 0;
  const totalDiscount = Math.min(regularDiscount + birthdayBonus, 0.4);
  const finalPrice = Math.round(basePrice * (1 - totalDiscount));

  let discountLabel = "";
  if (label) discountLabel = label;
  if (isBirthday)
    discountLabel = discountLabel
      ? `${discountLabel} + 🎂生日特惠`
      : "🎂生日特惠 85折";

  return {
    basePrice,
    regularDiscount,
    birthdayBonus,
    finalPrice,
    discountLabel,
  };
}

export function calculateBirthdayReputationBonus(isBirthday: boolean): number {
  return isBirthday ? 2 : 0;
}

export function generateRandomPet(customers: CustomerRecord[] = []): Pet {
  petCounter++;

  let chosenCustomer: CustomerRecord | null = null;
  if (customers.length > 0 && Math.random() < 0.35) {
    const regulars = customers.filter((c) => c.totalVisits >= 2);
    const pool = regulars.length > 0 ? regulars : customers;
    chosenCustomer = pool[Math.floor(Math.random() * pool.length)];
  }

  if (chosenCustomer) {
    const speciesInfo = SPECIES_DATA[chosenCustomer.species];
    const patienceBase = 60000 + Math.random() * 30000;
    const dirtyLevel = Math.floor(Math.random() * 3) + 1;
    const bday = isBirthdayToday(chosenCustomer.birthday);

    return {
      id: `pet_${Date.now()}_${petCounter}`,
      species: chosenCustomer.species,
      name: chosenCustomer.name,
      emoji: speciesInfo.emoji,
      temperament: chosenCustomer.temperament,
      patienceMax: patienceBase,
      patienceCurrent: patienceBase,
      dirtyLevel,
      arrivedAt: Date.now(),
      customerId: chosenCustomer.customerId,
      visitCount: chosenCustomer.totalVisits,
      birthday: chosenCustomer.birthday,
      isBirthday: bday,
    };
  }

  customerCounter++;
  const species = ALL_SPECIES[Math.floor(Math.random() * ALL_SPECIES.length)];
  const temperament = weightedRandom(TEMPERAMENTS, TEMPERAMENT_WEIGHTS);
  const speciesInfo = SPECIES_DATA[species];
  const names = PET_NAMES[species];
  const name = names[Math.floor(Math.random() * names.length)];
  const patienceBase = 60000 + Math.random() * 30000;
  const dirtyLevel = Math.floor(Math.random() * 3) + 1;
  const birthday = generateBirthday();
  const bday = isBirthdayToday(birthday);

  return {
    id: `pet_${Date.now()}_${petCounter}`,
    species,
    name: `${name}`,
    emoji: speciesInfo.emoji,
    temperament,
    patienceMax: patienceBase,
    patienceCurrent: patienceBase,
    dirtyLevel,
    arrivedAt: Date.now(),
    customerId: `cust_${Date.now()}_${customerCounter}`,
    visitCount: 0,
    birthday,
    isBirthday: bday,
  };
}

export function createOrUpdateCustomer(
  customers: CustomerRecord[],
  pet: Pet,
  spent: number,
): CustomerRecord[] {
  const existing = customers.find((c) => c.customerId === pet.customerId);
  const now = Date.now();

  if (existing) {
    return customers.map((c) =>
      c.customerId === pet.customerId
        ? {
            ...c,
            totalVisits: c.totalVisits + 1,
            totalSpent: c.totalSpent + spent,
            lastVisitAt: now,
          }
        : c,
    );
  }

  const newCustomer: CustomerRecord = {
    customerId: pet.customerId,
    species: pet.species,
    name: pet.name,
    emoji: pet.emoji,
    temperament: pet.temperament,
    birthday: pet.birthday,
    totalVisits: 1,
    totalSpent: spent,
    lastVisitAt: now,
    firstVisitAt: now,
  };

  return [...customers, newCustomer];
}

export function getTodayDateString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = (today.getMonth() + 1).toString().padStart(2, "0");
  const d = today.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isToday(ts: number): boolean {
  const today = new Date();
  const date = new Date(ts);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

function calculateStatsFromTransactions(txList: TransactionRecord[]): {
  income: number;
  serviceCount: number;
  serviceBreakdown: Record<ServiceType, number>;
  speciesBreakdown: Record<PetSpecies, number>;
  averageSatisfaction: number;
  discountTotal: number;
  birthdayCount: number;
  regularCount: number;
  uniqueCustomerIds: Set<string>;
} {
  const income = txList.reduce((sum, t) => sum + t.finalPrice, 0);
  const serviceCount = txList.length;
  const serviceBreakdown = { bath: 0, styling: 0, spa: 0 } as Record<
    ServiceType,
    number
  >;
  const speciesBreakdown = {} as Record<PetSpecies, number>;
  let satSum = 0;
  let discountTotal = 0;
  let birthdayCount = 0;
  let regularCount = 0;
  const uniqueCustomerIds = new Set<string>();

  for (const t of txList) {
    serviceBreakdown[t.service] = (serviceBreakdown[t.service] || 0) + 1;
    speciesBreakdown[t.species] = (speciesBreakdown[t.species] || 0) + 1;
    if (t.satisfaction === "very_satisfied") satSum += 3;
    else if (t.satisfaction === "satisfied") satSum += 2;
    else satSum += 1;
    discountTotal += t.discount;
    if (t.isBirthday) birthdayCount++;
    if (t.isRegular) regularCount++;
    uniqueCustomerIds.add(t.customerId);
  }

  return {
    income,
    serviceCount,
    serviceBreakdown,
    speciesBreakdown,
    averageSatisfaction: serviceCount > 0 ? satSum / serviceCount / 3 : 0,
    discountTotal,
    birthdayCount,
    regularCount,
    uniqueCustomerIds,
  };
}

export function generateReportData(
  transactions: TransactionRecord[],
  customers: CustomerRecord[],
): ReportData {
  const todayTxs = transactions.filter((t) => isToday(t.timestamp));
  const totalStats = calculateStatsFromTransactions(transactions);
  const todayStats = calculateStatsFromTransactions(todayTxs);

  let topSpecies: { species: PetSpecies; count: number } | null = null;
  for (const [sp, count] of Object.entries(totalStats.speciesBreakdown)) {
    if (!topSpecies || count > topSpecies.count) {
      topSpecies = { species: sp as PetSpecies, count };
    }
  }

  const topServices = (
    Object.entries(totalStats.serviceBreakdown) as [ServiceType, number][]
  )
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => ({ service, count }));

  const birthdayUpcoming = customers
    .filter((c) => isBirthdaySoon(c.birthday, 7))
    .sort((a, b) => {
      const [am, ad] = a.birthday.split("-").map(Number);
      const [bm, bd] = b.birthday.split("-").map(Number);
      return am * 31 + ad - (bm * 31 + bd);
    })
    .slice(0, 5);

  const regularCustomers = customers
    .filter((c) => c.totalVisits >= 3)
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .slice(0, 8);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8);

  return {
    totalIncome: totalStats.income,
    totalServices: totalStats.serviceCount,
    serviceBreakdown: totalStats.serviceBreakdown,
    speciesBreakdown: totalStats.speciesBreakdown,
    topSpecies,
    topServices,
    recentTransactions,
    birthdayUpcoming,
    regularCustomers,
    uniqueCustomers: customers.length,
    averageSatisfaction: totalStats.averageSatisfaction,
    today: {
      income: todayStats.income,
      serviceCount: todayStats.serviceCount,
      serviceBreakdown: todayStats.serviceBreakdown,
      speciesBreakdown: todayStats.speciesBreakdown,
      uniqueCustomers: todayStats.uniqueCustomerIds.size,
      averageSatisfaction: todayStats.averageSatisfaction,
      discountTotal: todayStats.discountTotal,
      birthdayCount: todayStats.birthdayCount,
      regularCount: todayStats.regularCount,
    },
    dateString: getTodayDateString(),
  };
}

export function createTransactionRecord(params: {
  customerId: string;
  petName: string;
  species: PetSpecies;
  service: ServiceType;
  basePrice: number;
  discount: number;
  finalPrice: number;
  satisfaction: "very_satisfied" | "satisfied" | "unsatisfied";
  isBirthday: boolean;
  isRegular: boolean;
}): TransactionRecord {
  transactionCounter++;
  return {
    id: `tx_${Date.now()}_${transactionCounter}`,
    timestamp: Date.now(),
    ...params,
  };
}

export function calculateSatisfaction(patienceRatio: number): {
  satisfaction: "very_satisfied" | "satisfied" | "unsatisfied";
  reputationChange: number;
  label: string;
  emoji: string;
} {
  if (patienceRatio > 0.6) {
    return {
      satisfaction: "very_satisfied",
      reputationChange: 3,
      label: "非常满意",
      emoji: "😍",
    };
  }
  if (patienceRatio > 0.3) {
    return {
      satisfaction: "satisfied",
      reputationChange: 1,
      label: "满意",
      emoji: "😊",
    };
  }
  return {
    satisfaction: "unsatisfied",
    reputationChange: -2,
    label: "不满意",
    emoji: "😡",
  };
}

export function calculateServiceTime(
  serviceType: ServiceType,
  equipments: Equipment[],
): number {
  const base = SERVICE_DATA[serviceType].duration;
  let speedMultiplier = 1;

  for (const eq of equipments) {
    if (!eq.purchased) continue;
    if (eq.effectType === `speed_${serviceType}`) {
      speedMultiplier *= 0.7;
    }
  }

  return base * speedMultiplier;
}

export function calculateServicePrice(serviceType: ServiceType): number {
  return SERVICE_DATA[serviceType].price;
}

export function getSpeciesInfo(species: PetSpecies) {
  return SPECIES_DATA[species];
}

export function getTemperamentMultiplier(temperament: PetTemperament): number {
  return TEMPERAMENT_DATA[temperament].multiplier;
}

export function getPatienceDecayRate(temperament: PetTemperament): number {
  return TEMPERAMENT_DATA[temperament].multiplier;
}
