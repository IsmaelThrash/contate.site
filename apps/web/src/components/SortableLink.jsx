import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSafeUrl } from '@/lib/utils.js';

export const SortableLink = memo(({ link, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative'
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50 z-50' : ''}>
      <motion.div
        layout
        className="bg-card/70 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 group flex items-center gap-4 relative overflow-hidden"
      >
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:outline-none select-none"
          title="Arrastar para reordenar"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-base sm:text-lg mb-0.5 truncate text-foreground group-hover:text-primary transition-colors">
            {link.titulo}
          </h3>
          <a
            href={getSafeUrl(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-muted-foreground hover:text-primary hover:underline truncate block transition-colors"
          >
            {link.url}
          </a>
        </div>

        <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit(link)}
            className="rounded-xl border-white/[0.08] bg-background/50 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-colors h-9 w-9"
            title="Editar link"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onDelete(link.id)}
            className="rounded-xl border-white/[0.08] bg-background/50 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/40 transition-colors h-9 w-9"
            title="Remover link"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
});

SortableLink.displayName = 'SortableLink';
