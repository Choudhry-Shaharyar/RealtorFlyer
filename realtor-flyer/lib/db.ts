import { PrismaClient } from "@prisma/client"

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

// Lazy initialization - only create PrismaClient when actually needed
function getPrismaClient(): PrismaClient {
    if (!globalThis.prisma) {
        globalThis.prisma = new PrismaClient()
    }
    return globalThis.prisma
}

// Export a proxy that lazily initializes Prisma
export const prisma = new Proxy({} as PrismaClient, {
    get(_, prop) {
        const client = getPrismaClient()
        return (client as unknown as Record<string | symbol, unknown>)[prop]
    }
})
