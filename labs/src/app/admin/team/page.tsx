'use client';

import { useEffect, useState } from 'react';
import { Card, Button } from '@mwenaro/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Search, UserCog, Code, Palette, Briefcase, Shield } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  roleType: string;
  isActive: boolean;
  createdAt: string;
}

const roleIcons: Record<string, typeof Code> = {
  lead: Shield,
  developer: Code,
  designer: Palette,
  pm: Briefcase,
  qa: UserCog,
};

const roleLabels: Record<string, string> = {
  lead: 'Tech Lead',
  developer: 'Developer',
  designer: 'Designer',
  pm: 'Project Manager',
  qa: 'QA Engineer',
};

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleType: 'developer' });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/admin/team');
        const data = await res.json();
        setTeamMembers(data.team || []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAdd(false);
        setFormData({ name: '', email: '', password: '', roleType: 'developer' });
        const data = await res.json();
        setTeamMembers([...teamMembers, data.member]);
      }
    } catch (error) {
      console.error('Add error:', error);
    }
  };

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-zinc-500 mt-1">Manage your development team</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={18} className="mr-2" /> Add Team Member
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <Input
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {showAdd && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Add New Team Member</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="roleType">Role</Label>
                <select
                  id="roleType"
                  value={formData.roleType}
                  onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-background h-11"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="pm">Project Manager</option>
                  <option value="qa">QA Engineer</option>
                  <option value="lead">Tech Lead</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Add Member</Button>
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {filteredMembers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No team members</h3>
          <p className="text-zinc-500">Add your first team member to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const Icon = roleIcons[member.roleType] || Code;
            return (
              <Card key={member._id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.isActive 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-zinc-500 mb-3">{member.email}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Icon size={14} className="text-zinc-400" />
                  <span>{roleLabels[member.roleType] || member.roleType}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}