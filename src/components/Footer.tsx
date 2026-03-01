import Link from "next/link";
import { IoShield } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-base-200 border-t border-base-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-secondary flex items-center justify-center">
              <IoShield className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">Cláusula Oculta</span>
            <span className="text-xs text-base-content/40 ml-2">
              by InclusivAI
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-base-content/50">
            <Link href="/termos" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <span>|</span>
            <Link href="/privacidade" className="hover:text-primary transition-colors">
              Privacidade
            </Link>
          </div>
          <p className="text-sm text-base-content/50">
            &copy; 2026 InclusivAI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
