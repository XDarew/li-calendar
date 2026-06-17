import { Button, Form, InputNumber, Slider, SliderSingleProps, Space } from 'antd';
import React from 'react';
import { syncValuesConfig } from '../../../sync/base/syncValuesConfig.ts';
import { useConfigSync } from '../../../sync/configStore.ts';

/** 预设尺寸选项 */
const PRESETS = [
  { label: '紧凑', width: 300 },
  { label: '标准', width: 360 },
  { label: '宽屏', width: 420 },
] as const;

const widthMarks: SliderSingleProps['marks'] = { 240: '240', 360: '360', 420: '420', 600: '600' };
const heightMarks: SliderSingleProps['marks'] = { 0: '自适应', 400: '400', 800: '800' };

const WindowSizeForm: React.FC = () => {
  const { data: config, sync } = useConfigSync();
  const form = Form.useFormInstance();

  const handlePresetClick = (width: number): void => {
    form.setFieldsValue({ windowWidth: width });
    sync('windowWidth', width);
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
      <Form.Item label="预设尺寸">
        <Space>
          {PRESETS.map((p) => (
            <Button
              key={p.width}
              size="small"
              type={config.windowWidth === p.width ? 'primary' : 'default'}
              onClick={() => handlePresetClick(p.width)}
            >
              {p.label} ({p.width})
            </Button>
          ))}
        </Space>
      </Form.Item>
      <Form.Item name="windowWidth" label="窗口宽度">
        <Slider min={240} max={600} step={10} marks={widthMarks} />
      </Form.Item>
      <Form.Item name="windowHeight" label="窗口高度">
        <Slider min={0} max={800} step={10} marks={heightMarks}
          tooltip={{ formatter: (v: number | undefined) => v === 0 ? '自适应' : `${v}px` }}
        />
      </Form.Item>
      <Form.Item label="精确调整">
        <Space.Compact>
          <InputNumber
            size="small" min={240} max={600} step={10}
            value={config.windowWidth}
            onChange={(v) => { if (v !== null) sync('windowWidth', v); }}
            style={{ width: 100 }}
          />
          <Button size="small" disabled>宽</Button>
          <InputNumber
            size="small" min={0} max={800} step={10}
            value={config.windowHeight}
            onChange={(v) => { if (v !== null) sync('windowHeight', v); }}
            style={{ width: 100 }}
          />
          <Button size="small" disabled>高</Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default WindowSizeForm;
