"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Award, ArrowLeft, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserRewards({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rewards] = useState([
    { id: 1, name: '10% Service Discount', points: 500, description: 'Get 10% off on any service' },
    { id: 2, name: 'Premium Feature Access', points: 1000, description: 'One month access to premium tools' },
    { id: 3, name: 'Business Consultation', points: 2000, description: '1-hour business consultation' },
  ]);

  const paramsRef = React.use(params);
  useEffect(() => {
    // Fetch user data
    fetch(`/api/users/${paramsRef.id}`)
      .then((res) => res.json())
      .then(setUser);

    // Fetch transactions
    fetch(`/api/transactions?userId=${paramsRef.id}`)
      .then((res) => res.json())
      .then(setTransactions);
  }, [paramsRef.id]);

  const handleRedeemReward = async (rewardId) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          type: 'reward_redemption',
          points: -reward.points,
          description: `Redeemed: ${reward.name}`,
        }),
      });

      if (response.ok) {
        // Refresh user data and transactions
        const [updatedUser, updatedTransactions] = await Promise.all([
          fetch(`/api/users/${paramsRef.id}`).then(res => res.json()),
          fetch(`/api/transactions?userId=${paramsRef.id}`).then(res => res.json())
        ]);
        setUser(updatedUser);
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Badge variant="outline" className="text-lg">
          {user.points} Points Available
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {user.name}&apos;s Rewards Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500 mb-6">
            Email: {user.email}
          </div>
          <div className="mb-6">
            <div className="text-sm font-medium mb-2">Progress to next tier</div>
            <Progress value={((user.points % 1000) / 1000) * 100} className="mb-2" />
            <div className="text-sm text-gray-500">
              {1000 - (user.points % 1000)} points until next tier
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {reward.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{reward.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">{reward.points} Points</Badge>
                <Button
                  onClick={() => handleRedeemReward(reward.id)}
                  disabled={user.points < reward.points}
                >
                  Redeem
                </Button>
              </div>
              {user.points < reward.points && (
                <div className="mt-4">
                  <Progress 
                    value={(user.points / reward.points) * 100} 
                    className="mb-2"
                  />
                  <div className="text-sm text-gray-500">
                    {reward.points - user.points} points needed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {transaction.points > 0 ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={transaction.points > 0 ? "success" : "destructive"}
                  className="ml-4"
                >
                  {transaction.points > 0 ? '+' : ''}{transaction.points} Points
                </Badge>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center text-gray-500 py-6">
                No transactions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}