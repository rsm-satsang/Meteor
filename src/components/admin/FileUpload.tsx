import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (url: string, fileName: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  path = '',
  accept = '*/*',
  maxSize = 10,
  onUpload,
  loading = false,
  placeholder = 'Click to upload or drag and drop',
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onUpload(urlData.publicUrl, fileName);
      toast.success('File uploaded successfully');
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const isImage = accept.includes('image') || accept === '*/*';

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onClick={() => !loading && !uploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          {uploading || loading ? (
            <>
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4" />
              <p className="text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              {isImage ? (
                <Image className="h-10 w-10 text-muted-foreground mb-4" />
              ) : (
                <File className="h-10 w-10 text-muted-foreground mb-4" />
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">{placeholder}</p>
                <p className="text-xs text-muted-foreground">
                  Max size: {maxSize}MB
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;