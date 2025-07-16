import { useUser } from '@/hooks/useUser';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient.browser';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function UserMenu() {
  const { name, avatarUrl } = useUser();
  const router = useRouter();
  const [showConfig, setShowConfig] = useState(false);

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut({ scope: 'global' });
    router.push('/login');
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-white font-bold">
                {name.charAt(0)}
              </div>
            )}
            <span className="font-medium max-w-[120px] truncate">{name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <button
            className="flex items-center w-full gap-2 px-3 py-2 rounded hover:bg-neutral-100 transition text-neutral-800"
            onClick={() => setShowConfig(true)}
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
          <button onClick={handleSignOut} className="flex items-center w-full gap-2 px-3 py-2 rounded hover:bg-red-50 transition text-red-700">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </PopoverContent>
      </Popover>
      {/* Modal simples para Configurações */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 shadow-lg min-w-[280px] flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Configurações</h2>
            <p className="text-neutral-700 mb-4">Em breve.</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setShowConfig(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
} 