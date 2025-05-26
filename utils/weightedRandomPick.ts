export type WeightedFood = {
  name: string
  weight: number
}

export const weightedRandomPick = (foods: WeightedFood[]): string => {
  const totalWeight = foods.reduce((sum, food) => sum + food.weight, 0)
  const rand = Math.random() * totalWeight
  let cumulative = 0

  for (const food of foods) {
    cumulative += food.weight
    if (rand < cumulative) {
      return food.name
    }
  }

  // fallback (should not happen if weights are correct)
  return foods[foods.length - 1].name
}
