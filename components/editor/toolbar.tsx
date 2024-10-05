import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  BlockQuoteIcon,
  HorizontalLineIcon,
  BulletListIcon,
  OrderedListIcon,
} from './icons';
import { cn } from '@/lib/utils';

type Props = {
  editor: Editor | null;
};

type ButtonProps = {
  editor: Editor;
  isActive: boolean;
  ariaLabel: string;
  Icon: React.FC;
  onClick: () => void;
};

const ToolbarButton = ({ isActive, ariaLabel, Icon, onClick }: ButtonProps) => (
  <button
    className={cn(
      'flex items-center justify-center w-8 h-8 border border-gray-200 rounded',
      {
        'bg-gray-100': isActive,
      }
    )}
    onClick={onClick}
    data-active={isActive ? 'is-active' : undefined}
    aria-label={ariaLabel}
  >
    <Icon />
  </button>
);

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('bold')}
        ariaLabel="bold"
        Icon={BoldIcon}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('italic')}
        ariaLabel="italic"
        Icon={ItalicIcon}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('strike')}
        ariaLabel="strikethrough"
        Icon={StrikethroughIcon}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('blockquote')}
        ariaLabel="blockquote"
        Icon={BlockQuoteIcon}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={false}
        ariaLabel="horizontal-line"
        Icon={HorizontalLineIcon}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('bulletList')}
        ariaLabel="bullet-list"
        Icon={BulletListIcon}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        editor={editor}
        isActive={editor.isActive('orderedList')}
        ariaLabel="number-list"
        Icon={OrderedListIcon}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
    </div>
  );
}
