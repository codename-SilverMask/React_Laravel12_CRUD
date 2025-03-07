import PostFormModal from '@/components/PostFormModal';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Posts() {
    const { posts } = usePage<{ posts: { id: number; title: string; content: string; picture?: string }[] }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const openModal = (post = null) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        router.delete(`/posts/${id}`, {
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                console.error('Failed to delete post.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Posts" />

            <div className="flex flex-col gap-6 rounded-xl bg-white p-6 text-black shadow-lg">
                <div className="flex justify-end">
                    <button onClick={() => openModal()} className="rounded bg-green-600 px-3 py-1 text-sm text-white transition hover:bg-green-700">
                        Add Post
                    </button>
                </div>

                <table className="w-full border-collapse rounded-lg bg-white text-black shadow-sm">
                    <thead>
                        <tr className="border-b bg-gray-100 text-gray-800">
                            {['Picture', 'Title', 'Content', 'Actions'].map((header) => (
                                <th key={header} className="border p-3 text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length ? (
                            posts.map((post) => (
                                <tr key={post.id} className="border-b">
                                    <td className="p-3">
                                        {post.picture ? (
                                            <img src={post.picture} alt="Post" className="h-16 w-16 rounded-full bg-black object-cover text-black" />
                                        ) : (
                                            'No Picture'
                                        )}
                                    </td>
                                    <td className="p-3">{post.title}</td>
                                    <td className="p-3">{post.content}</td>
                                    <td className="flex gap-2 p-3">
                                        <button onClick={() => openModal(post)} className="rounded bg-blue-500 px-3 py-1 text-sm text-black">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="rounded bg-red-500 px-3 py-1 text-sm text-black">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-600">
                                    No posts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <PostFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} post={selectedPost} />
        </AppLayout>
    );
}
