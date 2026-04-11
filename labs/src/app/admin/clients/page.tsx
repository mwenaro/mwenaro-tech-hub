'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@mwenaro/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Search, MoreVertical, Mail, Building, Phone, CheckCircle, XCircle } from 'lucide-react';

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/admin/clients');
        const data = await res.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, company: inviteCompany }),
      });
      
      if (res.ok) {
        setShowInvite(false);
        setInviteEmail('');
        setInviteName('');
        setInviteCompany('');
        const data = await res.json();
        alert(`Invitation sent! Link: ${data.inviteLink}`);
      }
    } catch (error) {
      console.error('Invite error:', error);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-zinc-500 mt-1">Manage your client accounts</p>
        </div>
        <Button onClick={() => setShowInvite(true)}>
          <Plus size={18} className="mr-2" /> Invite Client
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <Input
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {showInvite && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Invite New Client</h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inviteName">Name</Label>
                <Input
                  id="inviteName"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Client name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inviteCompany">Company (Optional)</Label>
              <Input
                id="inviteCompany"
                value={inviteCompany}
                onChange={(e) => setInviteCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Send Invite</Button>
              <Button type="button" variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {filteredClients.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No clients found</h3>
          <p className="text-zinc-500">Invite your first client to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.isActive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{client.name}</h3>
              {client.company && (
                <p className="text-sm text-zinc-500 flex items-center gap-1 mb-2">
                  <Building size={14} /> {client.company}
                </p>
              )}
              <p className="text-sm text-zinc-500 flex items-center gap-1 mb-2">
                <Mail size={14} /> {client.email}
              </p>
              {client.phone && (
                <p className="text-sm text-zinc-500 flex items-center gap-1">
                  <Phone size={14} /> {client.phone}
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-4">
                Joined {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}