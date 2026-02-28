"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
}

export default function Header({ title, showBack = false, backTo }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50">
      {showBack && (
        <div className="navbar-start">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => (backTo ? router.push(backTo) : router.back())}
          >
            <IoArrowBack className="text-xl" />
          </button>
        </div>
      )}
      <div className={showBack ? "navbar-center" : "navbar-start pl-4"}>
        <span className="text-lg font-bold">{title}</span>
      </div>
      <div className="navbar-end" />
    </div>
  );
}
