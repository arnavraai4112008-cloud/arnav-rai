import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const BidForm = ({ playerId, currentHighestBid, onBidPlaced, duration, onDurationChange }) => {
  const { currentUser } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to place a bid');
      return;
    }

    if (!duration) {
      toast.error('Please select a timer duration first');
      return;
    }

    const amount = parseFloat(bidAmount);
    const minBid = currentHighestBid ? currentHighestBid + 0.5 : 0;

    if (!amount || amount <= minBid) {
      toast.error(`Bid must be greater than ₹${minBid}L`);
      return;
    }

    setIsSubmitting(true);

    try {
      const bidData = {
        player_id: playerId,
        user_id: currentUser.id,
        bid_amount: amount
      };

      await pb.collection('bids').create(bidData, { $autoCancel: false });
      
      setBidAmount('');
      
      if (onBidPlaced) {
        onBidPlaced(amount);
      }
    } catch (error) {
      toast.error('Failed to place bid: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Timer Duration</Label>
        <RadioGroup 
          value={duration?.toString()} 
          onValueChange={(v) => onDurationChange(parseInt(v))}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10" id="r1" />
            <Label htmlFor="r1">10s</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="15" id="r2" />
            <Label htmlFor="r2">15s</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="20" id="r3" />
            <Label htmlFor="r3">20s</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label htmlFor="bidAmount" className="text-base font-semibold">Your Bid Amount (in Lakhs)</Label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
            <Input
              id="bidAmount"
              type="number"
              step="0.5"
              min={currentHighestBid ? currentHighestBid + 0.5 : 0.5}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Min: ${currentHighestBid ? currentHighestBid + 0.5 : 0.5}L`}
              className="pl-8 text-foreground text-lg h-12"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">L</span>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !duration} 
            className="h-12 px-8 text-base font-semibold"
          >
            {isSubmitting ? 'Placing...' : 'Place Bid'}
          </Button>
        </div>
        {currentHighestBid && (
          <p className="text-sm text-muted-foreground">
            Current highest bid: <span className="font-semibold text-foreground">₹{currentHighestBid}L</span>
          </p>
        )}
      </div>
    </form>
  );
};

export default BidForm;
