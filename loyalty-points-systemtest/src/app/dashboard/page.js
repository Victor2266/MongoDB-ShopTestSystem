"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Award, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([
    { id: 1, name: '10% Service Discount', points: 500, description: 'Get 10% off on any service' },
    { id: 2, name: 'Premium Feature Access', points: 1000, description: 'One month access to premium tools' },
    { id: 3, name: 'Business Consultation', points: 2000, description: '1-hour business consultation' },
  ]);
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, name: 'Digital Marketing Webinar', points: 100, date: '2024-11-25' },
    { id: 2, name: 'Business Networking Event', points: 150, date: '2024-11-30' },
  ]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);

    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);
  }, []);

  const redeemReward = (rewardId) => {
    // Implement reward redemption logic here
    console.log(`Redeeming reward ${rewardId}`);
  };

  const registerForEvent = (eventId) => {
    // Implement event registration logic here
    console.log(`Registering for event ${eventId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Loyalty Program Dashboard</h1>
        {users[0] && (
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg">
              {users[0].points || 0} Points
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {users[0]?.points || 0}
            </div>
            <Progress value={((users[0]?.points || 0) % 1000) / 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction._id} className="flex justify-between items-center">
                  <span>{transaction.type}</span>
                  <Badge variant={transaction.points > 0 ? "success" : "destructive"}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Next Reward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-semibold">Premium Feature Access</div>
              <div className="text-sm text-gray-500">150 points needed</div>
              <Progress value={85} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList>
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
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
                    <Button onClick={() => redeemReward(reward.id)}>
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">Date: {event.date}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">Earn {event.points} Points</Badge>
                    <Button onClick={() => registerForEvent(event.id)}>
                      Register
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{transaction.type}</div>
                      <div className="text-sm text-gray-500">User: {transaction.userId.name}</div>
                    </div>
                    <Badge variant={transaction.points > 0 ? "success" : "destructive"}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;