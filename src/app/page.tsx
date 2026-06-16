'use client'

import { showToast } from "@/components/toast/Toast";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post('/user/login', {
        username,
        password
      });

      showToast(res.data.message, 'success');

      setTimeout(() => {
        router.push('/pendaftaran');
      }, 1000);

    } catch (error: any) {
      console.error(error);

      showToast(
        error?.response?.data?.message || 'Login gagal',
        'danger'
      );
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card border-0 shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px"
        }}
      >
        <div className="card-body p-4 p-md-5">

          <div className="text-center">
            <h5 className="fw-bold mb-1">Selamat Datang</h5>
            <p className="text-muted small mb-4">
              Masuk ke Admin
            </p>
          </div>

          <form onSubmit={onLogin}>

            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Username
              </label>

              <input
                type="text"
                className="form-control form-control-sm py-2"
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold">
                Password
              </label>

              <input
                type="password"
                className="form-control form-control-sm py-2"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 text-white fw-semibold"
              style={{
                background: "#1e2a3a",
                borderRadius: "8px"
              }}
            >
              Masuk
            </button>

          </form>

          <p className="text-center text-muted small mt-4 mb-2">
            Belum punya akun?
          </p>

          <Link href="/register">
            <button
              type="button"
              className="btn w-100 py-2 text-white fw-semibold"
              style={{
                background: "#1e2a3a",
                borderRadius: "8px"
              }}
            >
              Daftar
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}