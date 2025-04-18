'use client';

import { useState, useRef, FormEvent } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ReactQuill, { ReactQuillProps } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface EditFormProps {
  initialPost: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    media?: { url: string; type: 'image' | 'video' }[];
    createdAt: string;
    updatedAt?: string;
  };
}

interface ReactQuillForwardRefProps extends ReactQuillProps {
  forwardedRef?: React.Ref<typeof ReactQuill>;
  ref?: React.Ref<typeof ReactQuill>;
}

type abc = typeof ReactQuill;

type editor = {
  getSelection: (bool: boolean) => ({ index: number });
  insertEmbed: (index: number, type: string, url: string) => unknown;
}
interface ReactQuillWithEditor extends abc {
  getEditor: () => editor; // Or use a more specific type if available

}


// const ReactQuillDynamic = dynamic(() => import('react-quill-new'), { ssr: false });

// const ReactQuillDynamic2 = dynamic<ReactQuillProps>(
//   async () => {
//     const { default: RQ } = await import('react-quill-new');
    
//     const Component = forwardRef<ReactQuill, ReactQuillProps>(
//       (props, ref) => <RQ ref={ref} {...props} />
//     );
//     Component.displayName = 'ReactQuillDynamic';
    
//     return Component;
//   },
//   { ssr: false }
// );

type ReactQuillComponent = React.ComponentType<abc> ;

const ReactQuillDynamic = dynamic<ReactQuillForwardRefProps>(
  async () => {
    const mod = (await import('react-quill-new')) as {
      default: ReactQuillComponent;
    };
    const RQ = mod.default;
    // const { default: RQ } = await import('react-quill-new');
    const DynamicQuill = ({ forwardedRef, ...props }: ReactQuillForwardRefProps) => (
      // @ts-expect-error -- type error due to some mismatch in type
      <RQ ref={forwardedRef} {...props} />
    );

    return DynamicQuill;
  },
  { ssr: false }
);

export default function EditForm({ initialPost }: EditFormProps) {
  const [title, setTitle] = useState(initialPost.title);
  const [slug, setSlug] = useState(initialPost.slug);
  const [excerpt, setExcerpt] = useState(initialPost.excerpt || '');
  const [content, setContent] = useState(initialPost.content);
  const [uploading, setUploading] = useState(false);
  const [slugError, setSlugError] = useState('');
  const router = useRouter();
  const quillRef = useRef<ReactQuillWithEditor | null>(null);

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
      throw new Error('Media upload failed');
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
      const file = input.files?.[0];
      if (!file) return;

      try {
        const url = await uploadMedia(file);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true) || { index: 0 };
          quill.insertEmbed(range.index, type, url);
        } else {
          console.error('Quill editor instance not available');
        }
      } catch (error) {
        console.error('Media insert failed:', error);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
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
      }
      if (!validSlugRegex.test(trimmedSlug)) {
        setSlugError('Slug can only contain lowercase letters, numbers, and hyphens');
        return '';
      }
      setSlugError('');
      return trimmedSlug;
    }
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalSlug = generateSlug(title, slug);
    if (!finalSlug && slug) {
      return;
    }

    const updatedAt = new Date().toISOString();

    try {
      const res = await fetch('/blogs/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: finalSlug,
          excerpt,
          content,
          originalSlug: initialPost.slug,
          updatedAt,
        }),
      });

      if (res.ok) {
        router.push(`/blogs/posts/${finalSlug}`);
      } else {
        console.error('Failed to update post:', await res.text());
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-lg font-medium mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-lg font-medium mb-2" htmlFor="slug">
          Slug (optional)
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Leave blank for auto-generated slug"
        />
        {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
      </div>
      <div>
        <label className="block text-lg font-medium mb-2" htmlFor="excerpt">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="A short summary of your blog post"
        />
      </div>
      <div>
        <label className="block text-lg font-medium mb-2" htmlFor="content">
          Content
        </label>
        <ReactQuillDynamic
          id="content"
          forwardedRef={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          className="bg-white"
        />
      </div>
      <button
        type="submit"
        disabled={uploading || (slug && !!slugError) as boolean}
        className="bg-accent text-white px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Update Post'}
      </button>
    </form>
  );
}