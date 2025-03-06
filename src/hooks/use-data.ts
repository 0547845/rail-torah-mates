
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  userService, 
  topicsService, 
  trainService, 
  matchesService, 
  chatService,
  analyticsService
} from '../services/api';
import { useToast } from './use-toast';
import { useUser } from '../contexts/UserContext';

export const useAuth = () => {
  const { toast } = useToast();
  const { setUser } = useUser();
  const queryClient = useQueryClient();
  
  const registerMutation = useMutation({
    mutationFn: userService.register,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "נרשמת בהצלחה!",
        description: "ברוך הבא לחברותא ברכבת",
      });
      
      // Log analytics event
      analyticsService.logEvent('user_registered', {
        userId: data.user.id,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בהרשמה",
        description: error.response?.data?.message || "אירעה שגיאה בעת ההרשמה. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  const googleAuthMutation = useMutation({
    mutationFn: userService.googleAuth,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "התחברת בהצלחה!",
        description: `ברוך הבא ${data.user.nickname}`,
      });
      
      // Log analytics event
      analyticsService.logEvent('user_logged_in', {
        userId: data.user.id,
        method: 'google',
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בהתחברות",
        description: error.response?.data?.message || "אירעה שגיאה בעת ההתחברות. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  return {
    register: registerMutation.mutate,
    googleAuth: googleAuthMutation.mutate,
    isLoading: registerMutation.isPending || googleAuthMutation.isPending
  };
};

export const useTopics = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  const { data: topics, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsService.getTopics,
    enabled: !!user
  });
  
  const saveTopicsMutation = useMutation({
    mutationFn: (topicIds: string[]) => topicsService.saveUserTopics(user?.id || '', topicIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "תחומי הלימוד נשמרו",
        description: "בחירת תחומי הלימוד נשמרה בהצלחה",
      });
      
      // Log analytics event
      analyticsService.logEvent('topics_selected', {
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בשמירה",
        description: error.response?.data?.message || "אירעה שגיאה בעת שמירת תחומי הלימוד. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  return {
    topics,
    isTopicsLoading,
    saveTopics: saveTopicsMutation.mutate,
    isSaving: saveTopicsMutation.isPending
  };
};

export const useTrainStations = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  const { data: stations, isLoading: isStationsLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: trainService.getStations,
    enabled: !!user
  });
  
  const getSchedulesMutation = useMutation({
    mutationFn: ({ departureId, arrivalId, date }: { departureId: string, arrivalId: string, date: string }) => 
      trainService.getSchedules(departureId, arrivalId, date),
    onSuccess: (data) => {
      // Log analytics event
      analyticsService.logEvent('schedules_requested', {
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בטעינת לוחות זמנים",
        description: error.response?.data?.message || "אירעה שגיאה בעת טעינת לוחות הזמנים. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  const saveRouteMutation = useMutation({
    mutationFn: (routeData: any) => trainService.saveUserRoute(user?.id || '', routeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "המסלול נשמר",
        description: "בחירת המסלול נשמרה בהצלחה",
      });
      
      // Log analytics event
      analyticsService.logEvent('route_selected', {
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בשמירה",
        description: error.response?.data?.message || "אירעה שגיאה בעת שמירת המסלול. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  return {
    stations,
    isStationsLoading,
    getSchedules: getSchedulesMutation.mutate,
    isLoadingSchedules: getSchedulesMutation.isPending,
    saveRoute: saveRouteMutation.mutate,
    isSavingRoute: saveRouteMutation.isPending,
    schedules: getSchedulesMutation.data
  };
};

export const useMatches = () => {
  const { toast } = useToast();
  const { user } = useUser();
  
  const { data: matches, isLoading: isMatchesLoading, refetch } = useQuery({
    queryKey: ['matches', user?.id],
    queryFn: () => matchesService.findMatches(user?.id || ''),
    enabled: !!user
  });
  
  const rateMatchMutation = useMutation({
    mutationFn: ({ matchId, rating, feedback }: { matchId: string, rating: number, feedback?: string }) => 
      matchesService.rateMatch(matchId, rating, feedback),
    onSuccess: () => {
      toast({
        title: "תודה על הדירוג!",
        description: "הדירוג שלך נשמר בהצלחה",
      });
      
      // Log analytics event
      analyticsService.logEvent('match_rated', {
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בדירוג",
        description: error.response?.data?.message || "אירעה שגיאה בעת שמירת הדירוג. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  return {
    matches,
    isMatchesLoading,
    rateMatch: rateMatchMutation.mutate,
    isRating: rateMatchMutation.isPending,
    refreshMatches: refetch
  };
};

export const useChat = (chatId: string) => {
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  
  const { data: messages, isLoading: isMessagesLoading, refetch } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatService.getMessages(chatId),
    enabled: !!chatId && !!user,
    refetchInterval: 5000 // Poll for new messages every 5 seconds
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => chatService.sendMessage(chatId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      
      // Log analytics event
      analyticsService.logEvent('message_sent', {
        userId: user?.id,
        chatId,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה בשליחת הודעה",
        description: error.response?.data?.message || "אירעה שגיאה בעת שליחת ההודעה. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  const initiateChatMutation = useMutation({
    mutationFn: (matchId: string) => chatService.initiateChat(user?.id || '', matchId),
    onSuccess: () => {
      toast({
        title: "צ'אט חדש נוצר",
        description: "הצ'אט נוצר בהצלחה. אתה יכול להתחיל לשלוח הודעות.",
      });
      
      // Log analytics event
      analyticsService.logEvent('chat_initiated', {
        userId: user?.id,
        chatId,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה ביצירת צ'אט",
        description: error.response?.data?.message || "אירעה שגיאה בעת יצירת הצ'אט. נסה שנית.",
        variant: "destructive",
      });
    }
  });
  
  const setTypingStatus = useCallback((status: boolean) => {
    setIsTyping(status);
    // In a real app, this would emit an event to a WebSocket server
  }, []);
  
  return {
    messages,
    isMessagesLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    initiateChat: initiateChatMutation.mutate,
    isInitiating: initiateChatMutation.isPending,
    refreshMessages: refetch,
    isTyping,
    setTypingStatus
  };
};

// This hook can be expanded based on future needs
export const useAnalytics = () => {
  const logEvent = useCallback((eventName: string, eventData: any) => {
    analyticsService.logEvent(eventName, eventData)
      .catch(error => console.error('Analytics error:', error));
  }, []);
  
  return { logEvent };
};
