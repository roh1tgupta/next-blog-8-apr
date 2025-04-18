'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Quill from 'react-quill-new';

// @ts-expect-error -- type error due to some mismatch in type
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlog() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [slugError, setSlugError] = useState('');
  const router = useRouter();
  const quillRef = useRef<typeof Quill>(null);

  const uploadMedia = async (file: File): Promise<string> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_media');

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleMediaInsert = async (type: 'image' | 'video') => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', type === 'image' ? 'image/*' : 'video/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = await uploadMedia(file);
        // @ts-expect-error -- type error due to some mismatch in type
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true) || { index: 0 };
          quill.insertEmbed(range.index, type, url);
        } else {
          console.error('Quill instance not available');
        }
      }
    };
  };

  // Quill toolbar configuration with color picker
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }], // Add text color and background color options
        ['image', 'video', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
      handlers: {
        image: () => handleMediaInsert('image'),
        video: () => handleMediaInsert('video'),
      },
    },
  };

  const generateSlug = (title: string, userSlug: string): string => {
    if (userSlug) {
      const trimmedSlug = userSlug.trim();
      const validSlugRegex = /^[a-z0-9-]+$/;
      if (trimmedSlug.includes(' ')) {
        setSlugError('Slug cannot contain spaces');
        return '';
      } else if (!validSlugRegex.test(trimmedSlug)) {
        setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
        return '';
      } else {
        setSlugError('');
        return trimmedSlug;
      }
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = generateSlug(title, slug);
    if (!finalSlug && slug) {
      return;
    }

    try {
      const res = await fetch('/blogs/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug: finalSlug, excerpt, content }),
      });
      if (res.ok) {
        router.push('/');
      } else {
        console.error('Failed to create post:', await res.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Slug (optional)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Leave blank for auto-generated slug"
          />
          {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="A short summary of your blog post"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Content</label>
          <ReactQuill
            // @ts-expect-error -- type error due to some mismatch in type
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            className="bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={uploading || (slug && slugError !== '') as boolean}
          className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}