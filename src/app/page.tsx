'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Users, 
  Church, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  Printer,
  FileText,
  Heart,
  GraduationCap,
  Droplet,
  Building,
  Eye,
  Database,
  Search,
  Calendar,
  MapPin,
  Phone,
  UserCheck,
  AlertCircle,
  FolderOpen
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

interface SignatureInfo {
  pemberiData: string
  penatuaKolom: string
  diakenKolom: string
  ketuaBPMJ: string
  tanggal: string
}

interface SavedFamilyData {
  id: string
  savedAt: string
  familyInfo: FamilyInfo
  members: FamilyMember[]
  signatureInfo: SignatureInfo
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

const STORAGE_KEY = 'sensusJemaat2026_all'

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
  
  const [signatureInfo, setSignatureInfo] = useState<SignatureInfo>({
    pemberiData: '',
    penatuaKolom: '',
    diakenKolom: '',
    ketuaBPMJ: '',
    tanggal: new Date().toISOString().split('T')[0]
  })

  const [activeTab, setActiveTab] = useState('info')
  const [savedDataList, setSavedDataList] = useState<SavedFamilyData[]>(() => {
    // Initialize from localStorage on first render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<SavedFamilyData | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dataToDelete, setDataToDelete] = useState<string | null>(null)

  // Refresh saved data list
  const refreshSavedDataList = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setSavedDataList(JSON.parse(saved))
    } else {
      setSavedDataList([])
    }
  }

