export interface EventType {
  resize: { height: number; width: number };
  tick: { current: number };
}
