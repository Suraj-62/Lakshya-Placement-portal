import { useRouter } from 'next/router';
import { useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldCheck, Zap, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid reset session");
    
    setLoading(true);
    const toastId = toast.loading("Updating security vectors...");

    try {
      await api.post(`/auth/reset/${token}`, { password });
      toast.success("Security update successful ✅", { id: toastId });
      router.push('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid ❌", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative group">
                <div className="absolute inset-0 bg-amber-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Lock className="w-8 h-8 text-amber-500 relative z-10" />
            </div>
            <h1 className="text-3xl font-black text-orange-50 tracking-tighter">New <span className="text-amber-500">Security</span></h1>
            <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-60">System Protocol: Credential Update</p>
        </div>

        <div className="bg-[#0c0a09] border border-stone-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/20 to-transparent"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest px-1">New Access Credential</label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-700 group-focus-within/input:text-amber-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            className="w-full bg-stone-950 border border-stone-800 rounded-2xl py-4 pl-12 pr-12 text-orange-50 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-stone-800"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700 hover:text-stone-500 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-amber-50 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20 disabled:opacity-50 group"
                    >
                        {loading ? 'Updating...' : (
                            <>
                                Update Credentials <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-900 flex flex-col items-center gap-4">
                <Link href="/auth/login" className="flex items-center gap-2 text-[10px] font-black text-stone-500 hover:text-amber-500 uppercase tracking-widest transition-colors group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Authorization
                </Link>
            </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
             <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-stone-600" />
                <span className="text-[8px] font-black text-stone-600 uppercase tracking-widest">End-to-End Encryption</span>
             </div>
             <div className="w-1 h-1 bg-stone-800 rounded-full"></div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-stone-600" />
                <span className="text-[8px] font-black text-stone-600 uppercase tracking-widest">Secure Handshake</span>
             </div>
        </div>

      </div>
    </div>
  );
}
