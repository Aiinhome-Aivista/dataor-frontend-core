export interface Connector {
  id: string;
  name: string;
  description: string;
  type: 'Database' | 'Data Warehouse' | 'Integration';
  icon: string;
  status: 'connected' | 'disconnected';
}
