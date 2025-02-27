import React from 'react';
import Layout from '../components/Layout/Layout';
import ProcessCanvas from '../components/Modeling/Canvas';

export default function Modeling() {
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ProcessCanvas />
        </div>
      </div>
    </Layout>
  );
}
