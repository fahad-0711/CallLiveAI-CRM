import { ResponsiveRadialBar } from '@nivo/radial-bar';

const data = [
  {
    id: 'Delivered',
    data: [{ x: 'WhatsApp', y: 85 }],
  },
  {
    id: 'Read',
    data: [{ x: 'WhatsApp', y: 64 }],
  },
  {
    id: 'Replied',
    data: [{ x: 'WhatsApp', y: 42 }],
  },
];

type WhatsappAnalyticsWidgetProps = {
  widget: any;
};

export const WhatsappAnalyticsWidget = ({ widget }: WhatsappAnalyticsWidgetProps) => {
  return (
    <div style={{ height: 220, width: '100%' }}>
      <ResponsiveRadialBar
        data={data}
        valueFormat=">-.0f"
        padding={0.4}
        cornerRadius={2}
        colors={{ scheme: 'category10' }}
        tracksColor="#1c1c1c1a"
        enableLabels={true}
        labelsSkipAngle={10}
        labelsTextColor="#1c1c1c"
      />
    </div>
  );
};
