"use client";

import { useState } from "react";

export default function UploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [isUploading, setIsUploading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		const formData = new FormData();
		formData.append("images", file);
		formData.append("name", name);
		formData.append("description", description);
		formData.append("categoryId", categoryId);
		formData.append("price", price);

		setIsUploading(true);
		const res = await fetch("/api/products", {
			method: "POST",
			body: formData,
		});
		const data = await res.json();
		setIsUploading(false);

		alert(data.success ? "Upload success!" : `Failed: ${data.error}`);
		console.log(data.error);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-md mx-auto">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
						Upload Product
					</h1>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* File Upload */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Image
							</label>
							<div className="relative">
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setFile(e.target.files?.[0] ?? null)}
									className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-3 file:px-4
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-medium
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100
                                        cursor-pointer border border-gray-300 rounded-lg
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* Product Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Product Name
							</label>
							<input
								type="text"
								placeholder="Enter product name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition duration-200 ease-in-out"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								placeholder="Enter product description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition duration-200 ease-in-out resize-none"
							/>
						</div>

						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Category ID
							</label>
							<input
								type="number"
								placeholder="Enter category ID"
								value={categoryId}
								onChange={(e) => setCategoryId(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition duration-200 ease-in-out"
							/>
						</div>

						{/* Price */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Price
							</label>
							<div className="relative">
								<span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
									฿
								</span>
								<input
									type="number"
									placeholder="0.00"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg
                                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition duration-200 ease-in-out"
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isUploading || !file}
							className="w-full bg-gradient-to-r from-blue-600 to-indigo-600
                                text-white font-medium py-3 px-6 rounded-lg
                                hover:from-blue-700 hover:to-indigo-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition duration-200 ease-in-out
                                transform hover:scale-[1.02] active:scale-[0.98]">
							{isUploading ? (
								<div className="flex items-center justify-center">
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Uploading...
								</div>
							) : (
								"Upload Product"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
