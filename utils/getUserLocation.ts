let cachedCountryCode: string | null = null;

export async function getUserCountryCode(): Promise<string | null> {
  // 1. 메모리 캐시 확인
  if (cachedCountryCode) {
    return cachedCountryCode;
  }

  // 2. 세션 스토리지 확인 (브라우저 환경)
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('userCountryCode');
    if (stored) {
      cachedCountryCode = stored;
      return stored;
    }
  }

  // 3. ipapi 호출
  try {
    const ipapiRes = await fetch('https://ipapi.co/json/');
    if (ipapiRes.ok) {
      const data = await ipapiRes.json();
      if (data?.country_code) {
        cachedCountryCode = data.country_code;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userCountryCode', <string>cachedCountryCode);
        }
        return cachedCountryCode;
      }
    }
  } catch (err) {
    console.warn('ipapi failed:', err);
  }

  // 4. ipinfo fallback
  try {
    const ipinfoRes = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_PUBLIC_IPINFO_TOKEN}`);
    if (ipinfoRes.ok) {
      const data = await ipinfoRes.json();
      if (data?.country) {
        cachedCountryCode = data.country;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userCountryCode', <string>cachedCountryCode);
        }
        return cachedCountryCode;
      }
    }
  } catch (err) {
    console.warn('ipinfo failed:', err);
  }

  // 5. fallback: 한국
  cachedCountryCode = 'KR';
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userCountryCode', cachedCountryCode);
  }
  return cachedCountryCode;
}