  // Handlers
  const handleFamilyInfoChange = (field: keyof FamilyInfo, value: string) => {
    setFamilyInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleMemberChange = (id: number, field: string, value: string | boolean) => {
    setMembers(prev => prev.map(member => {
      if (member.id !== id) return member
      
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

  // Save data to localStorage (add to list)
  const saveData = () => {
    // Validate required fields
    if (!familyInfo.namaKeluarga) {
      alert('Nama Keluarga wajib diisi!')
      return
    }

    const newEntry: SavedFamilyData = {
      id: `family_${Date.now()}`,
      savedAt: new Date().toISOString(),
      familyInfo: { ...familyInfo },
      members: [...members],
      signatureInfo: { ...signatureInfo }
    }

    const existingData = localStorage.getItem(STORAGE_KEY)
    let allData: SavedFamilyData[] = existingData ? JSON.parse(existingData) : []
    allData.unshift(newEntry) // Add to beginning
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
    setSavedDataList(allData)
    
    alert('Data berhasil disimpan!')
  }

  // Delete specific data
  const deleteData = (id: string) => {
    const updatedList = savedDataList.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
    setSavedDataList(updatedList)
    setDeleteDialogOpen(false)
    setDataToDelete(null)
  }

  // Load specific data to edit
  const loadDataToEdit = (data: SavedFamilyData) => {
    setFamilyInfo(data.familyInfo)
    setMembers(data.members)
    setSignatureInfo(data.signatureInfo)
    setActiveTab('info')
    setViewDialogOpen(false)
  }

  // Clear current form
  const clearForm = () => {
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

  // Clear all saved data
  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus SEMUA data tersimpan? Tindakan ini tidak dapat dibatalkan!')) {
      localStorage.removeItem(STORAGE_KEY)
      setSavedDataList([])
      alert('Semua data telah dihapus')
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Filter data based on search
  const filteredData = savedDataList.filter(item => {
    const searchLower = searchQuery.toLowerCase()
    return (
      item.familyInfo.namaKeluarga.toLowerCase().includes(searchLower) ||
      item.familyInfo.kolom.toLowerCase().includes(searchLower) ||
      item.familyInfo.nomorKK.includes(searchQuery) ||
      item.members.some(m => m.namaLengkap.toLowerCase().includes(searchLower))
    )
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
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
              <Button variant="secondary" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
              <Button variant="destructive" size="sm" onClick={clearForm}>
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6" ref={printRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-4 mb-6">
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
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data Tersimpan</span>
              <span className="sm:hidden">Tersimpan</span>
              {savedDataList.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20">
                  {savedDataList.length}
                </Badge>
              )}
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

                  <div className="space-y-2">
                    <Label htmlFor="namaKeluarga" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Nama Keluarga *
                    </Label>
                    <Input
                      id="namaKeluarga"
                      value={familyInfo.namaKeluarga}
                      onChange={(e) => handleFamilyInfoChange('namaKeluarga', e.target.value)}
                      placeholder="Nama Kepala Keluarga"
                    />
                  </div>

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

                        <div className="space-y-1 md:col-span-1 lg:col-span-2">
                          <Label className="text-xs text-gray-600">Nama Lengkap (sesuai KK/KTP)</Label>
                          <Input
                            value={member.namaLengkap}
                            onChange={(e) => handleMemberChange(member.id, 'namaLengkap', e.target.value)}
                            placeholder="Nama lengkap"
                            className="h-9"
                          />
                        </div>

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

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Tempat Lahir</Label>
                          <Input
                            value={member.tempatLahir}
                            onChange={(e) => handleMemberChange(member.id, 'tempatLahir', e.target.value)}
                            placeholder="Kota kelahiran"
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Tanggal Lahir</Label>
                          <Input
                            type="date"
                            value={member.tanggalLahir}
                            onChange={(e) => handleMemberChange(member.id, 'tanggalLahir', e.target.value)}
                            className="h-9"
                          />
                        </div>

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

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Pekerjaan</Label>
                          <Input
                            value={member.pekerjaan}
                            onChange={(e) => handleMemberChange(member.id, 'pekerjaan', e.target.value)}
                            placeholder="Pekerjaan"
                            className="h-9"
                          />
                        </div>

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
                              value={member.baptis.sudah ? 'Y' : 'N'} 
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

          {/* Tab 4: Data Tersimpan */}
          <TabsContent value="saved">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Keluarga Tersimpan
                    </CardTitle>
                    <CardDescription className="text-green-100">
                      Lihat, edit, atau hapus data keluarga yang sudah disimpan
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
                    {savedDataList.length} Data
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari berdasarkan nama keluarga, kolom, atau NIK..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {savedDataList.length > 0 && (
                    <Button variant="destructive" onClick={clearAllData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Semua
                    </Button>
                  )}
                </div>

                {/* Data List */}
                {filteredData.length === 0 ? (
                  <div className="text-center py-16">
                    <FolderOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                      {savedDataList.length === 0 
                        ? 'Belum ada data tersimpan' 
                        : 'Tidak ada data yang cocok dengan pencarian'}
                    </p>
                    {savedDataList.length === 0 && (
                      <Button 
                        onClick={() => setActiveTab('info')} 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Data Baru
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredData.map((data) => (
                      <div 
                        key={data.id} 
                        className="border rounded-xl p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50/50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {data.familyInfo.namaKeluarga}
                              </h3>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                {data.familyInfo.kolom || 'Belum ada kolom'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>KK: {data.familyInfo.nomorKK || '-'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{data.members.length} Anggota</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(data.savedAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                <span>{data.signatureInfo.pemberiData || 'Belum ada pemberi data'}</span>
                              </div>
                            </div>
                            {/* Preview Members */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {data.members.slice(0, 4).map((member, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-gray-100">
                                  {member.namaLengkap || `Anggota ${idx + 1}`}
                                  {member.jenisKelamin && ` (${member.jenisKelamin})`}
                                </Badge>
                              ))}
                              {data.members.length > 4 && (
                                <Badge variant="secondary" className="bg-gray-200">
                                  +{data.members.length - 4} lainnya
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedData(data)
                                setViewDialogOpen(true)
                              }}
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadDataToEdit(data)}
                              className="border-green-600 text-green-600 hover:bg-green-50"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDataToDelete(data.id)
                                setDeleteDialogOpen(true)
                              }}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* View Detail Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Detail Data Keluarga
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap keluarga {selectedData?.familyInfo.namaKeluarga}
              </DialogDescription>
            </DialogHeader>
            
            {selectedData && (
              <div className="space-y-6">
                {/* Family Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Informasi Keluarga</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Kolom:</span>
                      <p className="font-medium">{selectedData.familyInfo.kolom || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nama Keluarga:</span>
                      <p className="font-medium">{selectedData.familyInfo.namaKeluarga}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">No. KK:</span>
                      <p className="font-medium">{selectedData.familyInfo.nomorKK || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tanggal Nikah:</span>
                      <p className="font-medium">{selectedData.familyInfo.tanggalNikah || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">No. Surat:</span>
                      <p className="font-medium">{selectedData.familyInfo.noSurat || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pendeta Peneguh:</span>
                      <p className="font-medium">{selectedData.familyInfo.pendetaPeneguh || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Alamat:</span>
                      <p className="font-medium">{selectedData.familyInfo.rumahTinggal || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Penghasilan:</span>
                      <p className="font-medium">{selectedData.familyInfo.penghasilanBulanan || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Members Table */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Anggota Keluarga ({selectedData.members.length})</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead>No</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>L/P</TableHead>
                          <TableHead>TTL</TableHead>
                          <TableHead>Hubungan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Pekerjaan</TableHead>
                          <TableHead>Gol. Darah</TableHead>
                          <TableHead>Pendidikan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedData.members.map((member, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{member.namaLengkap || '-'}</TableCell>
                            <TableCell>{member.jenisKelamin || '-'}</TableCell>
                            <TableCell>
                              {member.tempatLahir && member.tanggalLahir
                                ? `${member.tempatLahir}, ${member.tanggalLahir}`
                                : member.tempatLahir || member.tanggalLahir || '-'}
                            </TableCell>
                            <TableCell>{member.hubunganKeluarga || '-'}</TableCell>
                            <TableCell>{member.statusPernikahan || '-'}</TableCell>
                            <TableCell>{member.pekerjaan || '-'}</TableCell>
                            <TableCell>{member.golDarah || '-'}</TableCell>
                            <TableCell>{member.pendidikanTerakhir || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Baptis & SIDI Summary */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Status Baptis & SIDI</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Sudah Baptis:</span>
                      <p className="font-medium">
                        {selectedData.members.filter(m => m.baptis.sudah).length} dari {selectedData.members.length}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sudah SIDI:</span>
                      <p className="font-medium">
                        {selectedData.members.filter(m => m.sidi.sudah).length} dari {selectedData.members.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signature Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Tanda Tangan</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Pemberi Data:</span>
                      <p className="font-medium">{selectedData.signatureInfo.pemberiData || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Penatua:</span>
                      <p className="font-medium">{selectedData.signatureInfo.penatuaKolom || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Diaken:</span>
                      <p className="font-medium">{selectedData.signatureInfo.diakenKolom || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ketua BPMJ:</span>
                      <p className="font-medium">{selectedData.signatureInfo.ketuaBPMJ || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Tutup
              </Button>
              {selectedData && (
                <Button onClick={() => loadDataToEdit(selectedData)} className="bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Data
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Konfirmasi Hapus
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => dataToDelete && deleteData(dataToDelete)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print Version */}
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
