// components/FeedbackButton.tsx
import React from 'react';
import { useTranslations } from 'next-intl'
import { feedbackLinks } from "@/lib/feedbackLinks";
import { useLocale } from 'next-intl'

const FeedbackButton = () => {
  const t = useTranslations('common') // 공통 메시지 영역
  const locale = useLocale()

  const feedbackUrl = feedbackLinks[locale == 'zh-hant' ? 'en' : locale || "ko"]; // 기본값은 영어

  return (
    <a
      href={feedbackUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ff5722',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '999px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontWeight: 'bold',
        textDecoration: 'none'
      }}
    >
      {t('feedback')}
    </a>
  );
};

export default FeedbackButton;
