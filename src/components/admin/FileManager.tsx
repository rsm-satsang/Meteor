import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, File, Download, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DataTable from './DataTable';
import FileUpload from './FileUpload';

interface StorageFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: any;
}

const FileManager = () => {
  const [files, setFiles] = useState<{[key: string]: StorageFile[]}>({
    book_covers: [],
    book_pdfs: [],
    activity_files: [],
    event_images: []
  });
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [selectedBucket, setSelectedBucket] = useState('book_covers');

  const buckets = [
    { id: 'book_covers', name: 'Book Covers', public: true },
    { id: 'book_pdfs', name: 'Book PDFs', public: false },
    { id: 'activity_files', name: 'Activity Files', public: false },
    { id: 'event_images', name: 'Event Images', public: true }
  ];

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    for (const bucket of buckets) {
      await fetchFiles(bucket.id);
    }
  };

  const fetchFiles = async (bucketId: string) => {
    try {
      setLoading(prev => ({ ...prev, [bucketId]: true }));
      
      const { data, error } = await supabase.storage
        .from(bucketId)
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) throw error;
      
      setFiles(prev => ({
        ...prev,
        [bucketId]: data || []
      }));
    } catch (error: any) {
      console.error(`Error fetching files from ${bucketId}:`, error);
      toast.error(`Failed to load files from ${bucketId}`);
    } finally {
      setLoading(prev => ({ ...prev, [bucketId]: false }));
    }
  };

  const downloadFile = async (bucketId: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketId)
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const deleteFile = async (bucketId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

    try {
      const { error } = await supabase.storage
        .from(bucketId)
        .remove([fileName]);

      if (error) throw error;
      
      toast.success('File deleted successfully');
      fetchFiles(bucketId);
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return '🖼️';
    } else if (mimetype === 'application/pdf') {
      return '📄';
    } else if (mimetype.startsWith('video/')) {
      return '🎥';
    } else if (mimetype.startsWith('audio/')) {
      return '🎵';
    }
    return '📁';
  };

  const columns = [
    {
      key: 'name',
      label: 'File Name',
      render: (name: string, file: StorageFile) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFileIcon(file.metadata.mimetype)}</span>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      key: 'metadata',
      label: 'Size',
      render: (metadata: any) => formatFileSize(metadata.size || metadata.contentLength || 0)
    },
    {
      key: 'metadata',
      label: 'Type',
      render: (metadata: any) => (
        <Badge variant="outline">
          {metadata.mimetype?.split('/')[1]?.toUpperCase() || 'Unknown'}
        </Badge>
      )
    },
    {
      key: 'updated_at',
      label: 'Modified',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">File Manager</h1>
        <p className="text-muted-foreground">Manage files across all storage buckets</p>
      </div>

      {/* Bucket Tabs */}
      <Tabs value={selectedBucket} onValueChange={setSelectedBucket} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {buckets.map(bucket => (
            <TabsTrigger key={bucket.id} value={bucket.id} className="text-xs">
              <FolderOpen className="h-4 w-4 mr-1" />
              {bucket.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {buckets.map(bucket => (
          <TabsContent key={bucket.id} value={bucket.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{bucket.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {bucket.public ? 'Public bucket' : 'Private bucket'} • {files[bucket.id].length} files
                </p>
              </div>
              
              <Card className="w-80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Upload New File</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    bucket={bucket.id}
                    accept="*/*"
                    onUpload={() => {
                      toast.success('File uploaded successfully');
                      fetchFiles(bucket.id);
                    }}
                    placeholder={`Upload to ${bucket.name}`}
                  />
                </CardContent>
              </Card>
            </div>

            <DataTable
              data={files[bucket.id]}
              columns={columns}
              loading={loading[bucket.id]}
              searchPlaceholder={`Search files in ${bucket.name}...`}
              actions={(file) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadFile(bucket.id, file.name)}
                    title="Download file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteFile(bucket.id, file.name)}
                    title="Delete file"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FileManager;