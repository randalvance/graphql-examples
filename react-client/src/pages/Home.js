import React from "react";
import { gql, useQuery } from "@apollo/client";

const itemsQuery = gql`
  query {
    items {
      id
      name
      price
      category
    }
  }
`;

export const Home = () => {
  const { data, loading, error } = useQuery(itemsQuery);

  if (loading) {
    return <h1>Loading Data...</h1>;
  } else if (error) {
      return <h1>An Error Occured!</h1>
  }

  return (
    <>
      {data.items.map((item) => (
        <h1>{item.name}</h1>
      ))}
    </>
  );
};
