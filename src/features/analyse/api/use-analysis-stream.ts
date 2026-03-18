import { useCallback, useRef, useState } from 'react';
import { fetchApi, isMockMode } from '@/lib/fetch-api';
import { getMockReport } from '@/features/analyse/api/use-report';
import type { AnalysisRequest, ComponentAnalysis, IpcRuleResult, UpgradeComponent, BOXReport } from '@/types/analysis';

export type SSEPhase = 0 | 1 | 2 | 3 | 4 | 5;

export interface AgentLog {
  ref: string;
  agent: string;
  message: string;
  timestamp: number;
}

export interface AnalysisStreamState {
  phase: SSEPhase;
  product: string;
  totalComponents: number;
  completedCount: number;
  components: ComponentAnalysis[];
  agentLogs: AgentLog[];
  ipcRules: IpcRuleResult[];
  ipcTotal: number;
  ipcResult: BOXReport['ipc'] | null;
  upgradeComponents: UpgradeComponent[];
  upgradeResult: BOXReport['upgrade'] | null;
  healthScore: number | null;
  report: BOXReport | null;
  error: string | null;
  isRunning: boolean;
}

const initialState: AnalysisStreamState = {
  phase: 0,
  product: '',
  totalComponents: 0,
  completedCount: 0,
  components: [],
  agentLogs: [],
  ipcRules: [],
  ipcTotal: 0,
  ipcResult: null,
  upgradeComponents: [],
  upgradeResult: null,
  healthScore: null,
  report: null,
  error: null,
  isRunning: false,
};

