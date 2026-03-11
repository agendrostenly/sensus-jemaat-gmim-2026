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
  UserCheck,
  AlertCircle,
  FolderOpen,
  Cake,
  Gift,
  PartyPopper
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

const STORAGE_KEY = 'sensusJemaat2026_all'

// Helper functions
const calculateAge = (birthDate: string, targetYear?: number): number => {
  if (!birthDate) return 0
  const birth = new Date(birthDate)
  const target = targetYear ? new Date(targetYear, 11, 31) : new Date()
  let age = target.getFullYear() - birth.getFullYear()
  const monthDiff = target.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && target.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const calculateMarriageDuration = (marriageDate: string, targetYear?: number): number => {
  if (!marriageDate) return 0
  const marriage = new Date(marriageDate)
  const target = targetYear ? new Date(targetYear, 11, 31) : new Date()
  return target.getFullYear() - marriage.getFullYear()
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}

const formatDateTime = (dateString: string): string => {
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

const getMonthName = (month: number): string => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months[month - 1] || ''
}

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
  
  const [signatureInfo, setSignatureInfo] = useState<SignatureInfo>({
    pemberiData: '',
    penatuaKolom: '',
    diakenKolom: '',
    ketuaBPMJ: '',
    tanggal: new Date().toISOString().split('T')[0]
  })

  const [activeTab, setActiveTab] = useState('info')
  const [savedDataList, setSavedDataList] = useState<SavedFamilyData[]>(() => {
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
  
  // Report states
  const [reportYear, setReportYear] = useState(new Date().getFullYear())
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [dataToPrint, setDataToPrint] = useState<SavedFamilyData | null>(null)

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

  // Save data to localStorage
  const saveData = () => {
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
    allData.unshift(newEntry)
    
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

  // Print current form
  const handlePrintCurrent = () => {
    setDataToPrint({
      id: 'current',
      savedAt: new Date().toISOString(),
      familyInfo,
      members,
      signatureInfo
    })
    setPrintDialogOpen(true)
  }

  // Print specific saved data
  const handlePrintData = (data: SavedFamilyData) => {
    setDataToPrint(data)
    setPrintDialogOpen(true)
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

  // Get birthday report for month
  const getBirthdayReport = () => {
    const birthdays: { family: SavedFamilyData; member: FamilyMember; age: number }[] = []
    
    savedDataList.forEach(family => {
      family.members.forEach(member => {
        if (member.tanggalLahir) {
          const birthDate = new Date(member.tanggalLahir)
          const birthMonth = birthDate.getMonth() + 1
          if (birthMonth === reportMonth) {
            birthdays.push({
              family,
              member,
              age: calculateAge(member.tanggalLahir, reportYear)
            })
          }
        }
      })
    })
    
    return birthdays.sort((a, b) => {
      const dayA = new Date(a.member.tanggalLahir).getDate()
      const dayB = new Date(b.member.tanggalLahir).getDate()
      return dayA - dayB
    })
  }

  // Get marriage anniversary report for month
  const getMarriageReport = () => {
    const marriages: { family: SavedFamilyData; duration: number }[] = []
    
    savedDataList.forEach(family => {
      if (family.familyInfo.tanggalNikah) {
        const marriageDate = new Date(family.familyInfo.tanggalNikah)
        const marriageMonth = marriageDate.getMonth() + 1
        if (marriageMonth === reportMonth) {
          marriages.push({
            family,
            duration: calculateMarriageDuration(family.familyInfo.tanggalNikah, reportYear)
          })
        }
      }
    })
    
    return marriages.sort((a, b) => {
      const dayA = new Date(a.family.familyInfo.tanggalNikah).getDate()
      const dayB = new Date(b.family.familyInfo.tanggalNikah).getDate()
      return dayA - dayB
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Church className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Formulir Sensus Jemaat 2026</h1>
                <p className="text-blue-100">Gereja Masehi Injili di Minahasa (GMIM)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={saveData}>
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
              <Button variant="secondary" size="sm" onClick={handlePrintCurrent}>
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
              <Button variant="destructive" size="sm" onClick={clearForm}>
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
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="info" className="flex items-center gap-1 md:gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Informasi</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1 md:gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Anggota</span>
            </TabsTrigger>
            <TabsTrigger value="baptis" className="flex items-center gap-1 md:gap-2">
              <Droplet className="h-4 w-4" />
              <span className="hidden sm:inline">Baptis/SIDI</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1 md:gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data Tersimpan</span>
              {savedDataList.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20">
                  {savedDataList.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1 md:gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Laporan</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Informasi Keluarga */}
          <TabsContent value="info">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Data Keluarga
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Lengkapi informasi keluarga di bawah ini
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
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
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Nama Keluarga *
                    </Label>
                    <Input
                      value={familyInfo.namaKeluarga}
                      onChange={(e) => handleFamilyInfoChange('namaKeluarga', e.target.value)}
                      placeholder="Nama Kepala Keluarga"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Nomor KK
                    </Label>
                    <Input
                      value={familyInfo.nomorKK}
                      onChange={(e) => handleFamilyInfoChange('nomorKK', e.target.value)}
                      placeholder="16 digit Nomor KK"
                      maxLength={16}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-600" />
                      Tanggal Nikah
                    </Label>
                    <Input
                      type="date"
                      value={familyInfo.tanggalNikah}
                      onChange={(e) => handleFamilyInfoChange('tanggalNikah', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      No. Surat Nikah
                    </Label>
                    <Input
                      value={familyInfo.noSurat}
                      onChange={(e) => handleFamilyInfoChange('noSurat', e.target.value)}
                      placeholder="Nomor Surat"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Church className="h-4 w-4 text-blue-600" />
                      Pendeta Peneguh Nikah
                    </Label>
                    <Input
                      value={familyInfo.pendetaPeneguh}
                      onChange={(e) => handleFamilyInfoChange('pendetaPeneguh', e.target.value)}
                      placeholder="Nama Pendeta"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Alamat Rumah Tinggal
                    </Label>
                    <Textarea
                      value={familyInfo.rumahTinggal}
                      onChange={(e) => handleFamilyInfoChange('rumahTinggal', e.target.value)}
                      placeholder="Alamat lengkap rumah tinggal"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
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

                <div className="mt-6 flex justify-end">
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
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Data Anggota Keluarga
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Masukkan data setiap anggota keluarga (maksimal 8 orang)
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {members.length}/8 Anggota
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-6">
                  {members.map((member, index) => (
                    <div key={member.id} className="border rounded-xl p-4 md:p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 relative">
                      <div className="absolute top-2 right-2">
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

                        <div className="space-y-1 lg:col-span-2">
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

                <div className="mt-6 flex justify-between">
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
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Data Baptis & SIDI
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Catatan: * diisi Y = Sudah, N = Belum
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-600 text-white">
                        <TableHead className="text-white font-bold">No</TableHead>
                        <TableHead className="text-white font-bold">Nama</TableHead>
                        <TableHead className="text-center text-white font-bold">Baptis*</TableHead>
                        <TableHead className="text-white font-bold">No. Surat Baptis</TableHead>
                        <TableHead className="text-white font-bold">Tgl Baptis</TableHead>
                        <TableHead className="text-white font-bold">Pendeta Baptis</TableHead>
                        <TableHead className="text-white font-bold">Gereja Baptis</TableHead>
                        <TableHead className="text-center text-white font-bold">SIDI*</TableHead>
                        <TableHead className="text-white font-bold">No. Surat SIDI</TableHead>
                        <TableHead className="text-white font-bold">Tgl SIDI</TableHead>
                        <TableHead className="text-white font-bold">Pendeta SIDI</TableHead>
                        <TableHead className="text-white font-bold">Gereja SIDI</TableHead>
                        <TableHead className="text-white font-bold">Domisili</TableHead>
                        <TableHead className="text-white font-bold">Keterangan</TableHead>
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

                <div className="mt-6 flex justify-between">
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
                      Lihat, edit, cetak, atau hapus data keluarga yang sudah disimpan
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
                                <span>{formatDateTime(data.savedAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                <span>{data.signatureInfo.pemberiData || 'Belum ada pemberi data'}</span>
                              </div>
                            </div>
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
                          <div className="flex gap-2 flex-wrap">
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
                              onClick={() => handlePrintData(data)}
                              className="border-green-600 text-green-600 hover:bg-green-50"
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Cetak
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadDataToEdit(data)}
                              className="border-amber-600 text-amber-600 hover:bg-amber-50"
                            >
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

          {/* Tab 5: Laporan Ulang Tahun & Pernikahan */}
          <TabsContent value="report">
            <div className="space-y-6">
              {/* Filter */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <PartyPopper className="h-5 w-5" />
                    Laporan Ulang Tahun & Anniversary Pernikahan
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Lihat jemaat yang berulang tahun atau anniversary pernikahan di bulan tertentu
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Tahun</Label>
                      <Input
                        type="number"
                        value={reportYear}
                        onChange={(e) => setReportYear(parseInt(e.target.value) || new Date().getFullYear())}
                        className="w-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bulan</Label>
                      <Select value={reportMonth.toString()} onValueChange={(v) => setReportMonth(parseInt(v))}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {getMonthName(i + 1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={() => setReportDialogOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Cetak Laporan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Birthday Report */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Cake className="h-5 w-5" />
                    Ulang Tahun - {getMonthName(reportMonth)} {reportYear}
                  </CardTitle>
                  <CardDescription className="text-pink-100">
                    Jemaat yang berulang tahun di bulan ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {getBirthdayReport().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Cake className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      Tidak ada jemaat yang berulang tahun di bulan ini
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-pink-100">
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Keluarga</TableHead>
                          <TableHead>Kolom</TableHead>
                          <TableHead>Umur</TableHead>
                          <TableHead>No. Telp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getBirthdayReport().map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(item.member.tanggalLahir).getDate()} {getMonthName(reportMonth)}
                            </TableCell>
                            <TableCell className="font-medium">{item.member.namaLengkap}</TableCell>
                            <TableCell>{item.family.familyInfo.namaKeluarga}</TableCell>
                            <TableCell>{item.family.familyInfo.kolom || '-'}</TableCell>
                            <TableCell>
                              <Badge className="bg-pink-100 text-pink-800">
                                {item.age} tahun
                              </Badge>
                            </TableCell>
                            <TableCell>{item.member.noTelpWA || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Marriage Anniversary Report */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Anniversary Pernikahan - {getMonthName(reportMonth)} {reportYear}
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Keluarga yang anniversary pernikahan di bulan ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {getMarriageReport().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      Tidak ada anniversary pernikahan di bulan ini
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-red-100">
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Keluarga</TableHead>
                          <TableHead>Kolom</TableHead>
                          <TableHead>Durasi</TableHead>
                          <TableHead>No. Telp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getMarriageReport().map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {new Date(item.family.familyInfo.tanggalNikah).getDate()} {getMonthName(reportMonth)}
                            </TableCell>
                            <TableCell className="font-medium">{item.family.familyInfo.namaKeluarga}</TableCell>
                            <TableCell>{item.family.familyInfo.kolom || '-'}</TableCell>
                            <TableCell>
                              <Badge className="bg-red-100 text-red-800">
                                {item.duration} tahun
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.family.members[0]?.noTelpWA || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
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
                      <p className="font-medium">{formatDate(selectedData.familyInfo.tanggalNikah)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">No. Surat:</span>
                      <p className="font-medium">{selectedData.familyInfo.noSurat || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Pendeta Peneguh:</span>
                      <p className="font-medium">{selectedData.familyInfo.pendetaPeneguh || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Penghasilan:</span>
                      <p className="font-medium">{selectedData.familyInfo.penghasilanBulanan || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Alamat:</span>
                      <p className="font-medium">{selectedData.familyInfo.rumahTinggal || '-'}</p>
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
                                ? `${member.tempatLahir}, ${formatDate(member.tanggalLahir)}`
                                : member.tempatLahir || formatDate(member.tanggalLahir) || '-'}
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
                <>
                  <Button onClick={() => handlePrintData(selectedData)} className="bg-green-600 hover:bg-green-700">
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak
                  </Button>
                  <Button onClick={() => loadDataToEdit(selectedData)} className="bg-blue-600 hover:bg-blue-700">
                    Edit Data
                  </Button>
                </>
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

        {/* Print Dialog */}
        <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Preview Cetak Formulir Sensus
              </DialogTitle>
              <DialogDescription>
                Pastikan data sudah benar sebelum mencetak
              </DialogDescription>
            </DialogHeader>
            
            {dataToPrint && (
              <div className="bg-white p-8 border rounded-lg print-content" id="print-content">
                {/* Header */}
                <div className="text-center mb-6 border-b pb-4">
                  <h1 className="text-xl font-bold">GEREJA MASEHI INJILI DI MINAHASA</h1>
                  <h2 className="text-lg font-bold">FORMULIR SENSUS WARGA JEMAAT TAHUN 2026</h2>
                </div>

                {/* Family Info */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 bg-gray-100 p-2">A. DATA KELUARGA</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="border p-2">
                      <span className="text-gray-500">1. Kolom:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.kolom || '...........'}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">2. Nama Keluarga:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.namaKeluarga || '...........'}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">3. Nomor KK:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.nomorKK || '...........'}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">4. Tanggal Nikah:</span>
                      <p className="font-bold">{formatDate(dataToPrint.familyInfo.tanggalNikah)}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">5. No. Surat Nikah:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.noSurat || '...........'}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">6. Pendeta Peneguh:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.pendetaPeneguh || '...........'}</p>
                    </div>
                    <div className="border p-2 col-span-2">
                      <span className="text-gray-500">7. Alamat Rumah Tinggal:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.rumahTinggal || '...........'}</p>
                    </div>
                    <div className="border p-2">
                      <span className="text-gray-500">8. Penghasilan Bulanan:</span>
                      <p className="font-bold">{dataToPrint.familyInfo.penghasilanBulanan || '...........'}</p>
                    </div>
                  </div>
                </div>

                {/* Members */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 bg-gray-100 p-2">B. DATA ANGGOTA KELUARGA</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="border p-1">No</th>
                          <th className="border p-1">NIK</th>
                          <th className="border p-1">Nama Lengkap</th>
                          <th className="border p-1">L/P</th>
                          <th className="border p-1">Tempat Lahir</th>
                          <th className="border p-1">Tgl Lahir</th>
                          <th className="border p-1">Hub. Keluarga</th>
                          <th className="border p-1">Status Nikah</th>
                          <th className="border p-1">Pekerjaan</th>
                          <th className="border p-1">Gol. Darah</th>
                          <th className="border p-1">Pendidikan</th>
                          <th className="border p-1">No. Telp/WA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataToPrint.members.map((member, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border p-1 text-center">{idx + 1}</td>
                            <td className="border p-1">{member.nik || '-'}</td>
                            <td className="border p-1 font-medium">{member.namaLengkap || '-'}</td>
                            <td className="border p-1 text-center">{member.jenisKelamin || '-'}</td>
                            <td className="border p-1">{member.tempatLahir || '-'}</td>
                            <td className="border p-1">{member.tanggalLahir || '-'}</td>
                            <td className="border p-1">{member.hubunganKeluarga || '-'}</td>
                            <td className="border p-1">{member.statusPernikahan || '-'}</td>
                            <td className="border p-1">{member.pekerjaan || '-'}</td>
                            <td className="border p-1 text-center">{member.golDarah || '-'}</td>
                            <td className="border p-1">{member.pendidikanTerakhir || '-'}</td>
                            <td className="border p-1">{member.noTelpWA || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Baptis & SIDI */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 bg-gray-100 p-2">C. DATA BAPTIS & SIDI</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-green-600 text-white">
                          <th className="border p-1" rowSpan={2}>No</th>
                          <th className="border p-1" rowSpan={2}>Nama</th>
                          <th className="border p-1 text-center" colSpan={4}>BAPTIS</th>
                          <th className="border p-1 text-center" colSpan={4}>SIDI</th>
                          <th className="border p-1" rowSpan={2}>Domisili</th>
                          <th className="border p-1" rowSpan={2}>Keterangan</th>
                        </tr>
                        <tr className="bg-green-500 text-white">
                          <th className="border p-1">Y/N</th>
                          <th className="border p-1">No. Surat</th>
                          <th className="border p-1">Tanggal</th>
                          <th className="border p-1">Gereja</th>
                          <th className="border p-1">Y/N</th>
                          <th className="border p-1">No. Surat</th>
                          <th className="border p-1">Tanggal</th>
                          <th className="border p-1">Gereja</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataToPrint.members.map((member, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border p-1 text-center">{idx + 1}</td>
                            <td className="border p-1 font-medium">{member.namaLengkap || '-'}</td>
                            <td className="border p-1 text-center">{member.baptis.sudah ? 'Y' : 'N'}</td>
                            <td className="border p-1">{member.baptis.noSurat || '-'}</td>
                            <td className="border p-1">{member.baptis.tanggal || '-'}</td>
                            <td className="border p-1">{member.baptis.gerejaJemaat || '-'}</td>
                            <td className="border p-1 text-center">{member.sidi.sudah ? 'Y' : 'N'}</td>
                            <td className="border p-1">{member.sidi.noSurat || '-'}</td>
                            <td className="border p-1">{member.sidi.tanggal || '-'}</td>
                            <td className="border p-1">{member.sidi.gerejaJemaat || '-'}</td>
                            <td className="border p-1">{member.domisili || '-'}</td>
                            <td className="border p-1">{member.keterangan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">* Catatan: Y = Sudah, N = Belum</p>
                </div>

                {/* Signatures */}
                <div className="mt-8">
                  <p className="text-sm mb-4">{dataToPrint.familyInfo.rumahTinggal || '..........................'}, {formatDate(dataToPrint.signatureInfo.tanggal)}</p>
                  <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p className="mb-12">Pemberi Data</p>
                      <p className="border-t border-black pt-1">{dataToPrint.signatureInfo.pemberiData || '....................'}</p>
                    </div>
                    <div>
                      <p className="mb-12">Penatua Kolom</p>
                      <p className="border-t border-black pt-1">{dataToPrint.signatureInfo.penatuaKolom || '....................'}</p>
                    </div>
                    <div>
                      <p className="mb-12">Diaken Kolom</p>
                      <p className="border-t border-black pt-1">{dataToPrint.signatureInfo.diakenKolom || '....................'}</p>
                    </div>
                    <div>
                      <p className="mb-12">Ketua BPMJ</p>
                      <p className="border-t border-black pt-1">{dataToPrint.signatureInfo.ketuaBPMJ || '....................'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
                Tutup
              </Button>
              <Button 
                onClick={() => {
                  const printContent = document.getElementById('print-content')
                  if (printContent) {
                    const printWindow = window.open('', '', 'height=800,width=1200')
                    if (printWindow) {
                      printWindow.document.write('<html><head><title>Cetak Formulir Sensus</title>')
                      printWindow.document.write('<style>')
                      printWindow.document.write('body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }')
                      printWindow.document.write('table { width: 100%; border-collapse: collapse; }')
                      printWindow.document.write('th, td { border: 1px solid #333; padding: 4px 8px; text-align: left; }')
                      printWindow.document.write('th { background-color: #1e40af; color: white; }')
                      printWindow.document.write('.bg-blue-600 { background-color: #1e40af; }')
                      printWindow.document.write('.bg-green-600 { background-color: #16a34a; }')
                      printWindow.document.write('.bg-green-500 { background-color: #22c55e; }')
                      printWindow.document.write('.bg-gray-100 { background-color: #f3f4f6; }')
                      printWindow.document.write('.bg-gray-50 { background-color: #f9fafb; }')
                      printWindow.document.write('@media print { body { padding: 0; } }')
                      printWindow.document.write('</style>')
                      printWindow.document.write('</head><body>')
                      printWindow.document.write(printContent.innerHTML)
                      printWindow.document.write('</body></html>')
                      printWindow.document.close()
                      printWindow.print()
                    }
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Report Print Dialog */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5" />
                Laporan {getMonthName(reportMonth)} {reportYear}
              </DialogTitle>
              <DialogDescription>
                Preview laporan ulang tahun dan anniversary pernikahan
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-white p-8 border rounded-lg" id="report-content">
              {/* Header */}
              <div className="text-center mb-6 border-b pb-4">
                <h1 className="text-xl font-bold">GEREJA MASEHI INJILI DI MINAHASA</h1>
                <h2 className="text-lg font-bold">LAPORAN ULANG TAHUN & ANNIVERSARY PERNIKAHAN</h2>
                <h3 className="text-md">{getMonthName(reportMonth)} {reportYear}</h3>
              </div>

              {/* Birthday List */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 bg-pink-100 p-2">ULANG TAHUN</h3>
                {getBirthdayReport().length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Tidak ada jemaat yang berulang tahun di bulan ini</p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-pink-200">
                        <th className="border p-2">No</th>
                        <th className="border p-2">Tanggal</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Keluarga</th>
                        <th className="border p-2">Kolom</th>
                        <th className="border p-2">Umur</th>
                        <th className="border p-2">No. Telp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getBirthdayReport().map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-pink-50' : 'bg-white'}>
                          <td className="border p-2 text-center">{idx + 1}</td>
                          <td className="border p-2">{new Date(item.member.tanggalLahir).getDate()} {getMonthName(reportMonth)}</td>
                          <td className="border p-2 font-medium">{item.member.namaLengkap}</td>
                          <td className="border p-2">{item.family.familyInfo.namaKeluarga}</td>
                          <td className="border p-2">{item.family.familyInfo.kolom || '-'}</td>
                          <td className="border p-2 text-center font-bold">{item.age} tahun</td>
                          <td className="border p-2">{item.member.noTelpWA || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Marriage Anniversary List */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 bg-red-100 p-2">ANNIVERSARY PERNIKAHAN</h3>
                {getMarriageReport().length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Tidak ada anniversary pernikahan di bulan ini</p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-red-200">
                        <th className="border p-2">No</th>
                        <th className="border p-2">Tanggal</th>
                        <th className="border p-2">Keluarga</th>
                        <th className="border p-2">Kolom</th>
                        <th className="border p-2">Durasi</th>
                        <th className="border p-2">No. Telp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMarriageReport().map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-red-50' : 'bg-white'}>
                          <td className="border p-2 text-center">{idx + 1}</td>
                          <td className="border p-2">{new Date(item.family.familyInfo.tanggalNikah).getDate()} {getMonthName(reportMonth)}</td>
                          <td className="border p-2 font-medium">{item.family.familyInfo.namaKeluarga}</td>
                          <td className="border p-2">{item.family.familyInfo.kolom || '-'}</td>
                          <td className="border p-2 text-center font-bold">{item.duration} tahun</td>
                          <td className="border p-2">{item.family.members[0]?.noTelpWA || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Summary */}
              <div className="mt-4 text-sm text-gray-600">
                <p>Total Ulang Tahun: {getBirthdayReport().length} orang</p>
                <p>Total Anniversary Pernikahan: {getMarriageReport().length} keluarga</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                Tutup
              </Button>
              <Button 
                onClick={() => {
                  const reportContent = document.getElementById('report-content')
                  if (reportContent) {
                    const printWindow = window.open('', '', 'height=800,width=1200')
                    if (printWindow) {
                      printWindow.document.write('<html><head><title>Laporan Ulang Tahun & Anniversary</title>')
                      printWindow.document.write('<style>')
                      printWindow.document.write('body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }')
                      printWindow.document.write('table { width: 100%; border-collapse: collapse; }')
                      printWindow.document.write('th, td { border: 1px solid #333; padding: 8px; text-align: left; }')
                      printWindow.document.write('.bg-pink-200 { background-color: #fbcfe8; }')
                      printWindow.document.write('.bg-pink-100 { background-color: #fce7f3; }')
                      printWindow.document.write('.bg-pink-50 { background-color: #fdf2f8; }')
                      printWindow.document.write('.bg-red-200 { background-color: #fecaca; }')
                      printWindow.document.write('.bg-red-100 { background-color: #fee2e2; }')
                      printWindow.document.write('.bg-red-50 { background-color: #fef2f2; }')
                      printWindow.document.write('@media print { body { padding: 0; } }')
                      printWindow.document.write('</style>')
                      printWindow.document.write('</head><body>')
                      printWindow.document.write(reportContent.innerHTML)
                      printWindow.document.write('</body></html>')
                      printWindow.document.close()
                      printWindow.print()
                    }
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Cetak Laporan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
