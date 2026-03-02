import { Connector } from '../types';
import { ConnectorCard } from './ConnectorCard';
import { Input } from '@/src/ui-kit';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

const MOCK_CONNECTORS: Connector[] = [
  {
    id: '1',
    name: 'Postgres',
    description: 'Connect your Postgres data for instant AI analysis',
    type: 'Database',
    icon: 'database',
    status: 'disconnected',
  },
  {
    id: '2',
    name: 'BigQuery',
    description: 'Connect your BigQuery data for instant AI analysis',
    type: 'Data Warehouse',
    icon: 'server',
    status: 'connected',
  },
  {
    id: '3',
    name: 'Snowflake',
    description: 'Connect your Snowflake data for instant AI analysis',
    type: 'Data Warehouse',
    icon: 'server',
    status: 'disconnected',
  },
  {
    id: '4',
    name: 'Slack',
    description: 'Connect your Slack workspace to receive reports and insights',
    type: 'Integration',
    icon: 'share-2',
    status: 'connected',
  },
  {
    id: '5',
    name: 'MySQL',
    description: 'Connect your MySQL data for instant AI analysis',
    type: 'Database',
    icon: 'database',
    status: 'disconnected',
  },
  {
    id: '6',
    name: 'Google Drive',
    description: 'Analyze your Google Drive files and folders',
    type: 'Integration',
    icon: 'share-2',
    status: 'disconnected',
  },
];

interface ConnectorListProps {
  onSelect?: (connector: Connector) => void;
}

export const ConnectorList = ({ onSelect }: ConnectorListProps) => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONNECTORS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="w-full md:max-w-md">
          <Input 
            label="Search Connectors"
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <div className="relative -top-8 left-3 w-4 h-4 text-[var(--text-secondary)]">
            <Search className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((connector) => (
          <ConnectorCard 
            key={connector.id} 
            connector={connector} 
            onClick={onSelect}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-2xl">
          <p className="text-[var(--text-secondary)]">No connectors found matching your search.</p>
        </div>
      )}
    </div>
  );
};
