#!/usr/bin/env node
// Auto-memory hook for Claude Code stop events
// Reads session context and persists notable decisions to memory

import { readFileSync } from 'fs';

const input = process.stdin.isTTY ? '' : readFileSync('/dev/stdin', 'utf8').trim();

if (input) {
  try {
    const data = JSON.parse(input);
    // Hook received stop event - log for debugging
    if (process.env.CLAUDE_HOOK_DEBUG) {
      console.error('[auto-memory-hook] stop event received:', JSON.stringify(data, null, 2));
    }
  } catch {
    // Non-JSON input, ignore
  }
}

process.exit(0);
