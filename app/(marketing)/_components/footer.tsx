import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="w-full py-6 px-4 border-t border-neutral-200/50 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-600">
          © 2025 <span className="font-semibold text-neutral-800">PPK ORMAWA BEM FASILKOM</span>. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
            Kebijakan Privasi
          </Button>
          <span className="text-neutral-300">•</span>
          <Button size="sm" variant="ghost" className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
            Syarat & Ketentuan
          </Button>
        </div>
      </div>
    </div>
  );
};
