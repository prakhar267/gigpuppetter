import Image from 'next/image'

interface Freelancer {
  name: string
  skills: string[]
  hourlyRate: string
  country: string
  imageUrl: string
}

interface ResultsDisplayProps {
  results: Freelancer[]
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {results.length === 0 ? (
        <p>No results to display. Try searching for freelancers.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((freelancer, index) => (
            <li key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <div className="flex-shrink-0 h-12 w-12 relative">
                  <Image
                    className="h-12 w-12 rounded-full"
                    src={freelancer.imageUrl}
                    alt={freelancer.name}
                    width={48}
                    height={48}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{freelancer.name}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{freelancer.country}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm font-medium text-gray-900">{freelancer.hourlyRate}/hr</p>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Skills: </span>
                  {freelancer.skills.join(', ')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

