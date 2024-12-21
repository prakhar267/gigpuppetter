import SearchInterface from './components/SearchInterface'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <SearchInterface />
      </div>
    </div>
  )
}

