/** Bulk LOLC + vendor tool surface (target 500+ total with core catalog) */

const LOLC_SERVICES = [
  'auth', 'tenant', 'bank_adapter', 'onboarding', 'admin', 'account', 'payment',
  'notification', 'support', 'web_bff', 'shared', 'kong', 'mysql', 'redis', 'kafka', 'helm',
];

const SERVICE_OPS = [
  'health', 'migrate', 'seed', 'openapi', 'dto_fix', 'controller', 'service_layer', 'module_wire',
  'e2e_hint', 'contract_test', 'trace_span', 'log_audit', 'metric_check', 'deploy_hint', 'rollback_hint',
];

const DOMAINS = [
  'lolc', 'fusionx', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'mvp', 'registration',
  'payments_ui', 'accounts_ui', 'admin_ui', 'security', 'bff', 'nest', 'nextjs', 'docker', 'ci',
  'traceability', 'stitch', 'figma', 'antigravity', 'cursor', 'copilot', 'meeting', 'demo',
  'stakeholder', 'cbs', 'limits', 'siem',
];

const DOMAIN_VERBS = [
  'plan', 'audit', 'scan', 'fix', 'test', 'review', 'map', 'index', 'search', 'sync',
  'validate', 'export', 'import', 'deploy', 'document',
];

const GRAPHIFY_ACTIONS = [
  'index_repo', 'query_graph', 'export_callflow', 'export_html', 'schema_map', 'cross_ref',
  'watch_changes', 'validate_graph', 'report', 'ingest_code', 'ingest_sql', 'ingest_docs',
  'cluster_view', 'dedup_nodes', 'serve_ui',
];

const CLAUDE_MEM_ACTIONS = [
  'search', 'store', 'timeline', 'learn_codebase', 'make_plan', 'do_task', 'babysit_pr',
  'smart_explore', 'knowledge_agent', 'pathfinder', 'mem_search', 'how_it_works',
];

const SUPERPOWERS_ACTIONS = [
  'brainstorm', 'write_plan', 'execute_plan', 'tdd', 'debug', 'dispatch_parallel',
  'request_review', 'receive_review', 'finish_branch', 'git_worktree', 'verify_complete',
  'subagent_dev', 'using_superpowers', 'writing_skills',
];

const HYPERSPACE_PROVIDERS = [
  'openrouter', 'groq', 'together', 'fireworks', 'deepinfra', 'xai', 'google', 'mistral',
  'cohere', 'anthropic', 'openai', 'vercel',
];

const HYPERSPACE_PROVIDER_OPS = ['add_byok', 'list', 'route', 'budget', 'funded_call'];

const HYPERSPACE_LAYERS = ['identity', 'p2p_gpu', 'byok_billing', 'go_pool'];

const HYPERSPACE_LAYER_OPS = [
  'enable', 'disable', 'status', 'configure', 'audit', 'docs',
];

const HYPERSPACE_MESH = [
  'libp2p', 'raft', 'ed25519', 'pipeline_shard', 'mlx', 'llama_cpp_cuda', 'nat_traversal',
  'capability_gossip', 'ring_activate', 'token_stream',
];

function tierForBulk(cat) {
  if (cat.startsWith('bulk_') || cat.startsWith('svc_')) return 'standard';
  if (['graphify', 'claude_mem'].includes(cat)) return 'standard';
  return 'standard';
}

function mkTool(category, action, desc) {
  return {
    name: `thejad_${category}_${action}`,
    tier: tierForBulk(category),
    category,
    action,
    description: desc || `ThejaD ${category}: ${action.replace(/_/g, ' ')} (LOLC Internet Banking).`,
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' },
        storyId: { type: 'string' },
        route: { type: 'string' },
        path: { type: 'string' },
      },
    },
  };
}

export function buildBulkTools() {
  const out = [];

  for (const svc of LOLC_SERVICES) {
    for (const op of SERVICE_OPS) {
      out.push(mkTool(`svc_${svc}`, op, `LOLC ${svc} service — ${op}`));
    }
  }

  for (const domain of DOMAINS) {
    for (const verb of DOMAIN_VERBS) {
      out.push(mkTool(`bulk_${domain}`, verb, `LOLC domain ${domain} — ${verb}`));
    }
  }

  for (const action of GRAPHIFY_ACTIONS) {
    out.push(mkTool('graphify', action, `Graphify knowledge graph — ${action}`));
  }
  for (const action of CLAUDE_MEM_ACTIONS) {
    out.push(mkTool('claude_mem', action, `Claude-mem — ${action}`));
  }
  for (const action of SUPERPOWERS_ACTIONS) {
    out.push(mkTool('superpowers', action, `Superpowers workflow — ${action}`));
  }

  for (const provider of HYPERSPACE_PROVIDERS) {
    for (const op of HYPERSPACE_PROVIDER_OPS) {
      out.push(mkTool('hyperspace_provider', `${provider}_${op}`, `Hyperspace provider ${provider} — ${op}`));
    }
  }

  for (const layer of HYPERSPACE_LAYERS) {
    for (const op of HYPERSPACE_LAYER_OPS) {
      out.push(mkTool('hyperspace_layer', `${layer}_${op}`, `Hyperspace pod layer ${layer} — ${op}`));
    }
  }

  for (const tech of HYPERSPACE_MESH) {
    for (const op of DOMAIN_VERBS) {
      out.push(mkTool('hyperspace_mesh', `${tech}_${op}`, `Hyperspace mesh ${tech} — ${op}`));
    }
  }

  return out;
}

export function bulkToolCount() {
  return buildBulkTools().length;
}
