import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agentflyers.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/projects/', '/profile/', '/billing/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
