"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Award, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserRewards({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [rewards] = useState([
    { id: 1, name: '10% Service Discount', points: 500, description: 'Get 10% off on any service' },
    { id: 2, name: 'Premium Feature Access', points: 1000, description: 'One month access to premium tools' },
    { id: 3, name: 'Business Consultation', points: 2000, description: '1-hour business consultation' },
  ]);

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [params.id]);

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
        // Refresh user data to get updated points
        const updatedUser = await fetch(`/api/users/${params.id}`).then(res => res.json());
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
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
    </div>
  );
}