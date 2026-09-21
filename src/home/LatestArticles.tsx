// LatestArticles.tsx — บทความล่าสุด 3 เรื่อง (registry เดียวกับหน้า /articles — ไม่ได้เพิ่มขนาด bundle เพราะ main.tsx import articles อยู่แล้ว)
import { Link } from 'react-router-dom'
import { articles } from '../content/articles'
import { Icon } from './Icon'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

export default function LatestArticles() {
  const latest = [...articles].sort((a, b) => b.meta.date.localeCompare(a.meta.date)).slice(0, 3)
  return (
    <section className="section articles-section" id="articles" aria-labelledby="articles-title">
      <div className="wrap">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow">ความรู้ก่อนซื้อขายที่ดิน</div>
            <h2 id="articles-title">บทความล่าสุด</h2>
          </div>
          <p>
            โฉนด ผังเมือง ราคาประเมิน ภาษี และขั้นตอนโอน — อธิบายแบบเจ้าของที่ดินใช้ได้จริง{' '}
            <Link className="link inline" to="/articles">ดูบทความทั้งหมด <Icon name="i-arrow" /></Link>
          </p>
        </div>
        <div className="article-cards">
          {latest.map(({ meta }) => (
            <Link key={meta.slug} to={`/articles/${meta.slug}`} className="article-card reveal">
              {meta.cover && <img src={meta.cover} alt="" width={1200} height={630} loading="lazy" decoding="async" />}
              <div className="article-card-body">
                <div className="article-card-meta">
                  {meta.tags?.[0] && <span>{meta.tags[0]}</span>}
                  <span className="latin">{fmtDate(meta.date)}{meta.readMin ? ` · อ่าน ${meta.readMin} นาที` : ''}</span>
                </div>
                <h3>{meta.title}</h3>
                <p>{meta.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
