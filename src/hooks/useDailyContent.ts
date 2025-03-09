
import { useQuery } from '@tanstack/react-query';
import dailyContentService, { ContentItem } from '../services/dailyContentService';

export const useDailyContent = () => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dailyContent'],
    queryFn: () => dailyContentService.getDailyContent(),
  });

  return {
    dailyContent: data,
    isLoading,
    error,
    refetch,
    halachaItems: data?.halacha || [],
    chasidutItems: data?.chasidut || [],
    parashaItems: data?.parasha || []
  };
};

export const useContentByCategory = (category: 'halacha' | 'chasidut' | 'parasha') => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['content', category],
    queryFn: () => dailyContentService.getContentByCategory(category),
  });

  return {
    items: data || [],
    isLoading,
    error,
    refetch
  };
};