export const useAnalysisStream = () => {
  const [state, setState] = useState<AnalysisStreamState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const addLog = useCallback((ref: string, agent: string, message: string) => {
    setState(prev => ({
      ...prev,
      agentLogs: [...prev.agentLogs, { ref, agent, message, timestamp: Date.now() }],
    }));
  }, []);

  const startMockStream = useCallback(() => {
    const report = getMockReport();
    setState(prev => ({
      ...prev,
      isRunning: true,
      product: report.product,
      totalComponents: report.components.length,
      phase: 1,
    }));

    const timers: ReturnType<typeof setTimeout>[] = [];
    let delay = 300;

    // Phase 1: Components
    report.components.forEach((comp, i) => {
      timers.push(setTimeout(() => {
        setState(prev => ({
          ...prev,
          components: [...prev.components, {
            ...comp, status: 'searching' as const,
            stock_available: 0, unit_price_usd: 0, lead_time_weeks: 0,
            issues: [], alternatives: [], recommendation: '', sources: [],
          }],
        }));
        addLog(comp.ref, 'sourcing', `Searching distributors for ${comp.mpn}...`);
      }, delay + i * 400));

      timers.push(setTimeout(() => {
        addLog(comp.ref, 'sourcing', `Found ${comp.stock_available} units at $${comp.unit_price_usd}. Lead time: ${comp.lead_time_weeks} weeks.`);
        if (comp.status === 'red') {
          addLog(comp.ref, 'sourcing', `Insufficient stock. Searching for alternatives...`);
        }
      }, delay + i * 400 + 200));

      timers.push(setTimeout(() => {
        setState(prev => ({
          ...prev,
          components: prev.components.map(c => c.ref === comp.ref ? comp : c),
          completedCount: prev.completedCount + 1,
        }));
        if (comp.alternatives.length > 0) {
          addLog(comp.ref, 'sourcing', `Found alternative: ${comp.alternatives[0].mpn} — ${comp.alternatives[0].stock_available} in stock`);
        }
      }, delay + i * 400 + 350));
    });

    // Phase 2: IPC
    const ipcStart = delay + report.components.length * 400 + 500;
    timers.push(setTimeout(() => {
      setState(prev => ({ ...prev, phase: 2, ipcTotal: report.ipc?.rules.length || 0 }));
      addLog('—', 'ipc', 'IPC Class 3 validation initiated...');
    }, ipcStart));

    report.ipc?.rules.forEach((rule, i) => {
      timers.push(setTimeout(() => {
        setState(prev => ({ ...prev, ipcRules: [...prev.ipcRules, rule] }));
        addLog('—', 'ipc', `${rule.rule_id}: ${rule.description} — ${rule.severity}`);
      }, ipcStart + 200 + i * 150));
    });

    // Phase 3: Upgrades
    const upgradeStart = ipcStart + 200 + (report.ipc?.rules.length || 0) * 150 + 500;
    timers.push(setTimeout(() => {
      setState(prev => ({ ...prev, phase: 3 }));
      addLog('—', 'version_upgrade', 'Version Upgrade Agent initiated...');
    }, upgradeStart));

    report.upgrade?.upgrades.forEach((upg, i) => {
      timers.push(setTimeout(() => {
        setState(prev => ({ ...prev, upgradeComponents: [...prev.upgradeComponents, upg] }));
        addLog(upg.ref, 'version_upgrade', `${upg.original_mpn} → ${upg.upgraded_mpn}: ${upg.reason}`);
      }, upgradeStart + 300 + i * 400));
    });

    // Phase 4: Health
    const healthStart = upgradeStart + 300 + (report.upgrade?.upgrades.length || 0) * 400 + 500;
    timers.push(setTimeout(() => {
      setState(prev => ({ ...prev, phase: 4 }));
      addLog('—', 'strategic', 'Assessing product health...');
    }, healthStart));

    timers.push(setTimeout(() => {
      setState(prev => ({ ...prev, healthScore: report.health?.health_score || 0 }));
      addLog('—', 'strategic', `Health score: ${report.health?.health_score}/100`);
    }, healthStart + 1000));

    // Phase 5: Complete
    timers.push(setTimeout(() => {
      setState(prev => ({ ...prev, phase: 5, report, isRunning: false }));
      addLog('—', 'strategic', `ANALYSIS_COMPLETE — Report ID: ${report.report_id}`);
    }, healthStart + 2000));

    return () => timers.forEach(clearTimeout);
  }, [addLog]);

  const startRealStream = useCallback(async (request: AnalysisRequest) => {
    setState(prev => ({ ...prev, isRunning: true, error: null }));
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetchApi('/api/v1/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.text();
        setState(prev => ({ ...prev, error: `API error ${res.status}: ${errBody}`, isRunning: false }));
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setState(prev => ({ ...prev, error: 'No response body', isRunning: false }));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            handleSSEEvent(event);
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setState(prev => ({ ...prev, error: err.message, isRunning: false }));
      }
    }
  }, []);

  const handleSSEEvent = useCallback((event: any) => {
    switch (event.event) {
      case 'analysis_started':
        setState(prev => ({
          ...prev,
          phase: 1,
          product: event.product,
          totalComponents: event.total_components,
        }));
        break;

      case 'component_started':
        setState(prev => ({
          ...prev,
          components: [...prev.components, {
            ref: event.ref,
            mpn: event.mpn,
            manufacturer: event.manufacturer,
            description: event.description,
            status: 'searching',
            stock_available: 0,
            unit_price_usd: 0,
            lead_time_weeks: 0,
            issues: [],
            alternatives: [],
            recommendation: '',
            sources: [],
          }],
        }));
        addLog(event.ref, 'sourcing', `Searching distributors for ${event.mpn}...`);
        break;

      case 'agent_step':
        addLog(event.ref, event.agent, event.message);
        break;

      case 'component_done':
        setState(prev => ({
          ...prev,
          components: prev.components.map(c =>
            c.ref === event.ref
              ? {
                  ...c,
                  status: event.status,
                  stock_available: event.stock_available,
                  unit_price_usd: event.unit_price_usd,
                  lead_time_weeks: event.lead_time_weeks,
                  issues: event.issues || [],
                  alternatives: event.alternatives || [],
                  recommendation: event.recommendation || '',
                  sources: event.sources || [],
                }
              : c
          ),
          completedCount: prev.completedCount + 1,
        }));
        if (event.alternatives?.length > 0) {
          addLog(event.ref, 'sourcing', `Found alternative: ${event.alternatives[0].mpn}`);
        }
        break;

      case 'ipc_check_started':
        setState(prev => ({
          ...prev,
          phase: 2,
          ipcTotal: event.rule_count || 0,
        }));
        addLog('—', 'ipc', `IPC Class ${event.ipc_class} validation initiated...`);
        break;

      case 'ipc_rule_result':
        setState(prev => ({
          ...prev,
          ipcRules: [...prev.ipcRules, {
            rule_id: event.rule_id,
            category: event.category,
            description: event.description,
            severity: event.severity,
            value_found: event.value_found,
            limit: event.limit,
            remediation: event.remediation,
          }],
        }));
        addLog('—', 'ipc', `${event.rule_id}: ${event.description} — ${event.severity}`);
        break;

      case 'ipc_check_done':
        setState(prev => ({
          ...prev,
          ipcResult: {
            ipc_class_requested: event.ipc_class_requested,
            ipc_class_achieved: event.ipc_class_achieved,
            ipc_compliance_score: event.ipc_compliance_score,
            overall_verdict: event.overall_verdict,
            violation_count: event.violation_count,
            fabrication_note: event.fabrication_note,
            conformance_package_checklist: event.conformance_package_checklist,
            rules: prev.ipcRules,
          },
        }));
        break;

      case 'upgrade_started':
        setState(prev => ({ ...prev, phase: 3 }));
        addLog('—', 'version_upgrade', 'Version Upgrade Agent initiated...');
        break;

      case 'upgrade_component':
        setState(prev => ({
          ...prev,
          upgradeComponents: [...prev.upgradeComponents, {
            ref: event.ref,
            original_mpn: event.original_mpn,
            upgraded_mpn: event.upgraded_mpn,
            reason: event.reason,
            stock_available: event.stock_available,
            lead_time_weeks: event.lead_time_weeks,
            unit_price_delta_usd: event.unit_price_delta_usd,
            performance_gain: event.performance_gain,
          }],
        }));
        addLog(event.ref, 'version_upgrade', `${event.original_mpn} → ${event.upgraded_mpn}: ${event.reason}`);
        break;

      case 'upgrade_complete':
        setState(prev => ({
          ...prev,
          upgradeResult: {
            suggested_revision: event.suggested_revision,
            upgrade_summary: event.upgrade_summary,
            bom_cost_usd_before: event.bom_cost_usd_before,
            bom_cost_usd_after: event.bom_cost_usd_after,
            max_lead_time_before_weeks: event.max_lead_time_before_weeks,
            max_lead_time_after_weeks: event.max_lead_time_after_weeks,
            upgrades: prev.upgradeComponents,
          },
        }));
        break;

      case 'health_check_started':
        setState(prev => ({ ...prev, phase: 4 }));
        addLog('—', 'strategic', 'Assessing product health...');
        break;

      case 'health_check_done':
        setState(prev => ({
          ...prev,
          healthScore: event.health_score,
        }));
        addLog('—', 'strategic', `Health score: ${event.health_score}/100`);
        break;

      case 'analysis_complete': {
        const report: BOXReport = {
          report_id: event.report_id,
          product: event.product,
          revision: event.revision,
          target_quantity: event.target_quantity,
          generated_at: event.generated_at,
          recommended_business_model: event.recommended_business_model,
          go_no_go: event.go_no_go,
          risk_score: event.risk_score,
          estimated_bom_cost_usd: event.estimated_bom_cost_usd,
          strategic_reasoning: event.strategic_reasoning,
          rationale: event.rationale,
          action_items: event.action_items || [],
          components: event.components || [],
          ipc: event.ipc,
          upgrade: event.upgrade,
          health: event.health,
        };
        // Persist to localStorage
        localStorage.setItem(`box_report_${report.report_id}`, JSON.stringify(report));
        setState(prev => ({ ...prev, phase: 5, report, isRunning: false }));
        addLog('—', 'strategic', `ANALYSIS_COMPLETE — Report ID: ${report.report_id}`);
        break;
      }

      case 'error':
        addLog(event.ref || '—', 'error', event.message);
        // Mark the component as unknown if ref is present
        if (event.ref) {
          setState(prev => ({
            ...prev,
            components: prev.components.map(c =>
              c.ref === event.ref ? { ...c, status: 'unknown' as const } : c
            ),
          }));
        }
        break;
    }
  }, [addLog]);

  const startStream = useCallback((request?: AnalysisRequest) => {
    setState({ ...initialState });

    if (isMockMode()) {
      return startMockStream();
    }

    if (!request) {
      setState(prev => ({ ...prev, error: 'No analysis request provided' }));
      return;
    }

    startRealStream(request);
  }, [startMockStream, startRealStream]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  return { state, startStream, abort };
};
