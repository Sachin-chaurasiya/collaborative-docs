'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileText, Plus, Search } from 'lucide-react';
import { APPWRITE_CLIENT } from '@/lib/appwrite';
import { ID, Models, Query } from 'appwrite';
import {
  assignResourceInstanceRoleToUser,
  createResourceInstance,
} from '../actions';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/loader';
import { toast } from '@/hooks/use-toast';

export interface Document extends Models.Document {
  roomId: string;
  title: string;
  storageData: string;
  created_by: string;
}

export default function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useAuthStore();

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await APPWRITE_CLIENT.databases.listDocuments<Document>(
        '66fad2d0001b08997cb9',
        '66fad37e0033c987cf4d',
        [Query.contains('created_by', user?.$id ?? '')]
      );
      setDocuments(response.documents);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to fetch documents. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      const documentId = ID.unique();
      const response = await APPWRITE_CLIENT.databases.createDocument<Document>(
        '66fad2d0001b08997cb9',
        '66fad37e0033c987cf4d',
        documentId,
        {
          title: newDocTitle.trim(),
          roomId: documentId,
          created_by: user?.$id ?? '',
        }
      );

      const createdInstance = await createResourceInstance({
        key: documentId,
        resource: 'document',
      });

      if (!createdInstance) {
        throw new Error('Failed to create resource instance');
      }

      const assignedRole = await assignResourceInstanceRoleToUser({
        resource_instance: `document:${createdInstance.key}`,
        role: 'owner',
        user: user?.email ?? '',
      });

      if (!assignedRole) {
        throw new Error('Failed to assign role');
      }

      setDocuments((prev) => [...prev, response]);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Documents</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search documents"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog
          modal
          open={isDialogOpen}
          onOpenChange={(value) =>
            setIsDialogOpen(isCreating ? isCreating : value)
          }
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Enter a title for your new document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Title
                </Label>
                <Input
                  id="name"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateDocument}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {documents.length === 0 && (
        <p className="text-center text-gray-500">
          You don&apos;t have any documents yet. Click on the{' '}
          <strong> New Document </strong> button to create one.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.$id}>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>
                Last edited: {new Date(doc.$updatedAt).toDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400" />
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/document/${doc.$id}`}>Open</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
