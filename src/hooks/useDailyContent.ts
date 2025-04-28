
import { useQuery } from '@tanstack/react-query';
import dailyContentService, { ContentItem, DailyContentData } from '../services/dailyContentService';

// Hook to fetch all daily content (halacha, chasidut, parasha)
export const useDailyContent = () => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dailyContent'],
    queryFn: () => dailyContentService.getDailyContent(),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
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

// Hook to fetch content by specific category
export const useContentByCategory = (category: 'halacha' | 'chasidut' | 'parasha') => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['content', category],
    queryFn: () => dailyContentService.getContentByCategory(category),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
  });

  return {
    items: data || [],
    isLoading,
    error,
    refetch
  };
};

// Hook to fetch a specific content item by ID
export const useContentItem = (id: string | undefined) => {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['contentItem', id],
    queryFn: () => id ? dailyContentService.getContentById(id) : null,
    enabled: !!id, // Only run query if id is provided
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
  });

  return {
    item: data,
    isLoading,
    error
  };
};
