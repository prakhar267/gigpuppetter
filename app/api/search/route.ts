import { NextResponse } from 'next/server'
import type { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
]

interface Freelancer {
  name: string
  skills: string[]
  hourlyRate: string
  country: string
  imageUrl: string
}

export async function POST(req: Request) {
  let browser: Browser | null = null
  
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    })

    const page: Page = await browser.newPage()
    
    // Rotate user agents
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
    await page.setUserAgent(userAgent)
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    })

    // Increase default timeout
    page.setDefaultNavigationTimeout(60000)
    page.setDefaultTimeout(60000)

    const searchUrl = `https://www.upwork.com/search/profiles/?q=${encodeURIComponent(query)}`
    
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    let freelancers: Freelancer[] = []
    let retries = 0
    const maxRetries = 3

    while (freelancers.length === 0 && retries < maxRetries) {
      await page.waitForSelector('.up-card-section', { timeout: 10000 }).catch(() => {})

      freelancers = await page.evaluate(() => {
        const results: Freelancer[] = []
        const cards = document.querySelectorAll('.up-card-section')

        cards.forEach((card) => {
          try {
            const name = card.querySelector('h4')?.textContent?.trim() || ''
            const skills = Array.from(card.querySelectorAll('.up-skill-badge')).map(skill => skill.textContent?.trim() || '')
            const hourlyRate = card.querySelector('.up-hourly-rate')?.textContent?.trim() || 'N/A'
            const country = card.querySelector('.freelancer-country')?.textContent?.trim() || 'Unknown'
            const imageUrl = card.querySelector('img')?.src || '/placeholder.svg'

            if (name) {
              results.push({ name, skills, hourlyRate, country, imageUrl })
            }
          } catch (e) {
            console.error('Error processing card:', e)
          }
        })

        return results
      })

      if (freelancers.length === 0) {
        await page.waitForTimeout(2000)
        retries++
      }
    }

    if (freelancers.length === 0) {
      console.warn('No results found after multiple attempts')
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No freelancers found or the page took too long to load. Please try again.'
      })
    }

    if (browser) {
      await browser.close()
    }

    return NextResponse.json({
      success: true,
      data: freelancers,
      message: `Found ${freelancers.length} freelancer(s)`
    })

  } catch (error) {
    console.error('Error:', error)
    
    if (browser) {
      await browser.close()
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred while fetching data. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

