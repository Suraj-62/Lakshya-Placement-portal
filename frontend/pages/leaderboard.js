import { useEffect, useState } from 'react';
import api from '../lib/api';
import withAuth from '../components/withAuth';
import { Trophy, Medal, Flame, Target, Award, Crown } from 'lucide-react';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-amber-900/40 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
     );
  }

  return (
    <div className="animate-in fade-in zoom-in duration-500 max-w-5xl mx-auto mt-4 px-4 sm:px-0">
       
       <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-900/20 flex items-center justify-center mb-6">
             <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-orange-50 tracking-tight mb-4">
             Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Leaderboard</span>
          </h1>
          <p className="text-stone-400 max-w-2xl text-lg">
             See how you stack up against top performers across the platform. Rank is purely determined by the total number of correct answers and active points.
          </p>
       </div>

       <div className="bg-[#120F0D] border border-amber-900/30 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Subtle glow effect top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"></div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-stone-900/50 border-b border-amber-900/20 text-xs font-bold uppercase tracking-widest text-stone-500">
             <div className="col-span-1 text-center">Rank</div>
             <div className="col-span-5">Candidate</div>
             <div className="col-span-2 text-center">Points</div>
             <div className="col-span-2 text-center">Accuracy</div>
             <div className="col-span-2 text-center">Streak</div>
          </div>

          <div className="divide-y divide-amber-900/10">
             {leaders.map((user, index) => {
                const isTop3 = index < 3;
                
                return (
                   <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-center hover:bg-white/[0.02] transition-colors relative group">
                      
                      {/* Rank Indicator */}
                      <div className="col-span-1 flex items-center md:justify-center">
                         {index === 0 ? <Crown className="w-6 h-6 text-yellow-400 drop-shadow-md" /> :
                          index === 1 ? <Medal className="w-6 h-6 text-stone-300 drop-shadow-md" /> :
                          index === 2 ? <Medal className="w-6 h-6 text-amber-600 drop-shadow-md" /> :
                          <span className="text-xl font-bold text-stone-600 group-hover:text-amber-700 transition-colors">#{index + 1}</span>}
                      </div>

                      {/* User Info & Badges */}
                      <div className="col-span-5 flex items-center gap-4">
                         {user.avatar ? (
                            <img src={`http://localhost:5000${user.avatar}`} alt={user.name} className={`w-12 h-12 rounded-full object-cover border-[2px] ${isTop3 ? 'border-amber-500/50' : 'border-stone-800'}`} />
                         ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-[2px] ${isTop3 ? 'border-amber-500/50 text-amber-500 bg-amber-900/20' : 'border-stone-800 bg-stone-900 text-stone-500'}`}>
                               {user.name.charAt(0).toUpperCase()}
                            </div>
                         )}
                         
                         <div className="flex flex-col">
                            <span className="font-bold text-orange-50 text-lg group-hover:text-yellow-400 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                               {user.name}
                            </span>
                            
                            {/* Badges Preview */}
                            {user.badges?.length > 0 && (
                               <div className="flex items-center gap-1.5 mt-1">
                                  {user.badges.slice(0,2).map((b, i) => (
                                     <span key={i} className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-900/50 px-1.5 py-0.5 rounded">
                                        <Award className="w-2.5 h-2.5 inline-block mr-0.5 mb-0.5" />
                                        {b}
                                     </span>
                                  ))}
                                  {user.badges.length > 2 && <span className="text-stone-500 text-[10px]">+{user.badges.length - 2}</span>}
                               </div>
                            )}
                         </div>
                      </div>

                      {/* Stats */}
                      <div className="col-span-2 flex items-center md:justify-center gap-2 text-stone-300">
                         <span className="md:hidden text-xs text-stone-500 uppercase tracking-wider">Points:</span>
                         <span className="text-xl font-black text-yellow-500 flex items-center gap-1.5">
                            {user.points}
                         </span>
                      </div>

                      <div className="col-span-2 flex items-center md:justify-center gap-2 text-stone-300">
                         <span className="md:hidden text-xs text-stone-500 uppercase tracking-wider">Accuracy:</span>
                         <div className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50">
                            <Target className="w-3.5 h-3.5" />
                            {user.accuracy}%
                         </div>
                      </div>

                      <div className="col-span-2 flex items-center md:justify-center gap-2 text-stone-300">
                         <span className="md:hidden text-xs text-stone-500 uppercase tracking-wider">Streak:</span>
                         <div className="flex items-center gap-1 font-bold text-orange-400 bg-orange-950/20 px-3 py-1 rounded-full">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {user.streak || 0}
                         </div>
                      </div>

                   </div>
                );
             })}

             {leaders.length === 0 && !loading && (
                <div className="py-12 text-center text-stone-500">
                   No leaders found yet. Be the first to take a test!
                </div>
             )}
          </div>
       </div>

    </div>
  );
}

export default withAuth(Leaderboard);
