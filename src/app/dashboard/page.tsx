'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { showToast } from '@/components/toast/Toast'
import { clearSession, getSession } from '@/lib/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Pendaftaran {
  id_daftar: number
  nama: string
  nik: string
  tanggal_lahir: string
  alamat: string
  no_hp: string
  jenis_kelamin: string
  kelas: string
  status: string
}

const emptyForm: Partial<Pendaftaran> = {
  nama: '',
  nik: '',
  tanggal_lahir: '',
  alamat: '',
  no_hp: '',
  jenis_kelamin: 'L',
  kelas: 'KELAS_1',
  status: 'pending',
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<Pendaftaran[]>([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('')

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Pendaftaran>>(emptyForm)

  const fetchData = async () => {
    try {
      const res = await api.get('/pendaftaran')
      setData(res.data)
    } catch (error) {
      console.error(error)
      showToast('Gagal memuat data', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/')
      return
    }
    setAdminName(session.nama_admin)
    fetchData()
  }, [router])

  const handleLogout = () => {
    clearSession()
    router.push('/')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah anda yakin ingin menghapus data ini?')) return

    try {
      await api.delete(`/pendaftaran/${id}`)
      showToast('Data berhasil dihapus', 'success')
      fetchData()
    } catch (error) {
      console.error(error)
      showToast('Gagal menghapus data', 'danger')
    }
  }

  const handleEdit = (item: Pendaftaran) => {
    setEditForm({
      ...item,
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '',
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!editForm.id_daftar) return

    const { id_daftar, ...updateData } = editForm

    try {
      await api.put(`/pendaftaran/${id_daftar}`, updateData)
      showToast('Data berhasil diupdate', 'success')
      setShowEditModal(false)
      fetchData()
    } catch (error) {
      console.error(error)
      showToast('Gagal mengupdate data', 'danger')
    }
  }

  const getKelasLabel = (kelas: string) => {
    if (kelas === 'KELAS_1') return '1'
    if (kelas === 'KELAS_2') return '2'
    return '3'
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <p className="text-muted">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold m-0">Data Pendaftaran</h4>
            {adminName && (
              <p className="text-muted small mb-0">Selamat datang, {adminName}</p>
            )}
          </div>
          <div className="d-flex gap-2">
            <Link href="/pendaftaran">
              <button className="btn btn-primary">Tambah Pendaftaran</button>
            </Link>
            <button className="btn btn-outline-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Alamat</th>
                <th>No HP</th>
                <th>L/P</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id_daftar}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.nik}</td>
                  <td>{item.alamat}</td>
                  <td>{item.no_hp}</td>
                  <td>{item.jenis_kelamin}</td>
                  <td>{getKelasLabel(item.kelas)}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === 'pending'
                          ? 'bg-warning'
                          : item.status === 'diterima'
                            ? 'bg-success'
                            : 'bg-danger'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info text-white me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id_daftar)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    Tidak ada data pendaftaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Pendaftaran</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.nama || ''}
                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">NIK</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.nik || ''}
                        onChange={(e) => setEditForm({ ...editForm, nik: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">Tanggal Lahir</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editForm.tanggal_lahir || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, tanggal_lahir: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-semibold">Nomor HP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.no_hp || ''}
                        onChange={(e) => setEditForm({ ...editForm, no_hp: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label small fw-semibold">Alamat</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editForm.alamat || ''}
                        onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-semibold">Jenis Kelamin</label>
                      <select
                        className="form-select"
                        value={editForm.jenis_kelamin || 'L'}
                        onChange={(e) =>
                          setEditForm({ ...editForm, jenis_kelamin: e.target.value })
                        }
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-semibold">Kelas</label>
                      <select
                        className="form-select"
                        value={editForm.kelas || 'KELAS_1'}
                        onChange={(e) => setEditForm({ ...editForm, kelas: e.target.value })}
                      >
                        <option value="KELAS_1">Kelas 1</option>
                        <option value="KELAS_2">Kelas 2</option>
                        <option value="KELAS_3">Kelas 3</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label small fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={editForm.status || 'pending'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="diterima">Diterima</option>
                        <option value="ditolak">Ditolak</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
