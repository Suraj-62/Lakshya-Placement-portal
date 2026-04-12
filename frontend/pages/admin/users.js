import { useEffect, useState } from 'react';
import api from '../../lib/api';
import withAuth from '../../components/withAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  Code2, 
  Filter,
  ExternalLink,
  Mail,
  Calendar,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastActive');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id, currentStatus) => {
      const action = currentStatus ? 'unblock' : 'block';
      if (!confirm(`Are you sure you want to ${action} this user?`)) return;
      
      try {
          await api.put(`/admin/users/${id}/toggle-block`);
          toast.success(`User ${action}ed successfully`);
          fetchUsers(); // Refresh data
      } catch (error) {
          toast.error(error.response?.data?.message || `Failed to ${action} user`);
      }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
      if (sortBy === 'lastActive') return new Date(b.lastActive) - new Date(a.lastActive);
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'solved') return b.stats.mcqTotal - a.stats.mcqTotal;
      return 0;
  });

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  if (loading) return <div className="text-stone-400 flex items-center justify-center min-h-[60vh]">Loading User Analytics...</div>;

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-50 transition-colors mb-4 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Panel
            </Link>
            <h1 className="text-4xl font-bold text-orange-50 tracking-tight flex items-center gap-3">
                <Users className="w-10 h-10 text-amber-500" /> Student Analytics
            </h1>
            <p className="text-stone-400 mt-2 text-lg">Monitor student engagement, preparation levels, and account status.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input 
                type="text" 
                placeholder="Search students by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all shadow-inner"
            />
        </div>
        <div className="flex gap-2">
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl px-4 flex items-center gap-3">
                <Filter className="w-4 h-4 text-stone-500" />
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-stone-300 text-sm focus:ring-0 cursor-pointer py-4"
                >
                    <option value="lastActive">Sort by Recent Activity</option>
                    <option value="points">Sort by Points</option>
                    <option value="solved">Sort by Most Attempted</option>
                </select>
            </div>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalyticsSummaryCard 
            label="Total Active Students" 
            value={users.filter(u => !u.isBlocked).length} 
            icon={<Users className="text-blue-400" />}
          />
          <AnalyticsSummaryCard 
            label="Blocked Accounts" 
            value={users.filter(u => u.isBlocked).length} 
            icon={<ShieldAlert className="text-red-400" />}
          />
          <AnalyticsSummaryCard 
            label="Daily Active" 
            value={users.filter(u => u.lastActive && new Date(u.lastActive).toDateString() === new Date().toDateString()).length} 
            icon={<Clock className="text-emerald-400" />}
          />
      </div>

      {/* Users Table / List */}
      <div className="bg-stone-900/40 border border-stone-800/50 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="border-b border-stone-800 bg-stone-950/40">
                          <th className="p-6 text-xs font-bold text-stone-500 uppercase tracking-widest">Student Information</th>
                          <th className="p-6 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">Activity</th>
                          <th className="p-6 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">MCQ Performance</th>
                          <th className="p-6 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">Coding Progress</th>
                          <th className="p-6 text-xs font-bold text-stone-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/50">
                      {filteredUsers.map(user => (
                          <tr key={user._id} className={`hover:bg-white/[0.02] transition-colors group ${user.isBlocked ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                              <td className="p-6">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full bg-stone-800 border ${user.isBlocked ? 'border-red-500/50' : 'border-stone-700'} flex items-center justify-center font-bold text-amber-500 shadow-sm transition-transform group-hover:scale-110`}>
                                          {user.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                          <p className="font-semibold text-stone-200 flex items-center gap-2">
                                            {user.name} 
                                            {user.isBlocked && <span className="text-[10px] font-bold bg-red-500/20 px-1.5 py-0.5 rounded text-red-500 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> BLOCKED</span>}
                                          </p>
                                          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                                            <Mail className="w-3 h-3" /> {user.email}
                                          </p>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-6 text-center">
                                  <div>
                                      <p className="text-sm font-medium text-stone-300">{formatDate(user.lastActive)}</p>
                                      <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider">Points: {user.points}</p>
                                  </div>
                              </td>
                              <td className="p-6">
                                  <div className="flex flex-col items-center">
                                      <div className="flex items-center gap-4">
                                          <div className="text-center">
                                              <p className="text-sm font-bold text-stone-200">{user.stats.mcqCorrect}</p>
                                              <p className="text-[9px] text-stone-500 uppercase tracking-tighter">Solved</p>
                                          </div>
                                          <div className="w-px h-6 bg-stone-800"></div>
                                          <div className="text-center">
                                              <p className="text-sm font-bold text-stone-400">{user.stats.mcqTotal}</p>
                                              <p className="text-[9px] text-stone-500 uppercase tracking-tighter">Practice</p>
                                          </div>
                                          <div className="w-px h-6 bg-stone-800"></div>
                                          <div className="text-center">
                                              <p className={`text-sm font-bold ${user.stats.mcqAccuracy > 70 ? 'text-emerald-500' : user.stats.mcqAccuracy > 40 ? 'text-amber-500' : 'text-stone-500'}`}>
                                                  {user.stats.mcqAccuracy}%
                                              </p>
                                              <p className="text-[9px] text-stone-500 uppercase tracking-tighter">Accuracy</p>
                                          </div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-6">
                                  <div className="flex flex-col items-center">
                                      <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-800">
                                          <Code2 className="w-4 h-4 text-blue-400" />
                                          <span className="text-sm font-bold text-blue-400">{user.stats.codingSolved}</span>
                                          <span className="text-[10px] text-stone-600 font-bold tracking-tighter uppercase px-1">Solved</span>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-6 text-right">
                                  <button 
                                    onClick={() => toggleBlock(user._id, user.isBlocked)}
                                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ml-auto ${
                                        user.isBlocked 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20' 
                                        : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                                    }`}
                                    title={user.isBlocked ? 'Unlock User' : 'Block User'}
                                  >
                                      {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                          {user.isBlocked ? 'Unblock' : 'Block'}
                                      </span>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {filteredUsers.length === 0 && (
              <div className="p-20 text-center text-stone-500">
                  No students found matching your search.
              </div>
          )}
      </div>

    </div>
  );
}

function AnalyticsSummaryCard({ label, value, icon }) {
    return (
        <div className="bg-stone-900/60 border border-stone-800/80 p-6 rounded-3xl backdrop-blur-sm transition-all hover:border-stone-700 hover:bg-stone-900/80 group">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 group-hover:bg-stone-900 transition-colors">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">{label}</p>
                    <p className="text-3xl font-black text-orange-50 mt-1">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default withAuth(UserManagement, { requireAdmin: true });
