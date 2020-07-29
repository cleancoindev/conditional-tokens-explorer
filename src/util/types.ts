export interface Question {
  id: string
  raw: string
  templateId: number
  title: string
  resolution: Date
  arbitratorAddress: string
  category: string
  outcomes: string[]
}

export interface QuestionLog {
  category: string
  lang: string
  title: string
  type: string
  outcomes?: string[]
}

export enum ConditionStatus {
  Open = 'Open',
  Resolved = 'Resolved',
}

export enum ConditionType {
  Omen = 'Omen Condition',
  Unknown = 'Unknown',
}

export enum ConditionErrors {
  INVALID_ERROR = `Invalid condition`,
  FETCHING_ERROR = `Error fetching condition`,
  NOT_FOUND_ERROR = `Condition doesn't exist`,
  NOT_RESOLVED_ERROR = `Condition is not resolved`,
}
