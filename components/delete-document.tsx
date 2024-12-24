'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { APPWRITE_CLIENT } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

interface DeleteDocumentProps {
  documentId: string;
  permission: boolean;
}

export function DeleteDocument({
  documentId,
  permission,
}: DeleteDocumentProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await APPWRITE_CLIENT.databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||'',
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID||'',
        documentId
      );
      toast({
        title: 'Success',
        description: 'Document deleted successfully.',
      });
      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to delete the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!permission) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Document</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this document? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
