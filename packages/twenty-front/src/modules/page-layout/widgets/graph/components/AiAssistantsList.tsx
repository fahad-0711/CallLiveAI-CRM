import { useState, useEffect } from 'react';

type AIAssistant = {
  id: string;
  name: string;
  promptTemplate: string;
  voiceId: string;
  telephonyProvider: string;
  telephonyConfig?: string;
};

const MOCK_ASSISTANTS: AIAssistant[] = [
  {
    id: '1',
    name: 'Real Estate Qualifier (Hindi)',
    promptTemplate: 'You are an AI assistant calling on behalf of CallLive AI. Ask if the prospect is looking to buy, sell, or rent property in Mumbai...',
    voiceId: 'Polly.Aditi',
    telephonyProvider: 'Exotel',
  },
  {
    id: '2',
    name: 'Lead Generation Agent (English)',
    promptTemplate: 'Polite cold call agent qualifying interest in new luxury apartment pre-launches in Bangalore. Collect budget and timeframe details...',
    voiceId: 'Polly.Joanna',
    telephonyProvider: 'Twilio',
  },
  {
    id: '3',
    name: 'Property Follow-Up Agent (Marathi)',
    promptTemplate: 'Friendly follow-up call with previous home-buyers. Ask if they are interested in upcoming residential projects in Pune...',
    voiceId: 'Polly.Aditi',
    telephonyProvider: 'Plivo',
  },
];

export const AiAssistantsList = () => {
  const [assistants, setAssistants] = useState<AIAssistant[]>(MOCK_ASSISTANTS);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [voiceId, setVoiceId] = useState('Polly.Aditi');
  const [telephonyProvider, setTelephonyProvider] = useState('Twilio');

  const fetchAssistants = async () => {
    try {
      const res = await fetch('/rest/ai-assistants');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setAssistants(data);
        }
      }
    } catch (err) {
      console.warn('Backend API not available, using mock assistants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !promptTemplate) return;

    const newAssistant = {
      name,
      promptTemplate,
      voiceId,
      telephonyProvider,
    };

    try {
      const res = await fetch('/rest/ai-assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssistant),
      });
      if (res.ok) {
        const saved = await res.json();
        setAssistants([saved, ...assistants]);
      } else {
        // Fallback for mock mode
        setAssistants([
          { id: Math.random().toString(), ...newAssistant },
          ...assistants,
        ]);
      }
    } catch (err) {
      // Fallback for mock mode
      setAssistants([
        { id: Math.random().toString(), ...newAssistant },
        ...assistants,
      ]);
    }

    // Reset form
    setName('');
    setPromptTemplate('');
    setIsCreating(false);
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
          CallLive AI Assistant Agents
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
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isCreating ? 'Cancel' : '+ Create Agent'}
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
          <input
            type="text"
            placeholder="Agent Name (e.g. Hindi Qualification)"
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
          <textarea
            placeholder="Prompt Instruction Template"
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            rows={3}
            style={{
              background: '#161920',
              border: '1px solid #333842',
              borderRadius: '6px',
              padding: '8px',
              color: '#fff',
              fontSize: '12px',
              resize: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: '#90a4ae' }}>Voice ID</label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                style={{
                  background: '#161920',
                  border: '1px solid #333842',
                  borderRadius: '6px',
                  padding: '6px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              >
                <option value="Polly.Aditi">Polly.Aditi (Hindi)</option>
                <option value="Polly.Joanna">Polly.Joanna (English)</option>
                <option value="Polly.Kajal">Polly.Kajal (Hindi-English)</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: '#90a4ae' }}>Provider</label>
              <select
                value={telephonyProvider}
                onChange={(e) => setTelephonyProvider(e.target.value)}
                style={{
                  background: '#161920',
                  border: '1px solid #333842',
                  borderRadius: '6px',
                  padding: '6px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              >
                <option value="Twilio">Twilio</option>
                <option value="Exotel">Exotel</option>
                <option value="Plivo">Plivo</option>
              </select>
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
            Save AI Assistant
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#90a4ae', fontSize: '12px' }}>Loading...</div>
          ) : assistants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#90a4ae', fontSize: '12px' }}>No assistants found.</div>
          ) : (
            assistants.map((assistant) => (
              <div key={assistant.id} style={{
                background: '#12141a',
                border: '1px solid #22252a',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                transition: 'border-color 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{assistant.name}</span>
                  <span style={{
                    fontSize: '10px',
                    background: '#1a237e',
                    color: '#8c9eff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {assistant.telephonyProvider} ({assistant.voiceId.split('.')[1] || assistant.voiceId})
                  </span>
                </div>
                <div style={{
                  color: '#90a4ae',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {assistant.promptTemplate}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
