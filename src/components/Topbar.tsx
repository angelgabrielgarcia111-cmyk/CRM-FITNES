import React from 'react';
import { Search, Bell } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="h-20 bg-background border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-card border border-transparent rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-border transition-all text-sm text-foreground placeholder-muted-foreground shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-sm font-bold text-foreground">Personal Trainer</p>
            <p className="text-[10px] text-muted-foreground">Online</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-card border border-border p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-bold overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
