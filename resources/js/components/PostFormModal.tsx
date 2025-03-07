import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Post {
    id?: number;
    title: string;
    content: string;
    picture?: string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    post?: Post | null;
}

export default function PostFormModal({ isOpen, closeModal, post }: Props) {
    const [formData, setFormData] = useState<Post>({ title: '', content: '', picture: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    useEffect(() => {
        if (post) {
            setFormData({ title: post.title, content: post.content, picture: post.picture || '' });
            setPreview(post.picture || '');
            setSelectedFile(null);
        } else {
            setFormData({ title: '', content: '', picture: '' });
            setPreview('');
            setSelectedFile(null);
        }
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        if (selectedFile) {
            data.append('picture', selectedFile);
        }

        if (post?.id) {
            data.append('_method', 'PUT');
            router.post(`/posts/${post.id}`, data, {
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    console.error(errors.message || 'Failed to submit post.');
                },
            });
        } else {
            router.post('/posts', data, {
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    console.error(errors.message || 'Failed to submit post.');
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        // <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center text-black">
        //     <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg" style={{ color: 'black' }}>
        //         <h2 className="mb-4 text-lg font-semibold text-black">{post ? 'Edit Post' : 'Add Post'}</h2>
        //         <form onSubmit={handleSubmit} encType="multipart/form-data">
        //             <div className="mb-3">
        //                 <label className="block text-sm font-medium text-black">Title</label>
        //                 <input
        //                     type="text"
        //                     name="title"
        //                     value={formData.title}
        //                     onChange={handleChange}
        //                     className="w-full rounded border p-2"
        //                     required
        //                 />
        //             </div>
        //             <div className="mb-3">
        //                 <label className="block text-sm font-medium text-black">Content</label>
        //                 <textarea
        //                     name="content"
        //                     value={formData.content}
        //                     onChange={handleChange}
        //                     className="w-full rounded border p-2"
        //                     required
        //                 ></textarea>
        //             </div>
        //             <div className="mb-3">
        //                 <label className="block text-sm font-medium text-black">Picture (optional)</label>
        //                 <input type="file" name="picture" onChange={handleFileChange} className="w-full" accept="image/*" />
        //             </div>
        //             {preview && (
        //                 <div className="mb-3">
        //                     <p className="mb-1 text-sm">Image Preview:</p>
        //                     <img src={preview} alt="Preview" className="h-32 w-32 rounded object-cover text-black" />
        //                 </div>
        //             )}
        //             <div className="flex justify-end gap-2">
        //                 <button type="button" onClick={closeModal} className="rounded bg-gray-500 px-4 py-2 text-white">
        //                     Cancel
        //                 </button>
        //                 <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
        //                     {post ? 'Update' : 'Create'}
        //                 </button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="!important w-full max-w-xl rounded-lg bg-white p-6 text-black shadow-lg">
                <h2 className="mb-4 text-lg font-semibold text-black">{post ? 'Edit Post' : 'Add Post'}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="text-black">
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-black">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded border p-2 text-black"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-black">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full rounded border p-2 text-black"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-black">Picture (optional)</label>
                        <input type="file" name="picture" onChange={handleFileChange} className="w-full text-black" accept="image/*" />
                    </div>
                    {preview && (
                        <div className="mb-3">
                            <p className="mb-1 text-sm text-black">Image Preview:</p>
                            {/* <img src={preview} alt="Preview" className="h-32 w-32 rounded object-cover text-black" /> */}
                            <input
                                className="w-full file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white file:hover:bg-blue-600"
                                accept="image/*"
                                type="file"
                                name="picture"
                            />
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeModal} className="rounded bg-gray-500 px-4 py-2 text-white">
                            Cancel
                        </button>
                        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
                            {post ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
