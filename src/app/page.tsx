import { Map, Globe, Grid3X3, Box, MapPin, Layers, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--tx)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--brd)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-[var(--acc)]/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-[var(--acc)]" />
              </div>
              <span className="text-lg font-semibold tracking-tight">TNR MapHub</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                Services
              </a>
              <a href="#about" className="text-sm text-[var(--tx2)] hover:text-[var(--tx)] transition-colors">
                About
              </a>
              <a
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold hover:bg-[var(--acc2)] transition-colors"
              >
                เปิดแผนที่
                <ArrowRight className="w-4 h-4" />
              </a>
            </nav>
            <a
              href="https://map.tnrmaphub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--acc)] text-[var(--bg)] rounded-lg text-sm font-semibold"
            >
              เปิดแผนที่
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
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

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg2)] border border-[var(--brd)] mb-6">
              <Layers className="w-4 h-4 text-[var(--acc)]" />
              <span className="text-sm text-[var(--tx2)]">Powered by TNR Geoservice</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              Smart{' '}
              <span className="text-[var(--land)]">Land Valuation</span>
              {' '}& Spatial Analysis
            </h1>
            
            <p className="text-lg sm:text-xl text-[var(--tx2)] mb-8 max-w-2xl leading-relaxed">
              Professional GIS analysis, land subdivision planning, and 3D architectural rendering. 
              We transform spatial data into actionable insights for informed decision-making.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://map.tnrmaphub.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-base font-semibold hover:bg-[var(--acc2)] transition-all hover:scale-[1.02]"
              >
                <MapPin className="w-5 h-5" />
                เปิดแผนที่
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--brd)] text-[var(--tx)] rounded-xl text-base font-medium hover:bg-[var(--bg2)] transition-colors"
              >
                Explore Services
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-[var(--brd)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-[var(--land)]" />
                  <span className="text-2xl font-bold">GIS</span>
                </div>
                <p className="text-sm text-[var(--tx2)]">Spatial Analysis</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Grid3X3 className="w-4 h-4 text-[var(--acc)]" />
                  <span className="text-2xl font-bold">Digital</span>
                </div>
                <p className="text-sm text-[var(--tx2)]">Workflow</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Box className="w-4 h-4 text-[var(--poly)]" />
                  <span className="text-2xl font-bold">3D</span>
                </div>
                <p className="text-sm text-[var(--tx2)]">Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-[var(--tx2)] max-w-2xl mx-auto">
              Comprehensive spatial solutions from data analysis to visualization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* GIS Analysis Card */}
            <div className="group p-6 bg-[var(--bg)] rounded-2xl border border-[var(--brd)] hover:border-[var(--land)]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[var(--land)]/10 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-[var(--land)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">GIS Analysis</h3>
              <p className="text-[var(--tx2)] text-sm leading-relaxed mb-4">
                Geographic Information Systems analysis for land assessment, terrain mapping, and spatial data processing.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--land)]" />
                  Topographic analysis
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--land)]" />
                  Land use mapping
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--land)]" />
                  Spatial data integration
                </li>
              </ul>
            </div>

            {/* Land Subdivision Card */}
            <div className="group p-6 bg-[var(--bg)] rounded-2xl border border-[var(--brd)] hover:border-[var(--acc)]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[var(--acc)]/10 flex items-center justify-center mb-5">
                <Grid3X3 className="w-6 h-6 text-[var(--acc)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Land Subdivision</h3>
              <p className="text-[var(--tx2)] text-sm leading-relaxed mb-4">
                Professional layout design and subdivision planning for residential and commercial development projects.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
                  Plot layout optimization
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
                  Road network planning
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--acc)]" />
                  Utility corridor design
                </li>
              </ul>
            </div>

            {/* 3D Rendering Card */}
            <div className="group p-6 bg-[var(--bg)] rounded-2xl border border-[var(--brd)] hover:border-[var(--poly)]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[var(--poly)]/10 flex items-center justify-center mb-5">
                <Box className="w-6 h-6 text-[var(--poly)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3D Rendering</h3>
              <p className="text-[var(--tx2)] text-sm leading-relaxed mb-4">
                High-quality 3D architectural visualization and terrain modeling for project presentations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--poly)]" />
                  Architectural visualization
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--poly)]" />
                  Terrain modeling
                </li>
                <li className="flex items-center gap-2 text-sm text-[var(--tx2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--poly)]" />
                  Project fly-throughs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">About TNR Geoservice</h2>
            <p className="text-[var(--tx2)] text-lg leading-relaxed mb-8">
              We specialize in digital land planning and spatial analysis services. Our expertise lies in 
              layout design, GIS data processing, and 3D visualization — helping clients make informed 
              decisions through precise spatial data analysis.
            </p>
            <p className="text-sm text-[var(--txd)] italic">
              Note: We provide layout design and data analysis services only. On-site land surveying is not included in our services.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-[var(--tx2)] mb-8">
            Open our interactive map to browse available land listings and explore spatial data.
          </p>
          <a
            href="https://map.tnrmaphub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--acc)] text-[var(--bg)] rounded-xl text-lg font-semibold hover:bg-[var(--acc2)] transition-all hover:scale-[1.02]"
          >
            <MapPin className="w-5 h-5" />
            เปิดแผนที่
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--brd)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[var(--acc)]" />
            <span className="font-semibold">TNR MapHub</span>
          </div>
          <p className="text-sm text-[var(--tx2)]">
            © {new Date().getFullYear()} TNR MapHub by TNR Geoservice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
