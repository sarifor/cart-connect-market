import Head from "next/head";
import { Button } from 'antd';
import styled from 'styled-components';

import { Counter } from "@/components/Counter";

const TextBox = styled.div`
  background-color: orange;
`;

const Home = () => {
  return (
    <>
      <div>Hi! Front!</div>
      {/* <Head>
        <title>Index</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <TextBox>Orange!</TextBox>
        <Button type="primary">Button!</Button>
      </div>
      <Counter /> */}
    </>
  );
};

export default Home;