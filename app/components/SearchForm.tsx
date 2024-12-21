'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchForm({ onResultsUpdate }) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

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
        onResultsUpdate(data.data)
      } else {
        setError(data.error || 'An unknown error occurred')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An error occurred while fetching data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="search-query" className="sr-only">
            Search Query
          </label>
          <input
            id="search-query"
            name="query"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter your search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
          </span>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-red-600">
          {error}
        </div>
      )}
    </form>
  )
}

