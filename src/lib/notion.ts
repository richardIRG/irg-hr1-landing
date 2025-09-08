import { Client } from '@notionhq/client'
import { env } from './env'

export type LeadData = {
  firstName: string
  lastName: string
  email: string
  organization: string
  role?: string
  challenge?: string
  consent: boolean
  source?: string
  utm?: Partial<Record<'source' | 'medium' | 'campaign' | 'term' | 'content', string>>
  referrer?: string
  path?: string
  submittedAt?: string
}

export async function saveLeadToNotion(data: LeadData) {
  if (!env.NOTION_TOKEN || !env.NOTION_DATABASE_ID) {
    return { saved: false, reason: 'notion_not_configured' as const }
  }

  const notion = new Client({ auth: env.NOTION_TOKEN })

  const properties: any = {
    Name: { title: [{ text: { content: `${data.firstName} ${data.lastName}`.trim() } }] },
    Email: { email: data.email },
    Organization: { rich_text: [{ text: { content: data.organization } }] },
    'First Name': { rich_text: [{ text: { content: data.firstName } }] },
    'Last Name': { rich_text: [{ text: { content: data.lastName } }] },
    Consent: { checkbox: !!data.consent },
    Role: data.role ? { rich_text: [{ text: { content: data.role } }] } : undefined,
    // Map challenge to Challenge column in Notion
    Challenge: data.challenge ? { select: { name: data.challenge } } : undefined,
    Source: data.source ? { select: { name: data.source } } : undefined,
    'UTM Source': data.utm?.source ? { rich_text: [{ text: { content: data.utm.source } }] } : undefined,
    'UTM Medium': data.utm?.medium ? { rich_text: [{ text: { content: data.utm.medium } }] } : undefined,
    'UTM Campaign': data.utm?.campaign ? { rich_text: [{ text: { content: data.utm.campaign } }] } : undefined,
    'UTM Term': data.utm?.term ? { rich_text: [{ text: { content: data.utm.term } }] } : undefined,
    'UTM Content': data.utm?.content ? { rich_text: [{ text: { content: data.utm.content } }] } : undefined,
    Referrer: data.referrer ? { url: data.referrer } : undefined,
    Path: data.path ? { rich_text: [{ text: { content: data.path } }] } : undefined,
    'Submitted At': data.submittedAt ? { date: { start: data.submittedAt } } : undefined,
    Status: { select: { name: 'Submitted' } }
  }

  // Remove undefined properties to avoid Notion API errors
  Object.keys(properties).forEach((k) => properties[k] === undefined && delete properties[k])

  await notion.pages.create({
    parent: { database_id: env.NOTION_DATABASE_ID },
    properties,
  })

  return { saved: true as const }
}

