import foodsKo from '@/locales/ko/foods.json';
import foodsEn from '@/locales/en/foods.json';
import foodsJa from '@/locales/ja/foods.json';

export function getFoodsData(locale: string) {
  switch (locale) {
    case 'ko':
      return foodsKo;
    case 'en':
      return foodsEn;
    case 'ja':
      return foodsJa;
    default:
      return foodsKo;
  }
}
