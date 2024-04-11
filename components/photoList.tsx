"use client"

import React, { useState, useEffect } from 'react';
import { Table, Avatar, Toast, Popconfirm, Modal, Button, Card } from '@douyinfe/semi-ui';
import Image from 'next/image'


export default function PhotoListComponent(data: any) {

  const [photoData, setPhotoData] = useState(data);
  useEffect(() => { setPhotoData(data); }, [data]);

  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
    console.log('Ok button clicked');
  };
  const handleCancel = () => {
    setVisible(false);
    console.log('Cancel button clicked');
  };
  const handleAfterClose = () => {
    console.log('After Close callback executed');
  };

  const { Meta } = Card

  console.log(photoData.data)

  const newPhoto = () => {
    setVisible(true);
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
        <button className='border rounded-[6px]' onClick={newPhoto}>
        </button>
        {photoData.data.map((item: any) => (
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
        >
        
        </Modal>
      </div>
    </>
  )

}