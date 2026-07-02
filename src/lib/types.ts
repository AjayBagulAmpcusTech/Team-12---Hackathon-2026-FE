export interface Category {
  id: string;
  label: string;
  description: string;
}

export interface UrgencyLevel {
  id: string;
  label: string;
  sla_minutes: number;
  color: string;
}

export interface RoutingDestination {
  id: string;
  label: string;
  team: string;
}

export interface RoutingRule {
  id?: number;
  priority: number;
  condition_type: string;
  condition_value: string;
  destination_id: string;
  override_urgency?: string | null;
}

export interface TriageConfig {
  categories: Category[];
  urgency_levels: UrgencyLevel[];
  routing_destinations: RoutingDestination[];
  routing_rules: RoutingRule[];
}

export interface TriageResult {
  incident_id: string;
  raw_text: string;
  type: string;
  urgency: string;
  reason: string;
  security_sensitive: boolean;
  security_subtype?: string | null;
  heuristic_security_flag: boolean;
  suggested_first_response: string;
  routing_destination: string;
  routing_destination_label: string;
  routing_reason: string;
  confidence: number;
  processing_ms: number;
}

export interface StreamState {
  results: TriageResult[];
  total: number;
  securityCount: number;
  isStreaming: boolean;
  error: string | null;
  progress: number;
}
