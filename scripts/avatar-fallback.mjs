#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TIMEOUT_MS = Number(process.env.AVATAR_CHECK_TIMEOUT ?? 15_000)
const CONCURRENCY = 8
const UA = 'Mozilla/5.0 (compatible; blog-avatar-fallback)'

const args = process.argv.slice(2)
let dryRun = false
let fallbackOpt
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--fallback') fallbackOpt = args[++i]
  else if (args[i] === '--dry-run') dryRun = true
}
const fallback = fallbackOpt ?? process.env.AVATAR_FALLBACK ?? 'https://images.kusanali.top/avatar-fallback.png'

const file = resolve('public/links.json')
if (!existsSync(file)) {
  console.error(`找不到友链数据文件：${file}（请在仓库根目录运行）`)
  console.error('用法：node scripts/avatar-fallback.mjs [--fallback 本地路径或URL] [--dry-run]')
  process.exit(1)
}

function describeError(err) {
  const parts = [
    err?.cause?.message ?? err?.message,
    err?.cause?.code ?? err?.code,
    err?.cause?.constructor?.name,
  ].filter(Boolean)
  return parts.join(' ') || String(err)
}

async function checkImage(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'user-agent': UA } })
    await res.body?.cancel()
    if (res.redirected) return { ok: false, reason: `发生重定向 → ${res.url}`, retry: false }
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}`, retry: false }
    const type = res.headers.get('content-type') ?? ''
    if (type && !type.startsWith('image/')) {
      return { ok: false, reason: `Content-Type 非 image: ${type}`, retry: false }
    }
    return { ok: true }
  } catch (err) {
    const reason = err?.name === 'AbortError'
      ? `超时（>${TIMEOUT_MS / 1000}s）`
      : describeError(err)
    return { ok: false, reason, retry: true }
  } finally {
    clearTimeout(timer)
  }
}

async function checkLink(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'user-agent': UA } })
    await res.body?.cancel()
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}`, retry: false }
    return { ok: true }
  } catch (err) {
    const reason = err?.name === 'AbortError'
      ? `超时（>${TIMEOUT_MS / 1000}s）`
      : describeError(err)
    return { ok: false, reason, retry: true }
  } finally {
    clearTimeout(timer)
  }
}

async function withRetry(check, url) {
  const first = await check(url)
  if (first.ok || !first.retry) return first
  await new Promise(r => setTimeout(r, 800))
  return check(url)
}

async function validateFallback() {
  if (/^https?:\/\//i.test(fallback)) {
    const r = await withRetry(checkImage, fallback)
    if (!r.ok) {
      console.error(`✘ fallback 头像自身不可用（${r.reason}）：${fallback}`)
      console.error('  请更换 --fallback 后重试，否则构建仍会失败。')
      process.exit(1)
    }
    return
  }
  const local = fallback.startsWith('/')
    ? [resolve(fallback.replace(/^\//, '')), resolve('public', fallback.replace(/^\//, ''))]
    : [resolve(fallback)]
  const hit = local.find(p => existsSync(p))
  if (!hit) {
    console.error(`✘ 找不到 fallback 头像文件，尝试过：${local.join('、')}`)
    console.error(`  请将一张图片放到 public${fallback.startsWith('/') ? fallback : '/' + fallback}，或用 --fallback 指定其他路径。`)
    process.exit(1)
  }
}

const data = JSON.parse(readFileSync(file, 'utf8'))

const entries = []
function walk(node) {
  if (Array.isArray(node)) {
    node.forEach(walk)
    return
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if ((key === 'avatar' || key === 'link') && typeof value === 'string' && /^https?:\/\//i.test(value)) {
        entries.push({ owner: node, url: value, kind: key })
      } else {
        walk(value)
      }
    }
  }
}
walk(data)

const avatarCount = entries.filter(e => e.kind === 'avatar').length
const linkCount = entries.length - avatarCount

console.log(`头像/友链预处理：${file}`)
console.log(`检测 ${avatarCount} 个远程头像、${linkCount} 个友链链接（fallback: ${fallback}${dryRun ? '，dry-run' : ''}）`)

await validateFallback()

const queue = [...entries]
const broken = []
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, queue.length) || 1 }, async () => {
    while (queue.length) {
      const entry = queue.shift()
      const result = await withRetry(entry.kind === 'link' ? checkLink : checkImage, entry.url)
      if (!result.ok) {
        broken.push({ ...entry, reason: result.reason })
      }
    }
  })
)

const displayName = owner => {
  const group = [data, ...(data.friends ?? [])].find(g => g?.link_list?.includes(owner))
  const name = owner.name ?? owner.id_name ?? '(未命名)'
  return group?.id_name ? `[${group.id_name}] ${name}` : name
}

const brokenAvatars = broken.filter(b => b.kind === 'avatar')
const brokenLinks = broken.filter(b => b.kind === 'link')

for (const item of brokenAvatars) {
  console.log(`↳ 降级：${displayName(item.owner)}`)
  console.log(`    原头像: ${item.url}`)
  console.log(`    原因: ${item.reason} → 使用 ${fallback}`)
  item.owner.avatar = fallback
}

if (brokenLinks.length) {
  console.log(`↳ 以下 ${brokenLinks.length}/${linkCount} 个友链链接当前不可达（仅警告，不修改数据、不影响构建）：`)
  for (const item of brokenLinks) {
    console.log(`    ${displayName(item.owner)}: ${item.url}`)
    console.log(`      原因: ${item.reason}（若长期失效，请手动更新链接或移至 inactive-links）`)
  }
}

if (dryRun) {
  console.log(`dry-run 结束：${brokenAvatars.length}/${avatarCount} 个头像将会被替换，未写回文件。`)
  process.exit(0)
}

if (!brokenAvatars.length) {
  console.log(`✔ 全部 ${avatarCount} 个远程头像健康，links.json 未做任何改动。`)
  process.exit(0)
}

writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
if (process.env.CI !== 'true') {
  console.log('已就地更新 links.json（git diff 可查看，git checkout -- <文件> 可恢复）。')
}
console.log(`⚠ 本次构建有 ${brokenAvatars.length}/${avatarCount} 个友链头像降级为 fallback，请尽快按上方原因修复原始链接。`)
