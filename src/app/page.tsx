'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Church, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Printer,
  UserPlus,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Heart,
  GraduationCap,
  Droplet,
  Building
} from 'lucide-react'

// Types
interface FamilyInfo {
  kolom: string
  namaKeluarga: string
  nomorKK: string
  tanggalNikah: string
  noSurat: string
  pendetaPeneguh: string
  rumahTinggal: string
  penghasilanBulanan: string
}

interface FamilyMember {
  id: number
  nik: string
  namaLengkap: string
  jenisKelamin: 'L' | 'P' | ''
  tempatLahir: string
  tanggalLahir: string
  hubunganKeluarga: string
  statusPernikahan: string
  pekerjaan: string
  golDarah: string
  pendidikanTerakhir: string
  noTelpWA: string
  baptis: BaptisSidiData
  sidi: BaptisSidiData
  domisili: string
  keterangan: string
}

interface BaptisSidiData {
  sudah: boolean
  noSurat: string
  tanggal: string
  namaPendeta: string
  gerejaJemaat: string
}

const HUBUNGAN_KELUARGA_OPTIONS = [
  'Kepala Keluarga',
  'Istri',
  'Anak',
  'Menantu',
  'Cucu',
  'Orang Tua',
  'Mertua',
  'Famili Lain',
  'Pembantu',
  'Lainnya'
]

const STATUS_PERNIKAHAN_OPTIONS = [
  'Belum Kawin',
  'Kawin',
  'Cerai Hidup',
  'Cerai Mati'
]

const GOL_DARAH_OPTIONS = ['A', 'B', 'AB', 'O', 'Tidak Tahu']

const PENDIDIKAN_OPTIONS = [
  'Tidak Sekolah',
  'SD',
  'SMP',
  'SMA/SMK',
  'D1',
  'D2',
  'D3',
  'S1',
  'S2',
  'S3'
]

const KOLOM_OPTIONS = Array.from({ length: 20 }, (_, i) => `Kolom ${i + 1}`)

const PENGHASILAN_OPTIONS = [
  '< Rp 1.000.000',
  'Rp 1.000.000 - Rp 3.000.000',
  'Rp 3.000.000 - Rp 5.000.000',
  'Rp 5.000.000 - Rp 10.000.000',
  '> Rp 10.000.000',
  'Tidak Berpenghasilan'
]

const defaultMember: () => FamilyMember = () => ({
  id: Date.now(),
  nik: '',
  namaLengkap: '',
  jenisKelamin: '',
  tempatLahir: '',
  tanggalLahir: '',
  hubunganKeluarga: '',
  statusPernikahan: '',
  pekerjaan: '',
  golDarah: '',
  pendidikanTerakhir: '',
  noTelpWA: '',
  baptis: {
    sudah: false,
    noSurat: '',
    tanggal: '',
    namaPendeta: '',
    gerejaJemaat: ''
  },
  sidi: {
    sudah: false,
    noSurat: '',
    tanggal: '',
    namaPendeta: '',
    gerejaJemaat: ''
  },
  domisili: '',
  keterangan: ''
})

