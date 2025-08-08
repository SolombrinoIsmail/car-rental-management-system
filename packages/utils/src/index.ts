export const formatCurrency = (amount: number, currency = 'CHF'): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('de-CH').format(dateObj);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  // Handle Swiss mobile numbers with +41 prefix (41791234567 - no leading 0)
  const mobileMatchWith41 = cleaned.match(/^(41)(7[6-9])(\d{3})(\d{2})(\d{2})$/);
  if (mobileMatchWith41) {
    return `+41 0${mobileMatchWith41[2]} ${mobileMatchWith41[3]} ${mobileMatchWith41[4]} ${mobileMatchWith41[5]}`;
  }

  // Handle Swiss mobile numbers (079, 078, 076, 077) - 10 digits total
  const mobileMatch = cleaned.match(/^(07[6-9])(\d{3})(\d{2})(\d{2})$/);
  if (mobileMatch) {
    return `+41 ${mobileMatch[1]} ${mobileMatch[2]} ${mobileMatch[3]} ${mobileMatch[4]}`;
  }

  // Handle Swiss landline numbers with +41 prefix and 2-digit area codes (41443456789 - no leading 0)
  const landlineMatchWith41 = cleaned.match(/^(41)(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (landlineMatchWith41 && landlineMatchWith41[2] && !landlineMatchWith41[2].startsWith('7')) {
    // Exclude mobile prefixes (7x)
    return `+41 ${landlineMatchWith41[2]} ${landlineMatchWith41[3]} ${landlineMatchWith41[4]} ${landlineMatchWith41[5]}`;
  }

  // Handle Swiss landline numbers with 3-digit area codes (044, 021, 031, etc.) - 10 digits total
  const landlineMatch3 = cleaned.match(/^(0\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (landlineMatch3 && landlineMatch3[1] && !landlineMatch3[1].startsWith('07')) {
    // Exclude mobile prefixes
    return `+41 ${landlineMatch3[1].substring(1)} ${landlineMatch3[2]} ${landlineMatch3[3]} ${landlineMatch3[4]}`;
  }

  // Handle Swiss landline numbers with 2-digit area codes (061, 071, etc.) - 10 digits total
  const landlineMatch2 = cleaned.match(/^(0[1-6])(\d{4})(\d{2})(\d{2})$/);
  if (landlineMatch2 && landlineMatch2[1]) {
    return `+41 ${landlineMatch2[1].substring(1)} ${landlineMatch2[2]} ${landlineMatch2[3]} ${landlineMatch2[4]}`;
  }

  // Return original if no pattern matches
  return phone;
};
