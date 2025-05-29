'use client';

import { useLocale } from 'next-intl';
import { getFoodsData } from '@/lib/getFoodsData';

export default function Page() {
  const locale = useLocale();
  const foods = getFoodsData(locale);

  return (
    <div>
      <h1>🍱 {locale.toUpperCase()} - Foods</h1>
      <ul className="list-disc pl-5">
        {foods.map((food: any) => (
          <li key={food.name}>{food.name}</li>
        ))}
      </ul>
    </div>
  );
}