export default function SensusJemaatPage() {
  const printRef = useRef<HTMLDivElement>(null)
  
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    kolom: '',
    namaKeluarga: '',
    nomorKK: '',
    tanggalNikah: '',
    noSurat: '',
    pendetaPeneguh: '',
    rumahTinggal: '',
    penghasilanBulanan: ''
  })

  const [members, setMembers] = useState<FamilyMember[]>([defaultMember()])
  
  const [signatureInfo, setSignatureInfo] = useState({
    pemberiData: '',
    penatuaKolom: '',
    diakenKolom: '',
    ketuaBPMJ: '',
    tanggal: new Date().toISOString().split('T')[0]
  })

  const [activeTab, setActiveTab] = useState('info')

  // Handlers
  const handleFamilyInfoChange = (field: keyof FamilyInfo, value: string) => {
    setFamilyInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleMemberChange = (id: number, field: string, value: string | boolean) => {
    setMembers(prev => prev.map(member => {
      if (member.id !== id) return member
      
      // Handle nested baptis/sidi fields
      if (field.startsWith('baptis.') || field.startsWith('sidi.')) {
        const [parent, child] = field.split('.')
        return {
          ...member,
          [parent]: {
            ...member[parent as 'baptis' | 'sidi'],
            [child]: value
          }
        }
      }
      
      return { ...member, [field]: value }
    }))
  }

  const addMember = () => {
    if (members.length < 8) {
      setMembers(prev => [...prev, defaultMember()])
    }
  }

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleSignatureChange = (field: string, value: string) => {
    setSignatureInfo(prev => ({ ...prev, [field]: value }))
  }

  // Save to localStorage
  const saveData = () => {
    const data = { familyInfo, members, signatureInfo }
    localStorage.setItem('sensusJemaat2026', JSON.stringify(data))
    alert('Data berhasil disimpan!')
  }

  // Load from localStorage
  const loadData = () => {
    const saved = localStorage.getItem('sensusJemaat2026')
    if (saved) {
      const data = JSON.parse(saved)
      setFamilyInfo(data.familyInfo)
      setMembers(data.members)
      setSignatureInfo(data.signatureInfo)
      alert('Data berhasil dimuat!')
    } else {
      alert('Tidak ada data tersimpan')
    }
  }

  // Clear data
  const clearData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
      localStorage.removeItem('sensusJemaat2026')
      setFamilyInfo({
        kolom: '',
        namaKeluarga: '',
        nomorKK: '',
        tanggalNikah: '',
        noSurat: '',
        pendetaPeneguh: '',
        rumahTinggal: '',
        penghasilanBulanan: ''
      })
      setMembers([defaultMember()])
      setSignatureInfo({
        pemberiData: '',
        penatuaKolom: '',
        diakenKolom: '',
        ketuaBPMJ: '',
        tanggal: new Date().toISOString().split('T')[0]
      })
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg print:bg-white print:text-black">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between print:flex-col print:gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl print:bg-blue-100">
                <Church className="h-8 w-8 print:text-blue-700" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Formulir Sensus Jemaat 2026</h1>
                <p className="text-blue-100 print:text-gray-600">Gereja Masehi Injili di Minahasa (GMIM)</p>
              </div>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="secondary" size="sm" onClick={saveData}>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="secondary" size="sm" onClick={loadData}>
                <Download className="h-4 w-4 mr-2" />
                Muat
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
              <Button variant="destructive" size="sm" onClick={clearData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6" ref={printRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Informasi Keluarga</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Anggota Keluarga</span>
              <span className="sm:hidden">Anggota</span>
            </TabsTrigger>
            <TabsTrigger value="baptis" className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span className="hidden sm:inline">Baptis & SIDI</span>
              <span className="sm:hidden">Baptis</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Informasi Keluarga */}
          <TabsContent value="info">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg print:bg-gray-100 print:text-gray-900">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Data Keluarga
                </CardTitle>
                <CardDescription className="text-blue-100 print:text-gray-600">
                  Lengkapi informasi keluarga di bawah ini
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Kolom */}
                  <div className="space-y-2">
                    <Label htmlFor="kolom" className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      Kolom
                    </Label>
                    <Select value={familyInfo.kolom} onValueChange={(v) => handleFamilyInfoChange('kolom', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kolom" />
                      </SelectTrigger>
                      <SelectContent>
                        {KOLOM_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nama Keluarga */}
                  <div className="space-y-2">
                    <Label htmlFor="namaKeluarga" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Nama Keluarga
                    </Label>
                    <Input
                      id="namaKeluarga"
                      value={familyInfo.namaKeluarga}
                      onChange={(e) => handleFamilyInfoChange('namaKeluarga', e.target.value)}
                      placeholder="Nama Kepala Keluarga"
                    />
                  </div>

                  {/* Nomor KK */}
                  <div className="space-y-2">
                    <Label htmlFor="nomorKK" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Nomor KK
                    </Label>
                    <Input
                      id="nomorKK"
                      value={familyInfo.nomorKK}
                      onChange={(e) => handleFamilyInfoChange('nomorKK', e.target.value)}
                      placeholder="16 digit Nomor KK"
                      maxLength={16}
                    />
                  </div>

                  {/* Tanggal Nikah */}
                  <div className="space-y-2">
                    <Label htmlFor="tanggalNikah" className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-600" />
                      Tanggal Nikah
                    </Label>
                    <Input
                      id="tanggalNikah"
                      type="date"
                      value={familyInfo.tanggalNikah}
                      onChange={(e) => handleFamilyInfoChange('tanggalNikah', e.target.value)}
                    />
                  </div>

                  {/* No. Surat */}
                  <div className="space-y-2">
                    <Label htmlFor="noSurat" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      No. Surat Nikah
                    </Label>
                    <Input
                      id="noSurat"
                      value={familyInfo.noSurat}
                      onChange={(e) => handleFamilyInfoChange('noSurat', e.target.value)}
                      placeholder="Nomor Surat"
                    />
                  </div>

                  {/* Pendeta Peneguh */}
                  <div className="space-y-2">
                    <Label htmlFor="pendetaPeneguh" className="flex items-center gap-2">
                      <Church className="h-4 w-4 text-blue-600" />
                      Pendeta Peneguh Nikah
                    </Label>
                    <Input
                      id="pendetaPeneguh"
                      value={familyInfo.pendetaPeneguh}
                      onChange={(e) => handleFamilyInfoChange('pendetaPeneguh', e.target.value)}
                      placeholder="Nama Pendeta"
                    />
                  </div>

                  {/* Rumah Tinggal */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="rumahTinggal" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Alamat Rumah Tinggal
                    </Label>
                    <Textarea
                      id="rumahTinggal"
                      value={familyInfo.rumahTinggal}
                      onChange={(e) => handleFamilyInfoChange('rumahTinggal', e.target.value)}
                      placeholder="Alamat lengkap rumah tinggal"
                      rows={2}
                    />
                  </div>

                  {/* Penghasilan Bulanan */}
                  <div className="space-y-2">
                    <Label htmlFor="penghasilan" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      Penghasilan Bulanan
                    </Label>
                    <Select value={familyInfo.penghasilanBulanan} onValueChange={(v) => handleFamilyInfoChange('penghasilanBulanan', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {PENGHASILAN_OPTIONS.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end print:hidden">
                  <Button onClick={() => setActiveTab('members')} className="bg-blue-600 hover:bg-blue-700">
                    Lanjut ke Anggota Keluarga
                    <Users className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Anggota Keluarga */}
          <TabsContent value="members">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg print:bg-gray-100 print:text-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Data Anggota Keluarga
                    </CardTitle>
                    <CardDescription className="text-blue-100 print:text-gray-600">
                      Masukkan data setiap anggota keluarga (maksimal 8 orang)
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white print:bg-blue-100 print:text-blue-800">
                    {members.length}/8 Anggota
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-6">
                  {members.map((member, index) => (
                    <div key={member.id} className="border rounded-xl p-4 md:p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 relative">
                      <div className="absolute top-2 right-2 print:hidden">
                        {members.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(member.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold">Anggota Keluarga #{index + 1}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* NIK */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">NIK</Label>
                          <Input
                            value={member.nik}
                            onChange={(e) => handleMemberChange(member.id, 'nik', e.target.value)}
                            placeholder="16 digit NIK"
                            maxLength={16}
                            className="h-9"
                          />
                        </div>

                        {/* Nama Lengkap */}
                        <div className="space-y-1 md:col-span-1 lg:col-span-2">
                          <Label className="text-xs text-gray-600">Nama Lengkap (sesuai KK/KTP)</Label>
                          <Input
                            value={member.namaLengkap}
                            onChange={(e) => handleMemberChange(member.id, 'namaLengkap', e.target.value)}
                            placeholder="Nama lengkap"
                            className="h-9"
                          />
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Jenis Kelamin</Label>
                          <Select 
                            value={member.jenisKelamin} 
                            onValueChange={(v) => handleMemberChange(member.id, 'jenisKelamin', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L">Laki-laki</SelectItem>
                              <SelectItem value="P">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tempat Lahir */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Tempat Lahir</Label>
                          <Input
                            value={member.tempatLahir}
                            onChange={(e) => handleMemberChange(member.id, 'tempatLahir', e.target.value)}
                            placeholder="Kota kelahiran"
                            className="h-9"
                          />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Tanggal Lahir</Label>
                          <Input
                            type="date"
                            value={member.tanggalLahir}
                            onChange={(e) => handleMemberChange(member.id, 'tanggalLahir', e.target.value)}
                            className="h-9"
                          />
                        </div>

                        {/* Hubungan Keluarga */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Hubungan Keluarga</Label>
                          <Select 
                            value={member.hubunganKeluarga} 
                            onValueChange={(v) => handleMemberChange(member.id, 'hubunganKeluarga', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              {HUBUNGAN_KELUARGA_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Status Pernikahan */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Status Pernikahan</Label>
                          <Select 
                            value={member.statusPernikahan} 
                            onValueChange={(v) => handleMemberChange(member.id, 'statusPernikahan', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_PERNIKAHAN_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Pekerjaan */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Pekerjaan</Label>
                          <Input
                            value={member.pekerjaan}
                            onChange={(e) => handleMemberChange(member.id, 'pekerjaan', e.target.value)}
                            placeholder="Pekerjaan"
                            className="h-9"
                          />
                        </div>

                        {/* Golongan Darah */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Gol. Darah</Label>
                          <Select 
                            value={member.golDarah} 
                            onValueChange={(v) => handleMemberChange(member.id, 'golDarah', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              {GOL_DARAH_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Pendidikan Terakhir */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Pendidikan Terakhir</Label>
                          <Select 
                            value={member.pendidikanTerakhir} 
                            onValueChange={(v) => handleMemberChange(member.id, 'pendidikanTerakhir', v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                              {PENDIDIKAN_OPTIONS.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* No. Telp/WA */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">No. Telp/WA</Label>
                          <Input
                            value={member.noTelpWA}
                            onChange={(e) => handleMemberChange(member.id, 'noTelpWA', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between print:hidden">
                  <Button variant="outline" onClick={() => setActiveTab('info')}>
                    Kembali
                  </Button>
                  <div className="flex gap-2">
                    {members.length < 8 && (
                      <Button variant="outline" onClick={addMember} className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Anggota
                      </Button>
                    )}
                    <Button onClick={() => setActiveTab('baptis')} className="bg-blue-600 hover:bg-blue-700">
                      Lanjut ke Baptis & SIDI
                      <Droplet className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Baptis & SIDI */}
          <TabsContent value="baptis">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg print:bg-gray-100 print:text-gray-900">
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Data Baptis & SIDI
                </CardTitle>
                <CardDescription className="text-blue-100 print:text-gray-600">
                  Catatan: * diisi Y = Sudah, N = Belum
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-600 text-white print:bg-gray-200 print:text-black">
                        <TableHead className="text-white print:text-black font-bold">No</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Nama</TableHead>
                        <TableHead className="text-center text-white print:text-black font-bold">Baptis*</TableHead>
                        <TableHead className="text-white print:text-black font-bold">No. Surat Baptis</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Tgl Baptis</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Pendeta Baptis</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Gereja Baptis</TableHead>
                        <TableHead className="text-center text-white print:text-black font-bold">SIDI*</TableHead>
                        <TableHead className="text-white print:text-black font-bold">No. Surat SIDI</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Tgl SIDI</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Pendeta SIDI</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Gereja SIDI</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Domisili</TableHead>
                        <TableHead className="text-white print:text-black font-bold">Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => (
                        <TableRow key={member.id} className="hover:bg-blue-50/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{member.namaLengkap || '-'}</TableCell>
                          <TableCell className="text-center">
                            <Select 
                              value={member.baptis.sudah ? 'Y' : member.baptis.sudah === false && member.baptis.noSurat ? 'Y' : 'N'} 
                              onValueChange={(v) => handleMemberChange(member.id, 'baptis.sudah', v === 'Y')}
                            >
                              <SelectTrigger className="w-16 h-8 mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Y">Y</SelectItem>
                                <SelectItem value="N">N</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.baptis.noSurat}
                              onChange={(e) => handleMemberChange(member.id, 'baptis.noSurat', e.target.value)}
                              placeholder="No. Surat"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={member.baptis.tanggal}
                              onChange={(e) => handleMemberChange(member.id, 'baptis.tanggal', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.baptis.namaPendeta}
                              onChange={(e) => handleMemberChange(member.id, 'baptis.namaPendeta', e.target.value)}
                              placeholder="Nama Pendeta"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.baptis.gerejaJemaat}
                              onChange={(e) => handleMemberChange(member.id, 'baptis.gerejaJemaat', e.target.value)}
                              placeholder="Gereja/Jemaat"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Select 
                              value={member.sidi.sudah ? 'Y' : 'N'} 
                              onValueChange={(v) => handleMemberChange(member.id, 'sidi.sudah', v === 'Y')}
                            >
                              <SelectTrigger className="w-16 h-8 mx-auto">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Y">Y</SelectItem>
                                <SelectItem value="N">N</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.sidi.noSurat}
                              onChange={(e) => handleMemberChange(member.id, 'sidi.noSurat', e.target.value)}
                              placeholder="No. Surat"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={member.sidi.tanggal}
                              onChange={(e) => handleMemberChange(member.id, 'sidi.tanggal', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.sidi.namaPendeta}
                              onChange={(e) => handleMemberChange(member.id, 'sidi.namaPendeta', e.target.value)}
                              placeholder="Nama Pendeta"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.sidi.gerejaJemaat}
                              onChange={(e) => handleMemberChange(member.id, 'sidi.gerejaJemaat', e.target.value)}
                              placeholder="Gereja/Jemaat"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.domisili}
                              onChange={(e) => handleMemberChange(member.id, 'domisili', e.target.value)}
                              placeholder="Domisili"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.keterangan}
                              onChange={(e) => handleMemberChange(member.id, 'keterangan', e.target.value)}
                              placeholder="Keterangan"
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Signature Section */}
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Pemberi Data (Keluarga)</Label>
                    <Input
                      value={signatureInfo.pemberiData}
                      onChange={(e) => handleSignatureChange('pemberiData', e.target.value)}
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Penatua Kolom</Label>
                    <Input
                      value={signatureInfo.penatuaKolom}
                      onChange={(e) => handleSignatureChange('penatuaKolom', e.target.value)}
                      placeholder="Nama Penatua"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Diaken Kolom</Label>
                    <Input
                      value={signatureInfo.diakenKolom}
                      onChange={(e) => handleSignatureChange('diakenKolom', e.target.value)}
                      placeholder="Nama Diaken"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ketua BPMJ</Label>
                    <Input
                      value={signatureInfo.ketuaBPMJ}
                      onChange={(e) => handleSignatureChange('ketuaBPMJ', e.target.value)}
                      placeholder="Nama Ketua BPMJ"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Tanggal Pengisian</Label>
                    <Input
                      type="date"
                      value={signatureInfo.tanggal}
                      onChange={(e) => handleSignatureChange('tanggal', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between print:hidden">
                  <Button variant="outline" onClick={() => setActiveTab('members')}>
                    Kembali
                  </Button>
                  <Button onClick={saveData} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print Version - Summary */}
        <div className="hidden print:block">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">FORMULIR SENSUS WARGA GEREJA MASEHI INJILI DI MINAHASA</h1>
            <h2 className="text-xl">Tahun 2026</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8 text-sm">
            <div><strong>Kolom:</strong> {familyInfo.kolom || '...........'}</div>
            <div><strong>Nama Keluarga:</strong> {familyInfo.namaKeluarga || '...........'}</div>
            <div><strong>Nomor KK:</strong> {familyInfo.nomorKK || '...........'}</div>
            <div><strong>Tanggal Nikah:</strong> {familyInfo.tanggalNikah || '...........'}</div>
          </div>

          <h3 className="text-lg font-bold mb-4">Data Anggota Keluarga</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>L/P</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Hub. Keluarga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Gol. Darah</TableHead>
                <TableHead>Pendidikan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{member.nik}</TableCell>
                  <TableCell>{member.namaLengkap}</TableCell>
                  <TableCell>{member.jenisKelamin}</TableCell>
                  <TableCell>{member.tempatLahir}, {member.tanggalLahir}</TableCell>
                  <TableCell>{member.hubunganKeluarga}</TableCell>
                  <TableCell>{member.statusPernikahan}</TableCell>
                  <TableCell>{member.pekerjaan}</TableCell>
                  <TableCell>{member.golDarah}</TableCell>
                  <TableCell>{member.pendidikanTerakhir}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-around text-center">
            <div>
              <p>Pemberi Data</p>
              <p className="mt-12 border-t border-black pt-2">{signatureInfo.pemberiData || '................'}</p>
            </div>
            <div>
              <p>Penatua Kolom</p>
              <p className="mt-12 border-t border-black pt-2">{signatureInfo.penatuaKolom || '................'}</p>
            </div>
            <div>
              <p>Diaken Kolom</p>
              <p className="mt-12 border-t border-black pt-2">{signatureInfo.diakenKolom || '................'}</p>
            </div>
            <div>
              <p>Ketua BPMJ</p>
              <p className="mt-12 border-t border-black pt-2">{signatureInfo.ketuaBPMJ || '................'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-600 text-sm">
          <p>Formulir Sensus Jemaat GMIM 2026 | Data disimpan secara lokal di browser</p>
        </div>
      </footer>
    </div>
  )
}
