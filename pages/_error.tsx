import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import Page from '../components/Pages/Error';

interface iProps {
  statusCode: number;
}

const Error: NextPage<iProps> = ({ statusCode }) => (
  <>
    <Head>
      <title>Error Page</title>
    </Head>
    <Page statusCode={statusCode} />
  </>
);

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
