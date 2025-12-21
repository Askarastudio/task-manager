import { useState, useEffect } from "react"
import { UploadSimple, Buildings } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanySettings } from "@/lib/types"
import { toast } from "sonner"

interface CompanyPageProps {
  settings: CompanySettings
  onSave: (settings: CompanySettings) => void
}

export function CompanyPage({ settings, onSave }: CompanyPageProps) {
  const [name, setName] = useState(settings.name)
  const [address, setAddress] = useState(settings.address)
  const [phone, setPhone] = useState(settings.phone)
  const [email, setEmail] = useState(settings.email)
  const [logo, setLogo] = useState(settings.logo || "")
  const [letterhead, setLetterhead] = useState(settings.letterhead || "")

  useEffect(() => {
    setName(settings.name)
    setAddress(settings.address)
    setPhone(settings.phone)
    setEmail(settings.email)
    setLogo(settings.logo || "")
    setLetterhead(settings.letterhead || "")
  }, [settings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      address,
      phone,
      email,
      logo: logo || undefined,
      letterhead: letterhead || undefined,
    })
    toast.success("Pengaturan perusahaan berhasil disimpan")
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Pengaturan Perusahaan</h2>
        <p className="text-muted-foreground">Kelola informasi dan branding perusahaan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Logo Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {logo ? (
                  <img src={logo} alt="Company Logo" className="h-24 w-24 object-contain border border-border rounded-lg p-2" />
                ) : (
                  <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <Buildings size={32} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="logo-upload">Upload Logo</Label>
                <div className="flex gap-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleLogoUpload}
                    className="flex-1"
                  />
                  {logo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLogo("")}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: PNG, JPG, JPEG. Maksimal 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nama Perusahaan *</Label>
                <Input
                  id="company-name"
                  placeholder="PT. Nama Perusahaan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email *</Label>
                <Input
                  id="company-email"
                  type="email"
                  placeholder="info@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Telepon *</Label>
              <Input
                id="company-phone"
                type="tel"
                placeholder="+62 21 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Alamat *</Label>
              <Textarea
                id="company-address"
                placeholder="Jl. Nama Jalan No. 123, Kota, Provinsi"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kop Surat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="letterhead">Template Kop Surat</Label>
              <Textarea
                id="letterhead"
                placeholder="Masukkan template kop surat atau informasi header dokumen..."
                value={letterhead}
                onChange={(e) => setLetterhead(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Template ini akan digunakan untuk dokumen dan laporan
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg" className="gap-2">
            <UploadSimple size={20} />
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  )
}
