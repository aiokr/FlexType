"use client"

import React, { useState, useEffect } from 'react';
import { Table, Input, Toast, Select, Modal, Button, Card } from '@douyinfe/semi-ui';
import Image from 'next/image'
import { auth } from '@/auth';
import Link from 'next/link';

interface PhotoListProps {
  photosData: any; // 这里应该用更具体的类型替代 any，以匹配 photosData 的结构
  assertsData: any; // 这里应该用更具体的类型替代 any，以匹配 assertsData 的结构
}

interface SelectedPhoto {
  id: string | null;
  title: string | null;
  url: string | null;
  width: number | null;
  height: number | null;
  DateTimeOriginal: Date | null;
  Make: string | null;
  Model: string | null;
  LensMake: string | null;
  LensModel: string | null;
}


const PhotoListComponent: React.FC<PhotoListProps> = ({ photosData, assertsData }) => {

  const [data, setData] = useState(photosData);  // Photos 列表的数据
  useEffect(() => { setData(photosData); }, [photosData]);
  const [assertData, setAssertData] = useState(assertsData);  // Assets 列表的数据
  useEffect(() => { setAssertData(assertsData); }, [assertsData]);
  const [selected, setSelected] = useState<SelectedPhoto>({
    id: null,
    title: null,
    url: null,
    width: null,
    height: null,
    DateTimeOriginal: null,
    Make: null,
    Model: null,
    LensMake: null,
    LensModel: null
  });
  useEffect(() => { setSelected(selected); }, [selected]);
  const [visible, setVisible] = useState(false);  // 新建 Photo 的弹窗

  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    // 根据选中的 id 查找原始资产
    const originalAsset = assertsData.find((item: any) => item.assetId === selected.id);
    console.log(originalAsset)

    // 创建一个新对象，如果值未更改，则设置为 null
    const cleanedSelected = Object.keys(selected).reduce((acc: any, key) => {
      // 断言 key 为 SelectedPhoto 的键
      const selectedKey = key as keyof SelectedPhoto;
      // 检查原始资产是否存在，以及 selected[key] 是否与之不同
      const hasChanged = originalAsset && (selected[selectedKey] !== originalAsset[selectedKey]);
      // 如果值未更改，则设置为 null，否则保留当前值
      acc[selectedKey] = hasChanged ? selected[selectedKey] : null;
      return acc;
    }, {} as SelectedPhoto);

    // 现在您有了一个清理过的对象，未更改的值被设置为 null
    const json = JSON.stringify(cleanedSelected);
    // 对 json 做一些操作...
    console.log(json);

    setVisible(false);
    console.log('Ok 按钮被点击');
  };
  const handleCancel = () => {
    setVisible(false);
    console.log('Cancel button clicked');
  };
  const handleAfterClose = () => {
    console.log('After Close callback executed');
  };

  const { Meta } = Card

  const outSlotNode = <Link href={'/dashboard/assets'} className='block w-full text-indigo-500 my-2 text-center font-bold'>上传新文件</Link>

  const renderSelectedItem = (optionNode: any) => (
    <>{optionNode.label}</>
  )

  const selectOnChange = (value: any) => {
    const selectedAsset = assertData.find((item: any) => item.assetId === value);
    if (selectedAsset) {
      setSelected({
        id: selectedAsset.assetId,
        title: selectedAsset.title,
        url: selectedAsset.url,
        width: selectedAsset.width,
        height: selectedAsset.height,
        DateTimeOriginal: selectedAsset.DateTimeOriginal,
        Make: selectedAsset.Make,
        Model: selectedAsset.Model,
        LensMake: selectedAsset.LensMake,
        LensModel: selectedAsset.LensModel
      });
    }
  };

  const setPhoto = (event: React.ChangeEvent<HTMLInputElement>, field: keyof SelectedPhoto) => {
    const newValue = event
    setSelected(prevSelected => ({
      ...prevSelected,
      [field]: newValue
    }));
  };

  const newPhoto = () => {
    setVisible(true);
  }

  return (
    <>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
        <button className='border rounded-[6px] w-full h-full' onClick={newPhoto}>
        </button>
        {data.map((item: any) => (
          <Card key={item.id}
            cover={<Image src={item.url} alt={item.title} height={item.height} width={item.width} unoptimized />}
          >
            <Meta title={item.title || 'No Title'} />
          </Card>
        ))}
        <Modal
          title="新建图片"
          visible={visible}
          onOk={handleOk}
          afterClose={handleAfterClose} //>=1.16.0
          onCancel={handleCancel}
          closeOnEsc={true}
          closable={false}
          fullScreen
        >
          <div className='container mx-auto max-w-[800px]'>
            <div>
              <Select
                onChange={selectOnChange}
                style={{ width: '100%', height: '140px' }}
                dropdownStyle={{ width: '100%' }}
                outerBottomSlot={outSlotNode}
                renderSelectedItem={renderSelectedItem}
              >
                {assertData.map((item: any) => (
                  <Select.Option key={item.assetId} value={item.assetId} className='flex gap-2'>
                    <div className='flex gap-2'>
                      <Image className='max-h-[120px] max-w-[160px] object-cover ' src={item.url} alt={item.title} width={item.width} height={160} unoptimized />
                      <div>
                        <div className='font-bold'>{item.assetId + ' - ' + item.title}</div>
                        <div>{item.DateTimeOriginal.toUTCString()}</div>
                        <div>{item.Make + ' - ' + item.Model}</div>
                        <div>{item.LensModel}</div>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-8'>
              <Input size='large' prefix="ID*" className='col-span-1' value={selected.id || ''} onChange={(event: any) => setPhoto(event, 'id')} ></Input>
              <Input size='large' prefix="Title*" className='col-span-4' onChange={(event: any) => setPhoto(event, 'title')} ></Input>
              <Input size='large' placeholder={selected.Make} className='col-span-1' prefix="Make*" onChange={(event: any) => setPhoto(event, 'Make')}  ></Input>
              <Input size='large' placeholder={selected.Model} className='col-span-3' prefix="Model*" onChange={(event: any) => setPhoto(event, 'Model')} ></Input>
              <Input size='large' placeholder={selected.LensMake || ''} className='col-span-3' prefix="LensMake*" onChange={(event: any) => setPhoto(event, 'LensMake')}></Input>
              <Input size='large' placeholder={selected.LensModel} className='col-span-3' prefix="LensModel*" onChange={(event: any) => setPhoto(event, 'LensModel')}></Input>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )

}

export default PhotoListComponent;