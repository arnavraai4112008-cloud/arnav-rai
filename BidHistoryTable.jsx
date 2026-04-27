import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

const BidHistoryTable = ({ bids }) => {
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No bids placed yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bidder</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="font-medium">
                {bid.expand?.user_id?.name || bid.expand?.user_id?.email || 'Anonymous'}
              </TableCell>
              <TableCell className="font-semibold text-primary">
                ₹{bid.bid_amount}L
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(bid.timestamp), 'MMM dd, yyyy HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BidHistoryTable;
