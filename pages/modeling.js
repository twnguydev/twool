import React from 'react';
import Layout from '../components/Layout/Layout';
import ProcessCanvas from '../components/Modeling/Canvas';

export default function Modeling() {
  return (
    <Layout title="Workflow builder">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ProcessCanvas />
        </div>
      </div>
    </Layout>
  );
}
