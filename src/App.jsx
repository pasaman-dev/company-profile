import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Code, 
  Users, 
  Lightbulb, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Instagram, 
  Linkedin,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Cpu,
  Newspaper,
  Camera,
  ArrowRight
} from 'lucide-react'
import futuristicBg from './assets/futuristic_it_background.png'
import minangkabauPattern from './assets/futuristic_minangkabau_pattern.png'
import logoWhite from './assets/logo-text-putih.png'
import iconColor from './assets/icon-warna.png'
import workshopPhoto from './assets/workshop_photo.png'
import hackathonPhoto from './assets/hackathon_photo.png'
import techTalkPhoto from './assets/tech_talk_photo.png'
import './App.css'
import './responsive.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: "#home", label: "Beranda" },
    { href: "#about", label: "Tentang" },
    { href: "#activities", label: "Kegiatan" },
    { href: "#news", label: "Berita" },
    { href: "#gallery", label: "Galeri" },
    { href: "#contact", label: "Kontak" },
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  const pathname = window.location.pathname

  const detailData = {
    bootcamp: {
      title: 'Coding Bootcamp',
      description:
        'Pelatihan intensif programming dengan mentor berpengalaman. Kurikulum mendalam mencakup JavaScript, React, dan praktik DevOps modern.',
      image: workshopPhoto,
    },
    techtalk: {
      title: 'Tech Talk',
      description:
        'Diskusi terbuka tentang tren teknologi terkini, keamanan siber, AI, dan karier IT bersama pakar industri.',
      image: techTalkPhoto,
    },
    hackathon: {
      title: 'Hackathon',
      description:
        'Kompetisi 48 jam membangun solusi digital untuk isu lokal. Dibekali mentor, API partner, dan hadiah menarik.',
      image: hackathonPhoto,
    },
    gallery_workshop: {
      title: 'Workshop Coding Bootcamp',
      description:
        'Galeri suasana workshop coding bootcamp dengan pembelajaran interaktif dan kolaboratif.',
      image: workshopPhoto,
    },
    gallery_hackathon: {
      title: 'Hackathon Pasaman',
      description:
        'Momen intens hackathon 48 jam di mana tim beradu kreativitas menyelesaikan tantangan teknologi.',
      image: hackathonPhoto,
    },
    gallery_techtalk: {
      title: 'Tech Talk Session',
      description:
        'Sesi berbagi pengetahuan tentang tren teknologi bersama pakar industri.',
      image: techTalkPhoto,
    },
  }

  if (pathname.startsWith('/detail/') || pathname.startsWith('/gallery/')) {
    const slug = pathname.split('/').pop()
    const item = detailData[slug]
    if (!item) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-teal-800 to-orange-900 text-white px-4 text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Halaman tidak ditemukan</h1>
            <Button href="/" className="bg-gradient-to-r from-teal-500 to-orange-500 mt-4">Kembali</Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-orange-900 text-white flex flex-col">
        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold">PasamanDev</a>
          <Button href="/" size="sm" className="bg-gradient-to-r from-teal-500 to-orange-500">Beranda</Button>
        </header>
        <main className="flex-1 container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-8 text-center">{item.title}</h1>
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-lg">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded-md mb-6" />
            <p className="text-lg leading-relaxed mb-8">{item.description}</p>
            <Button href="/" className="bg-gradient-to-r from-teal-500 to-orange-500">Kembali ke Beranda</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-orange-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={iconColor} alt="PasamanDev Logo" className="w-12 h-12" />
              <span className="text-xl font-bold text-white">PasamanDev</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="text-white/80 hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
              <Button className="bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600">
                Bergabung
              </Button>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={() => setMobileOpen((p) => !p)}
              >
                {mobileOpen ? (
                  <ChevronRight className="w-6 h-6 rotate-180 transition-transform" />
                ) : (
                  <Code className="w-6 h-6" />
                )}
              </Button>
            </div>
          </nav>
        </div>
        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg border-b border-white/10">
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-white text-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <Button className="bg-gradient-to-r from-teal-500 to-orange-500 w-full" onClick={() => setMobileOpen(false)}>
                Bergabung
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${futuristicBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
          style={{
            backgroundImage: `url(${minangkabauPattern})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom'
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge className="mb-6 bg-teal-500/20 text-teal-300 border-teal-500/30">
            Komunitas Teknologi Pasaman
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Membangun
            <span className="bg-gradient-to-r from-teal-400 to-orange-400 bg-clip-text text-transparent">
              {" "}Masa Depan{" "}
            </span>
            Digital Bersama
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas IT terdepan di Pasaman. Belajar, berbagi, dan berkembang bersama 
            dalam dunia teknologi yang terus berevolusi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-lg px-8 py-3">
              Bergabung Sekarang
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
              Tentang Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siapa Kami?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Komunitas IT Pasaman adalah wadah bagi para teknologi enthusiast, developer, 
              dan profesional IT di wilayah Pasaman untuk saling belajar dan berkembang.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Komunitas Solid</CardTitle>
                <CardDescription className="text-white/70">
                  Lebih dari 200+ anggota aktif dari berbagai background teknologi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Inovasi Berkelanjutan</CardTitle>
                <CardDescription className="text-white/70">
                  Fokus pada pengembangan solusi teknologi untuk kemajuan daerah
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Pembelajaran Aktif</CardTitle>
                <CardDescription className="text-white/70">
                  Workshop, seminar, dan bootcamp rutin untuk meningkatkan skill
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${minangkabauPattern})`,
            backgroundSize: '200px',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
              Kegiatan Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Program & Kegiatan
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Berbagai program menarik yang dirancang untuk mengembangkan kemampuan 
              dan membangun jaringan profesional di bidang teknologi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a href="/detail/bootcamp" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Coding Bootcamp</CardTitle>
                  <CardDescription className="text-white/70">
                    Pelatihan intensif programming dengan mentor berpengalaman
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    Setiap bulan
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="/detail/techtalk" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Tech Talk</CardTitle>
                  <CardDescription className="text-white/70">
                    Diskusi terbuka tentang tren teknologi terkini dan masa depan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    Setiap 2 minggu
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="/detail/hackathon" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Hackathon</CardTitle>
                  <CardDescription className="text-white/70">
                    Kompetisi pengembangan solusi teknologi untuk masalah lokal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white/60">
                    <Calendar className="w-4 h-4 mr-2" />
                    Setiap 3 bulan
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
              Berita Terkini
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Kabar Terbaru
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Ikuti perkembangan terbaru dari komunitas dan dunia teknologi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Workshop React.js Sukses Digelar</CardTitle>
                <CardDescription className="text-white/70 mb-4">
                  Workshop React.js yang diselenggarakan minggu lalu berhasil diikuti oleh 50+ peserta dari berbagai kalangan.
                </CardDescription>
                <div className="flex items-center text-sm text-white/60 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  15 Mei 2025
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-teal-400 hover:text-teal-300 p-0">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Hackathon Pasaman 2025 Segera Dimulai</CardTitle>
                <CardDescription className="text-white/70 mb-4">
                  Pendaftaran hackathon terbesar di Pasaman telah dibuka. Tema tahun ini: "Smart City Solutions for Pasaman".
                </CardDescription>
                <div className="flex items-center text-sm text-white/60 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  10 Mei 2025
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-orange-400 hover:text-orange-300 p-0">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-400 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Kemitraan dengan Universitas Lokal</CardTitle>
                <CardDescription className="text-white/70 mb-4">
                  PasamanDev menjalin kemitraan strategis dengan universitas setempat untuk program magang dan penelitian.
                </CardDescription>
                <div className="flex items-center text-sm text-white/60 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  5 Mei 2025
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-teal-400 hover:text-teal-300 p-0">
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${minangkabauPattern})`,
            backgroundSize: '200px',
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
              Galeri Kegiatan
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Momen Berharga
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Dokumentasi kegiatan dan pencapaian komunitas PasamanDev
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a href="/gallery/gallery_workshop" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={workshopPhoto} 
                    alt="Workshop Coding" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Workshop Coding Bootcamp</CardTitle>
                  <CardDescription className="text-white/70">
                    Suasana pembelajaran yang interaktif dan kolaboratif dalam workshop coding bootcamp
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/gallery/gallery_hackathon" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={hackathonPhoto} 
                    alt="Hackathon Event" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Hackathon Indonesia</CardTitle>
                  <CardDescription className="text-white/70">
                    Tim-tim developer bekerja intensif mengembangkan solusi inovatif dalam kompetisi hackathon
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>

            <a href="/gallery/gallery_techtalk" className="group block">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={techTalkPhoto} 
                    alt="Tech Talk Session" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-orange-400 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Tech Talk Session</CardTitle>
                  <CardDescription className="text-white/70">
                    Sesi berbagi pengetahuan dan diskusi tentang tren teknologi terkini
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
              Showcase
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Project PasamanDev
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Beberapa proyek unggulan yang dikembangkan oleh komunitas PasamanDev.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((i)=>(
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img src={futuristicBg} alt="Project" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Project #{i}</CardTitle>
                  <CardDescription className="text-white/70">
                    Deskripsi singkat mengenai proyek open-source atau inisiatif komunitas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-teal-400 hover:text-teal-300 p-0" href="#">
                    Lihat Detail
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section id="partners" className="py-20 relative bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
              Partner & Kerjasama
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mitra Strategis Kami
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Kami berkolaborasi dengan berbagai institusi pendidikan, perusahaan, dan komunitas untuk menciptakan dampak teknologi positif.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-center">
            {[1,2,3,4,5,6].map((i)=>(
              <div key={i} className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 h-24">
                <span className="text-white/70 text-lg font-semibold">Logo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
              Testimoni
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Kata Mereka
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Ahmad Rizki</CardTitle>
                    <CardDescription className="text-white/70">Full Stack Developer</CardDescription>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  "Komunitas yang luar biasa! Saya belajar banyak hal baru dan bertemu dengan 
                  developer-developer hebat di Pasaman."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Sari Indah</CardTitle>
                    <CardDescription className="text-white/70">UI/UX Designer</CardDescription>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  "Program workshop yang sangat berkualitas. Mentor-mentornya berpengalaman 
                  dan materi yang diajarkan sangat aplikatif."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">B</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">Budi Santoso</CardTitle>
                    <CardDescription className="text-white/70">Data Scientist</CardDescription>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  "Networking yang luar biasa! Saya mendapat banyak insight dan peluang 
                  kolaborasi dari komunitas ini."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-500/20 text-teal-300 border-teal-500/30">
              Hubungi Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Mari Terhubung
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Punya pertanyaan atau ingin bergabung? Jangan ragu untuk menghubungi kami!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Alamat</p>
                      <p className="text-white/70">Pasaman, Sumatera Barat, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-white/70">info@itpasaman.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Telepon</p>
                      <p className="text-white/70">+62 812-3456-7890</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        name="name"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Pesan Anda"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600">
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">IT Pasaman</span>
              </div>
              <p className="text-white/70">
                Membangun ekosistem teknologi yang kuat di Pasaman untuk masa depan yang lebih cerah.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-white/70 hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#about" className="text-white/70 hover:text-white transition-colors">Tentang</a></li>
                <li><a href="#activities" className="text-white/70 hover:text-white transition-colors">Kegiatan</a></li>
                <li><a href="#contact" className="text-white/70 hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Program</h3>
              <ul className="space-y-2">
                <li><span className="text-white/70">Coding Bootcamp</span></li>
                <li><span className="text-white/70">Tech Talk</span></li>
                <li><span className="text-white/70">Hackathon</span></li>
                <li><span className="text-white/70">Workshop</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/70">
              2025 Komunitas IT Pasaman. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
