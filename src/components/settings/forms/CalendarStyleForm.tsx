import { Button, ColorPicker, Form, Segmented, Select, Slider, SliderSingleProps } from 'antd';
import React from 'react';
import { syncValuesConfig } from '../../../sync/base/syncValuesConfig.ts';
import { useConfigSync } from '../../../sync/configStore.ts';
import type { CalendarFontConfig } from '../../../sync/type/configTypes.ts';

/** 字体族选项 */
const FONT_FAMILY_OPTIONS = [
  { value: 'system-ui', label: '系统默认' },
  { value: "'Microsoft YaHei', sans-serif", label: '微软雅黑' },
  { value: 'SimSun, serif', label: '宋体' },
  { value: 'KaiTi, serif', label: '楷体' },
  { value: 'FangSong, serif', label: '仿宋' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-serif' },
  { value: 'monospace', label: 'Monospace' },
];

const fontSizeMarks: SliderSingleProps['marks'] = { 10: '10', 13: '13', 16: '16', 20: '20' };

const weightNormalOptions = [
  { label: '细 (300)', value: 300 },
  { label: '常规 (400)', value: 400 },
  { label: '中等 (500)', value: 500 },
];

const weightBoldOptions = [
  { label: '中等 (500)', value: 500 },
  { label: '半粗 (600)', value: 600 },
  { label: '粗体 (700)', value: 700 },
];

/** 默认值（用于重置） */
const FONT_DEFAULTS: CalendarFontConfig = {
  fontSize: 13,
  fontFamily: 'system-ui',
  fontWeight: 400,
  fontWeightBold: 600,
  textColor: '',
  textColorSecondary: '',
};

const CalendarStyleForm: React.FC = () => {
  const { data: config, sync } = useConfigSync();

  const handleReset = (): void => {
    (Object.keys(FONT_DEFAULTS) as (keyof CalendarFontConfig)[]).forEach((key) => {
      sync(key, FONT_DEFAULTS[key]);
    });
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 14 }}
      labelAlign="left"
      colon={false}
      initialValues={config}
      onValuesChange={syncValuesConfig}
    >
      <Form.Item name="fontSize" label="基础字号">
        <Slider min={10} max={20} step={1} marks={fontSizeMarks}
          tooltip={{ formatter: (v: number | undefined) => v !== undefined ? `${v}px` : '' }}
        />
      </Form.Item>
      <Form.Item name="fontFamily" label="字体族">
        <Select options={FONT_FAMILY_OPTIONS} />
      </Form.Item>
      <Form.Item name="fontWeight" label="正常字重">
        <Segmented options={weightNormalOptions} />
      </Form.Item>
      <Form.Item name="fontWeightBold" label="加粗字重">
        <Segmented options={weightBoldOptions} />
      </Form.Item>
      <Form.Item label="主文字颜色">
        <ColorPicker
          value={config.textColor || undefined}
          onChangeComplete={(value) => sync('textColor', value.toHexString())}
          allowClear
          onClear={() => sync('textColor', '')}
        />
        <span style={{ marginLeft: 8, color: '#999', fontSize: 12 }}>
          {config.textColor || '跟随主题'}
        </span>
      </Form.Item>
      <Form.Item label="次要文字颜色">
        <ColorPicker
          value={config.textColorSecondary || undefined}
          onChangeComplete={(value) => sync('textColorSecondary', value.toHexString())}
          allowClear
          onClear={() => sync('textColorSecondary', '')}
        />
        <span style={{ marginLeft: 8, color: '#999', fontSize: 12 }}>
          {config.textColorSecondary || '跟随主题'}
        </span>
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Button onClick={handleReset}>重置为默认</Button>
      </Form.Item>
    </Form>
  );
};

export default CalendarStyleForm;
