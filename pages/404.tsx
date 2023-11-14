import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import Page from '../components/Pages/Error';

const Custom404Page: NextPage = () => (
  <>
    <Head>
      <title>Error Page</title>
    </Head>
    <Page statusCode={404} />
  </>
);

export default Custom404Page;
