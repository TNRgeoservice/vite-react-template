import { motion, useScroll, useTransform } from 'framer-motion'
import { Map, MapPin, Layers, ArrowRight, ChevronDown, Search, Tag, Users, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroSearch from './components/HeroSearch'
import QuickFilterChips from './components/QuickFilterChips'
import FeaturedPlots from './components/FeaturedPlots'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
}

function App() {
  const { scrollYProgress } = useScroll()
  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['rgba(13, 21, 32, 0)', 'rgba(13, 21, 32, 0.95)']
  )

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      {/* Header */}
      <motion.header
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[var(--brd)]/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-9 h-9 rounded-lg bg-[var(--acc)]/10 flex items-center justify-center"
              >
                <Map className="w-5 h-5 text-[var(--acc)]" />
              </motion.div>
              <span className="text-lg font-semibold tracking-tight">TNR MapHub</span>
            </motion.div>

            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center gap-8"
            >
              <Link to="/articles" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                บทความ
              </Link>
              <a href="#features" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                ฟีเจอร์
              </a>
              <a href="#sellers" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                ลงประกาศฟรี
              </a>
              <a href="#about" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                เกี่ยวกับ
              </a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com/?login=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--brd)] text-[var(--tx)] rounded-lg text-sm font-semibold hover:bg-[var(--bg2)] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                เข้าสู่ระบบ
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold hover:bg-[var(--acc2)] transition-colors"
              >
                เปิดแผนที่
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.nav>

            {/* Mobile actions */}
            <div className="md:hidden flex items-center gap-2">
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com/?login=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="เข้าสู่ระบบ"
                className="inline-flex items-center justify-center w-9 h-9 border border-[var(--brd)] text-[var(--tx)] rounded-lg"
              >
                <LogIn className="w-4 h-4" />
              </motion.a>
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold"
              >
                เปิดแผนที่
              </motion.a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <motion.div
            animate={{
              backgroundPosition: ['0px 0px', '60px 60px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(var(--tx) 1px, transparent 1px),
                linear-gradient(90deg, var(--tx) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating Orbs (decoration) */}
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[var(--acc)]/10 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--land)]/10 blur-3xl pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--brd)] mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Layers className="w-4 h-4 text-[var(--acc)]" />
              </motion.div>
              <span className="text-sm text-[var(--tx2)]">โดย TNR Geoservice — ผู้เชี่ยวชาญด้าน GIS</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              ศูนย์รวม{' '}
              <motion.span
                className="text-[var(--land)] inline-block"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(92, 184, 255, 0)',
                    '0 0 20px rgba(92, 184, 255, 0.5)',
                    '0 0 20px rgba(92, 184, 255, 0)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ฝากขายที่ดิน
              </motion.span>
              <br />ลงประกาศฟรี ค้นหาด้วยแผนที่ GIS
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-[var(--tx2)] mb-8 max-w-2xl leading-relaxed"
            >
              แพลตฟอร์มซื้อขายที่ดินออนไลน์ ลงประกาศขายที่ดินฟรี เจ้าของขายเอง
              ค้นหาที่ดินทำเลดีผ่านระบบแผนที่ — ดูพิกัด ผังเมือง โฉนด และเปรียบเทียบราคาได้ในที่เดียว
            </motion.p>

            {/* Search box → ส่งไป map.tnrmaphub.com */}
            <motion.div variants={fadeInUp} className="mb-4">
              <HeroSearch />
            </motion.div>

            {/* Quick filter chips */}
            <motion.div variants={fadeInUp} className="mb-8">
              <QuickFilterChips />
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 230, 118, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all"
              >
                <Search className="w-5 h-5" />
                ค้นหาที่ดินจากแผนที่
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02, backgroundColor: 'var(--bg2)' }}
                whileTap={{ scale: 0.98 }}
                href="#sellers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--brd)] text-[var(--tx)] rounded-xl text-base font-medium transition-colors"
              >
                <Tag className="w-5 h-5" />
                ลงประกาศฟรี
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-[var(--brd)]"
            >
              {[
                { icon: Map, label: 'แผนที่ GIS แม่นยำ', value: 'GIS', color: 'var(--land)' },
                { icon: Tag, label: 'ลงประกาศ', value: 'ฟรี', color: 'var(--acc)' },
                { icon: Users, label: 'เจ้าของขายเอง', value: 'ไม่มีนายหน้า', color: 'var(--poly)' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-default"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-[var(--tx2)]">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[var(--tx2)]"
          >
            <span className="text-xs">เลื่อนลง</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              ทำไมต้อง TNR MapHub
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] max-w-2xl mx-auto">
              ครบทุกเครื่องมือในการซื้อขายที่ดิน — ตั้งแต่ค้นหา วิเคราะห์ทำเล จนถึงปิดดีล
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Map,
                title: 'ค้นหาที่ดินจากแผนที่',
                color: 'var(--land)',
                description: 'ดูที่ดินขายทั่วไทยบนแผนที่ GIS แม่นยำ — เห็นพิกัดจริง รูปแปลง ขนาด ติดถนนเส้นไหน',
                features: ['ดูพิกัด GPS ทุกแปลง', 'ซ้อนชั้นผังเมือง/พื้นที่ป่า', 'กรองตามจังหวัด/ราคา/ขนาด'],
              },
              {
                icon: Tag,
                title: 'ลงประกาศขายฟรี',
                color: 'var(--acc)',
                description: 'เจ้าของที่ดินลงประกาศได้ฟรี ไม่มีค่าธรรมเนียม ไม่ผ่านนายหน้า — ติดต่อผู้ซื้อโดยตรง',
                features: ['ลงประกาศฟรีไม่จำกัด', 'แชทคุยกับผู้ซื้อโดยตรง', 'แชร์ FB/LINE เพิ่ม reach'],
              },
              {
                icon: Layers,
                title: 'ข้อมูลเชิงลึก ตัดสินใจแม่นยำ',
                color: 'var(--poly)',
                description: 'มากกว่าเว็บประกาศทั่วไป — ดูโฉนด ผังเมือง ราคาเปรียบเทียบรอบพื้นที่ ก่อนตัดสินใจซื้อขาย',
                features: ['เปรียบเทียบราคา/ตร.วา', 'ข้อมูลโฉนด เอกสารสิทธิ์', 'แลนด์มาร์ก สิ่งใกล้เคียง'],
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ 
                  y: -10, 
                  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
                  borderColor: card.color + '50'
                }}
                className="group p-6 bg-[var(--bg)] rounded-2xl border border-[var(--brd)] transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: card.color + '15' }}
                >
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-[var(--tx2)] text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                <ul className="space-y-2">
                  {card.features.map((feature, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: j * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 text-sm text-[var(--tx2)]"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: card.color }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Plots Section — ที่ดินแนะนำ (Static JSON) */}
      <FeaturedPlots />

      {/* Sellers Section — ลงประกาศฟรี (กิน keyword group: ฝากขายที่ดิน, ลงประกาศขายที่ดินฟรี) */}
      <section id="sellers" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--acc)]/10 border border-[var(--acc)]/30 mb-4">
                <Tag className="w-4 h-4 text-[var(--acc)]" />
                <span className="text-sm text-[var(--acc)]">สำหรับเจ้าของที่ดิน</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ฝากขายที่ดินกับเรา <span className="text-[var(--acc)]">ฟรี ไม่มีนายหน้า</span>
              </h2>
              <p className="text-[var(--tx2)] text-lg leading-relaxed mb-6">
                ลงประกาศขายที่ดินได้ไม่จำกัด ไม่มีค่าธรรมเนียม คุยกับผู้ซื้อโดยตรงผ่านระบบแชท
                — เหมาะสำหรับเจ้าของที่ดินที่อยากขายเองโดยไม่ผ่านนายหน้า
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'ลงประกาศขายที่ดินฟรี ไม่จำกัดจำนวนแปลง',
                  'ติดต่อผู้ซื้อโดยตรง ไม่ผ่านนายหน้า',
                  'แชร์ Facebook / LINE ขยายการเข้าถึง',
                  'แสดงบนแผนที่ — ผู้ซื้อหาเจอง่ายกว่า',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--tx)]">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all"
              >
                <Tag className="w-5 h-5" />
                เริ่มลงประกาศฟรี
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-square rounded-2xl bg-[var(--bg2)] border border-[var(--brd)] p-8 flex flex-col justify-center items-center text-center">
                <div className="text-6xl font-black text-[var(--acc)] mb-2">ฟรี</div>
                <div className="text-xl text-[var(--tx)] font-semibold mb-1">ลงประกาศขายที่ดิน</div>
                <div className="text-sm text-[var(--tx2)]">ไม่จำกัดจำนวน · ไม่มีค่าธรรมเนียม</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-6">
              เกี่ยวกับ TNR Geoservice
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--tx2)] text-lg leading-relaxed mb-8">
              เราคือผู้เชี่ยวชาญด้านการวางผังที่ดินดิจิทัลและการวิเคราะห์ข้อมูลเชิงพื้นที่ (GIS)
              พัฒนาแพลตฟอร์ม TNR MapHub เพื่อให้การซื้อขายที่ดินในไทยโปร่งใส แม่นยำ และเข้าถึงง่ายกว่าที่เคย
            </motion.p>
            <motion.p variants={fadeIn} className="text-sm text-[var(--txd)] italic">
              หมายเหตุ: บริการของเราเน้นการออกแบบผังและวิเคราะห์ข้อมูลเชิงพื้นที่ ไม่รวมการรังวัดที่ดินภาคสนาม
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)] overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative"
        >
          {/* Background decoration */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full border border-[var(--acc)]/20"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border border-[var(--land)]/20"
          />

          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold mb-4">
            พร้อมเริ่มต้นซื้อขายที่ดินแล้วหรือยัง?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[var(--tx2)] mb-8">
            เปิดแผนที่ค้นหาที่ดินทำเลดี หรือลงประกาศขายของคุณเองได้ฟรีในไม่กี่คลิก
          </motion.p>
          <motion.a
            variants={scaleIn}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 40px rgba(0, 230, 118, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            href="https://map.tnrmaphub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-lg font-semibold hover:bg-[var(--acc2)] transition-all"
          >
            <MapPin className="w-5 h-5" />
            เปิดแผนที่ TNR MapHub
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--brd)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <Map className="w-5 h-5 text-[var(--acc)]" />
            <span className="font-semibold">TNR MapHub</span>
            <span className="text-xs text-[var(--tx2)] hidden sm:inline">— ฝากขายที่ดิน ลงประกาศฟรี</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-sm text-[var(--tx2)]"
          >
            <a
              href="https://www.facebook.com/TNRGEOSERVICE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--acc)] transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://map.tnrmaphub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--acc)] transition-colors"
            >
              เปิดแผนที่
            </a>
            <span>© {new Date().getFullYear()} TNR Geoservice</span>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

export default App
