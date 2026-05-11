import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
        className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex items-center gap-4"
      >
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors focus:outline-none"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-lg mb-1 truncate text-foreground">
            {link.titulo}
          </h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary hover:underline truncate block transition-colors"
          >
            {link.url}
          </a>
        </div>

        <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit(link)}
            className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onDelete(link.id)}
            className="rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
});

SortableLink.displayName = 'SortableLink';
