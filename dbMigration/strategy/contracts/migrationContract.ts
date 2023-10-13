export interface MigrationStrategy {
  run(): Promise<void>;
}
