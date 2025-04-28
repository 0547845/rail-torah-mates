
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Share2, Send, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContentItem } from '../services/dailyContentService';

interface ContentSharingDialogProps {
  contentItem: ContentItem;
  onShare?: (message: string, recipientId?: string) => void;
  matchId?: string;
  compact?: boolean;
}

const ContentSharingDialog: React.FC<ContentSharingDialogProps> = ({
  contentItem,
  onShare,
  matchId,
  compact = false
}) => {
  const [additionalMessage, setAdditionalMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleShare = () => {
    if (onShare) {
      const message = formattedShareMessage();
      onShare(message, matchId);
    }
    toast({
      title: "התוכן שותף בהצלחה",
      description: "התוכן נשלח לחברותא שלך",
    });
  };

  const formattedShareMessage = () => {
    return `שלום! רציתי לשתף איתך את התוכן הבא:\n\n${contentItem.title}\n\n${contentItem.content}\n\nמקור: ${contentItem.source || 'לא צוין'}\n${additionalMessage ? '\nהערה אישית: ' + additionalMessage : ''}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedShareMessage()).then(() => {
      setCopied(true);
      toast({
        title: "הועתק ללוח",
        description: "התוכן הועתק בהצלחה",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant={compact ? "ghost" : "secondary"} 
          size={compact ? "icon" : "sm"}
          className="transition-all hover:scale-105"
        >
          <Share2 className={compact ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {!compact && "שתף תוכן"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>שתף תוכן לימודי</DialogTitle>
          <DialogDescription>
            שתף את התוכן עם החברותא שלך או העתק אותו ללוח
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] mt-4">
          <div className="p-4 border rounded-md mb-4">
            <h3 className="font-bold mb-2">{contentItem.title}</h3>
            <p className="mb-2 text-sm">{contentItem.content}</p>
            {contentItem.source && (
              <div className="text-xs text-muted-foreground">מקור: {contentItem.source}</div>
            )}
          </div>
        </ScrollArea>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="additional-message">הערה אישית (אופציונלי)</Label>
            <Input
              id="additional-message"
              placeholder="הוסף הערה אישית לשיתוף..."
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              className="focus-ring"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between flex flex-row">
          <Button variant="outline" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            העתק ללוח
          </Button>
          {onShare && (
            <Button onClick={handleShare}>
              <Send className="h-4 w-4 mr-2" />
              שתף עם החברותא
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentSharingDialog;
