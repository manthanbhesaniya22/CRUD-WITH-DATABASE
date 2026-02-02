import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";

export default function PostCreate() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const submit = (e) => {
        e.preventDefault();
        alert("Data added Succesufully");
        axios.post("http://localhost:8000/api/posts",{title:title,body:body}).then
    };
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Bar */}
            <div className="max-w-5xl mx-auto px-4 py-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                    ← Back
                </Link>
            </div>

            {/* Centered Form */}
            <div className="flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Create Post
                    </h1>

                    <form onSubmit={submit} className="flex flex-col gap-4">

                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="title"
                                className="text-sm font-medium text-gray-700"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                                required
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="body"
                                className="text-sm font-medium text-gray-700"
                            >
                                Body
                            </label>
                            <textarea
                                id="body"
                                name="body"
                                rows="4"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Enter post content"
                                required
                                className="px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Submit
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
