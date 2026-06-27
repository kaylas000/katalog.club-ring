"use client";

import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === "clubring2024") {
      setIsAuth(true);
    } else {
      setError("Неверный пароль");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-4xl">🥊</span>
            <h1 className="font-heading text-2xl font-bold text-text-primary mt-3">
              Админ-панель
            </h1>
            <p className="text-sm text-text-muted mt-1">RING BOXING CLUB</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="input-base w-full"
                autoFocus
              />
              {error && (
                <p className="text-error text-xs mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
