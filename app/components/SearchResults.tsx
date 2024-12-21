import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, DollarSign } from 'lucide-react'

interface Freelancer {
  name: string
  skills: string[]
  hourlyRate: string
  country: string
  imageUrl: string
}

interface SearchResultsProps {
  results: Freelancer[]
  isLoading: boolean
}

export default function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-none bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-6 w-20" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {results.map((freelancer, index) => (
        <Card key={index} className="border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-white/10">
                <Image
                  src={freelancer.imageUrl || '/placeholder.svg'}
                  alt={freelancer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">{freelancer.name}</h3>
                  <div className="flex items-center text-green-400">
                    <DollarSign className="h-4 w-4" />
                    <span>{freelancer.hourlyRate}/hr</span>
                  </div>
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{freelancer.country}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

