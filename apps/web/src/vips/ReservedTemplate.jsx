import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

const ReservedTemplate = ({ slug }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg mx-auto w-full"
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="bg-zinc-800/50 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center border border-zinc-700/50 shadow-inner">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tight text-white font-heading">
            Página Reservada
          </h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            O endereço <span className="text-white font-medium">contate.site/{slug}</span> foi reservado com sucesso e em breve receberá uma experiência VIP exclusiva.
          </p>
          
          <div className="inline-flex items-center justify-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Em construção
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReservedTemplate;
