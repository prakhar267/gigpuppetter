'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import SearchResults from './SearchResults'
import Logo from './Logo'

export default function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.data)
        if (data.data.length === 0) {
          setError(data.message || 'No freelancers found. Try different search terms.')
        }
      } else {
        setError(data.error || 'Failed to fetch results')
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border-none bg-white/5 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo className="w-16 h-16 text-purple-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Freelancer Search
            </CardTitle>
            <CardDescription className="text-slate-400">
              Search for skilled freelancers and view their profiles
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for developers, designers, etc..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <SearchResults results={results} isLoading={isLoading} />
    </div>
  )
}

