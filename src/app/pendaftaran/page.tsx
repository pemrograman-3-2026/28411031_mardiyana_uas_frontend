'use client'

import { useState } from 'react'
import { api } from '@/lib/axios'
import { showToast } from '@/components/toast/Toast'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PendaftaranPage() {
  const router = useRouter()

  const [nama, setNama] = useState('')
  const [nik, setNik] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState('')
  const [alamat, setAlamat] = useState('')
  const [noHp, setNoHp] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('L')
  const [kelas, setKelas] = useState('KELAS_1')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/')
    }
  }, [router])

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await api.post('/pendaftaran', {
        nama,
        nik,
        tanggal_lahir: tanggalLahir,
        alamat,
        no_hp: noHp,
        jenis_kelamin: jenisKelamin,
        kelas
      })

      showToast(res.data.message, 'success')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)

    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
          'Pendaftaran gagal',
        'danger'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card border-0 shadow"
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '12px'
        }}
      >
        <div className="card-body p-4 p-md-5">

          <div className="text-center mb-4">
            <h4 className="fw-bold">
              Form Pendaftaran
            </h4>
            <p className="text-muted">
              Silakan lengkapi data berikut
            </p>
            <Link href="/dashboard" className="small">
              Kembali ke Dashboard
            </Link>
          </div>

          <form onSubmit={onSubmit}>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) =>
                  setNama(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                NIK
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan NIK"
                value={nik}
                onChange={(e) =>
                  setNik(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Tanggal Lahir
              </label>
              <input
                type="date"
                className="form-control"
                value={tanggalLahir}
                onChange={(e) =>
                  setTanggalLahir(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Alamat
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Masukkan Alamat"
                value={alamat}
                onChange={(e) =>
                  setAlamat(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nomor HP
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                onChange={(e) =>
                  setNoHp(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Jenis Kelamin
              </label>
              <select
                className="form-select"
                value={jenisKelamin}
                onChange={(e) =>
                  setJenisKelamin(e.target.value)
                }
              >
                <option value="L">
                  Laki-laki
                </option>
                <option value="P">
                  Perempuan
                </option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Kelas
              </label>
              <select
                className="form-select"
                value={kelas}
                onChange={(e) =>
                  setKelas(e.target.value)
                }
              >
                <option value="KELAS_1">
                  Kelas 1
                </option>
                <option value="KELAS_2">
                  Kelas 2
                </option>
                <option value="KELAS_3">
                  Kelas 3
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="btn w-100 py-2 text-white fw-semibold"
              style={{
                background: '#1e2a3a',
                borderRadius: '8px'
              }}
              disabled={submitting}
            >
              {submitting ? 'Menyimpan...' : 'Daftar'}
            </button>

          </form>

        </div>
      </div>
    </div>
  )
}