import { useState, useEffect } from 'react';

type CallingCampaign = {
  id: string;
  name: string;
  status: 'Draft' | 'Running' | 'Paused' | 'Completed';
  aiAssistantId?: string;
  leadSourceCsvUrl?: string;
  totalLeads: number;
  completedCalls: number;
};

const MOCK_CAMPAIGNS: CallingCampaign[] = [
  {
    id: '1',
    name: 'Mumbai Borivali Warm Lead Campaign',
    status: 'Running',
    aiAssistantId: '1',
    leadSourceCsvUrl: 's3://calldrive-csvs/mumbai_borivali.csv',
    totalLeads: 250,
    completedCalls: 112,
  },
  {
    id: '2',
    name: 'Pune IT Park Cold Outreach',
    status: 'Paused',
    aiAssistantId: '3',
    leadSourceCsvUrl: 's3://calldrive-csvs/pune_it_park.csv',
    totalLeads: 1200,
    completedCalls: 450,
  },
  {
    id: '3',
    name: 'Bangalore Pre-Launch Hot Leads',
    status: 'Completed',
    aiAssistantId: '2',
    leadSourceCsvUrl: 's3://calldrive-csvs/bangalore_prelaunch.csv',
    totalLeads: 500,
    completedCalls: 500,
  },
];

export const CampaignManagerWidget = () => {
  const [campaigns, setCampaigns] = useState<CallingCampaign[]>(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [totalLeads, setTotalLeads] = useState(100);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/rest/calling-campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCampaigns(data);
        }
      }
    } catch (err) {
      console.warn('Backend API not available, using mock campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCampaign = {
      name,
      status: 'Draft',
      aiAssistantId: assistantId || undefined,
      leadSourceCsvUrl: csvFile ? `/uploads/${csvFile.name}` : undefined,
      totalLeads: Number(totalLeads),
      completedCalls: 0,
    };

    try {
      const res = await fetch('/rest/calling-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      });
      if (res.ok) {
        const saved = await res.json();
        setCampaigns([saved, ...campaigns]);
      } else {
        setCampaigns([
          { id: Math.random().toString(), ...newCampaign } as CallingCampaign,
          ...campaigns,
        ]);
      }
    } catch (err) {
      setCampaigns([
        { id: Math.random().toString(), ...newCampaign } as CallingCampaign,
        ...campaigns,
      ]);
    }

    setName('');
    setCsvFile(null);
    setIsCreating(false);
  };

  const handleStatusChange = async (id: string, newStatus: 'Running' | 'Paused' | 'Completed') => {
    try {
      const res = await fetch(`/rest/calling-campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCampaigns(campaigns.map((c) => (c.id === id ? updated : c)));
      } else {
        setCampaigns(campaigns.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
      }
    } catch (err) {
      setCampaigns(campaigns.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    }
  };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      color: '#ffffff',
      background: '#0a0a0c',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #22252a',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        borderBottom: '1px solid #22252a',
        paddingBottom: '8px'
      }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#00e5ff' }}>
          CallLive Campaigns Manager
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{
            background: isCreating ? '#ff1744' : '#00e5ff',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isCreating ? 'Cancel' : '+ New Campaign'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          <input
            type="text"
            placeholder="Campaign Name (e.g. Pune Warm Leads)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              background: '#161920',
              border: '1px solid #333842',
              borderRadius: '6px',
              padding: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: '#90a4ae' }}>Upload Lead List CSV</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                style={{
                  background: '#161920',
                  border: '1px solid #333842',
                  borderRadius: '6px',
                  padding: '4px',
                  color: '#fff',
                  fontSize: '10px'
                }}
              />
            </div>
            <div style={{ width: '80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: '#90a4ae' }}>Total Leads</label>
              <input
                type="number"
                value={totalLeads}
                onChange={(e) => setTotalLeads(Number(e.target.value))}
                style={{
                  background: '#161920',
                  border: '1px solid #333842',
                  borderRadius: '6px',
                  padding: '6px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              background: '#00e5ff',
              color: '#000000',
              border: 'none',
              borderRadius: '6px',
              padding: '8px',
              fontWeight: 'bold',
              marginTop: '8px',
              cursor: 'pointer'
            }}
          >
            Launch Campaign
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#90a4ae', fontSize: '12px' }}>Loading...</div>
          ) : campaigns.map((campaign) => {
            const percentage = Math.round((campaign.completedCalls / campaign.totalLeads) * 100) || 0;
            return (
              <div key={campaign.id} style={{
                background: '#12141a',
                border: '1px solid #22252a',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{campaign.name}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    color: '#000000',
                    background: campaign.status === 'Running' ? '#00e5ff' : campaign.status === 'Completed' ? '#00e676' : '#ff9100'
                  }}>
                    {campaign.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#22252a', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#00e5ff' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#90a4ae', whiteSpace: 'nowrap' }}>
                    {campaign.completedCalls} / {campaign.totalLeads} ({percentage}%)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {campaign.status === 'Paused' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'Running')}
                      style={{ background: '#00e676', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', color: '#000' }}
                    >
                      Resume
                    </button>
                  )}
                  {campaign.status === 'Running' && (
                    <button
                      onClick={() => handleStatusChange(campaign.id, 'Paused')}
                      style={{ background: '#ff9100', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', color: '#000' }}
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
