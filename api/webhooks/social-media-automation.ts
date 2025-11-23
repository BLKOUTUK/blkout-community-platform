/**
 * Social Media Automation Webhook (Vercel Serverless Function)
 * Receives BLKOUT content and posts to Late.dev
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// Import Late.dev client (will work after build copies src/lib)
const LATE_API_BASE_URL = 'https://getlate.dev/api/v1'
const LATE_API_KEY = process.env.LATE_API_KEY || ''

interface BLKOUTEvent {
  id: string
  title: string
  description: string
  date: string
  location: { address: string; city?: string }
  organizer: string
  registration_url?: string
  tags?: string[]
  image_url?: string
}

interface BLKOUTArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  url: string
  featured_image?: string
  tags?: string[]
  published_at: string
}

interface BLKOUTAnnouncement {
  id: string
  title: string
  message: string
  url?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

interface WebhookRequest {
  contentType: 'event' | 'article' | 'announcement'
  content: BLKOUTEvent | BLKOUTArticle | BLKOUTAnnouncement
  platforms: string[]
  accountIds?: Record<string, string>
  scheduledFor?: string
  timezone?: string
}

async function lateApiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${LATE_API_BASE_URL}${endpoint}`
  const headers = {
    'Authorization': `Bearer ${LATE_API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Late.dev API error: ${response.status} - ${JSON.stringify(error)}`)
  }
  return await response.json()
}

function formatEventPost(event: BLKOUTEvent): string {
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const formattedTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  let post = `🎉 ${event.title}\n\n`
  post += `${event.description}\n\n`
  post += `📅 ${formattedDate} at ${formattedTime}\n`
  post += `📍 ${event.location.address}\n`
  if (event.organizer) post += `👥 Organized by ${event.organizer}\n`
  if (event.registration_url) post += `\n🔗 Register: ${event.registration_url}\n`

  const hashtags = event.tags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''
  post += `\n#BLKOUT #CommunityEvent #BlackQueer ${hashtags}`
  return post
}

function formatArticlePost(article: BLKOUTArticle): string {
  let post = `📰 ${article.title}\n\n`
  post += `${article.excerpt}\n\n`
  post += `✍️ By ${article.author}\n`
  post += `\n🔗 Read more: ${article.url}\n`

  const hashtags = article.tags?.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''
  post += `\n#BLKOUT #News #Analysis ${hashtags}`
  return post
}

function formatAnnouncementPost(announcement: BLKOUTAnnouncement): string {
  const emojis = { low: 'ℹ️', medium: '📢', high: '⚡', urgent: '🚨' }
  const emoji = emojis[announcement.priority] || '📢'

  let post = `${emoji} ${announcement.title}\n\n`
  post += `${announcement.message}\n`
  if (announcement.url) post += `\n🔗 ${announcement.url}\n`
  post += `\n#BLKOUT #CommunityUpdate`
  return post
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET - return configuration
  if (req.method === 'GET') {
    try {
      const accounts = await lateApiRequest('/accounts')
      const usageStats = await lateApiRequest('/usage-stats')

      return res.status(200).json({
        status: 'active',
        service: 'Late.dev Social Media Automation',
        connectedAccounts: accounts.length,
        platforms: accounts.map((acc: any) => ({
          platform: acc.platform,
          username: acc.username,
          active: acc.isActive
        })),
        usage: usageStats,
        endpoints: {
          post: 'POST /api/webhooks/social-media-automation',
          config: 'GET /api/webhooks/social-media-automation'
        }
      })
    } catch (error: any) {
      return res.status(500).json({
        error: 'Failed to fetch configuration',
        message: error.message
      })
    }
  }

  // POST - schedule social media post
  if (req.method === 'POST') {
    try {
      const {
        contentType,
        content,
        platforms,
        accountIds,
        scheduledFor,
        timezone = 'Europe/London'
      } = req.body as WebhookRequest

      if (!contentType || !content || !platforms || platforms.length === 0) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['contentType', 'content', 'platforms']
        })
      }

      // Format content
      let postContent: string
      let mediaUrl: string | undefined

      switch (contentType) {
        case 'event':
          postContent = formatEventPost(content as BLKOUTEvent)
          mediaUrl = (content as BLKOUTEvent).image_url
          break
        case 'article':
          postContent = formatArticlePost(content as BLKOUTArticle)
          mediaUrl = (content as BLKOUTArticle).featured_image
          break
        case 'announcement':
          postContent = formatAnnouncementPost(content as BLKOUTAnnouncement)
          break
        default:
          return res.status(400).json({
            error: 'Invalid content type',
            allowed: ['event', 'article', 'announcement']
          })
      }

      // Get platform accounts
      const accounts = await lateApiRequest('/accounts')
      const platformAccounts = platforms.map(platform => {
        if (accountIds && accountIds[platform]) {
          return { platform, accountId: accountIds[platform] }
        }
        const account = accounts.find((acc: any) =>
          acc.platform.toLowerCase() === platform.toLowerCase() && acc.isActive
        )
        if (!account) {
          console.warn(`No active account found for platform: ${platform}`)
          return null
        }
        return { platform: account.platform, accountId: account.id }
      }).filter(Boolean)

      if (platformAccounts.length === 0) {
        return res.status(400).json({
          error: 'No valid platform accounts found',
          message: 'Please connect your social media accounts in Late.dev dashboard'
        })
      }

      // Create post
      const latePost = {
        content: postContent,
        platforms: platformAccounts,
        timezone,
        ...(scheduledFor ? { scheduledFor } : { publishNow: true }),
        ...(mediaUrl ? { media: [{ url: mediaUrl, type: 'image' as const }] } : {})
      }

      const result = await lateApiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(latePost)
      })

      return res.status(200).json({
        success: true,
        postId: result.id,
        status: result.status,
        platforms: result.platforms,
        scheduledFor: result.scheduledFor,
        content: postContent
      })

    } catch (error: any) {
      console.error('Social media automation error:', error)
      return res.status(500).json({
        error: 'Failed to create social media post',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
