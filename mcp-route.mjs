// ◊·κ MCP ROUTING · ported from teslasolar/MissCassandra/js/mcp.js
// MIT · Thomas Frumkin · cross-pollinated 2026-05-27 with attribution
//
// Bloom vector × keyword pattern → auto-select MCP servers for a query.
// Each rule fires when (a) the bloom ring is above threshold AND
// (b) the text matches the keyword pattern. Returns the union of matched servers.

export const MCP_SERVERS_INFO = [
  { name: 'linear-mcp',     icon: '◇',  ring: 'R4', desc: 'Issue / ticket / task' },
  { name: 'gmail-mcp',      icon: '✉',  ring: 'R3', desc: 'Email / inbox' },
  { name: 'gcal-mcp',       icon: '⊕',  ring: 'R4', desc: 'Calendar / meeting' },
  { name: 'atlassian-mcp',  icon: '◈',  ring: 'R2', desc: 'Jira / Confluence' },
  { name: 'cloudflare-mcp', icon: '☁',  ring: 'R0', desc: 'Deploy / Workers / Pages' },
  { name: 'intercom-mcp',   icon: '◐',  ring: 'R3', desc: 'Customer / support' },
  // ◊·κ estate-native additions
  { name: 'fallcore-mcp',   icon: '◊',  ring: 'R0', desc: 'FallCore on-prem proxy' },
  { name: 'onlybrains-mcp', icon: '◈',  ring: 'R4', desc: 'OnlyBrains reasoning' }
];

const RULES = [
  { bloomIdx: 4, threshold: 0.3, pattern: /linear|issue|ticket|task|bug|feature/i,
    server: { type: 'url', url: 'https://mcp.linear.app/sse', name: 'linear-mcp' } },
  { bloomIdx: 3, threshold: 0.3, pattern: /email|mail|send|inbox/i,
    server: { type: 'url', url: 'https://gmail.mcp.claude.com/mcp', name: 'gmail-mcp' } },
  { bloomIdx: 4, threshold: 0.3, pattern: /calendar|schedule|meeting|event/i,
    server: { type: 'url', url: 'https://gcal.mcp.claude.com/mcp', name: 'gcal-mcp' } },
  { bloomIdx: 2, threshold: 0.3, pattern: /jira|confluence|atlassian/i,
    server: { type: 'url', url: 'https://mcp.atlassian.com/v1/sse', name: 'atlassian-mcp' } },
  { bloomIdx: 0, threshold: 0.3, pattern: /deploy|cloudflare|worker|pages/i,
    server: { type: 'url', url: 'https://github.com/cloudflare/mcp-server-cloudflare', name: 'cloudflare-mcp' } },
  { bloomIdx: 3, threshold: 0.3, pattern: /intercom|customer|support/i,
    server: { type: 'url', url: 'https://mcp.intercom.com/sse', name: 'intercom-mcp' } },
  // ◊·κ estate routes
  { bloomIdx: 0, threshold: 0.3, pattern: /fallcore|proxy|on.?prem|sovereign/i,
    server: { type: 'local', url: 'http://localhost:5510', name: 'fallcore-mcp' } },
  { bloomIdx: 4, threshold: 0.3, pattern: /reason|think|chain|prove|onlybrains/i,
    server: { type: 'url', url: 'https://onlybrains.onrender.com/mcp', name: 'onlybrains-mcp' } }
];

/**
 * Pick MCP servers for a query.
 * @param {number[]} bloom — normalized bloom vector (7 ring values 0..1)
 * @param {string} text
 * @returns {{ type:string, url:string, name:string }[]}
 */
export function pickMCP(bloom, text) {
  const servers = [];
  const seen = new Set();
  if (!bloom || !text) return servers;
  for (const rule of RULES) {
    if (bloom[rule.bloomIdx] > rule.threshold && rule.pattern.test(text)) {
      if (!seen.has(rule.server.name)) {
        servers.push(rule.server);
        seen.add(rule.server.name);
      }
    }
  }
  return servers;
}

/** Diagnostic — explain which rules fired and which didn't. */
export function explain(bloom, text) {
  const out = [];
  for (const rule of RULES) {
    const ringOk = bloom[rule.bloomIdx] > rule.threshold;
    const patOk  = rule.pattern.test(text);
    out.push({
      server: rule.server.name,
      ringTrigger: 'R' + rule.bloomIdx,
      ringValue: bloom[rule.bloomIdx],
      ringOk, patOk,
      selected: ringOk && patOk
    });
  }
  return out;
}
