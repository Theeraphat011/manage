import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg">
        This is a simple example of a Next.js application using Tailwind CSS.
      </p>
      <div className="mt-6">
        <Image
          src="/nextjs-logo.png"
          alt="Next.js Logo"
          width={200}
          height={200}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Explore the code and customize it to your needs!
      </p>
    </div>
  );
}
