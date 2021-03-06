// eslint-disable
// this is an auto generated file. This will be overwritten

import gql from "graphql-tag";

export const getCompany = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      id
      companyname
      email
      phonenumber
      files {
        bucket
        region
        key
      }
      visibility
      resources {
        items {
          id
          name
          product
          address
          location
          owner
          offering
          category
          city
          description
          number
          state
          zip
          content
        }
        nextToken
      }
    }
  }
`;

export const listCompanys = gql`
  query ListCompanys(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyname
        email
        phonenumber
        files {
          bucket
          region
          key
        }
        visibility
        resources {
          items {
            id
            name
            product
            address
            location
            owner
            offering
            category
            city
            description
            number
            state
            zip
            content
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getResource = gql`
  query GetResource($id: ID!) {
    getResource(id: $id) {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      visibility
      file {
        bucket
        region
        key
      }
      content
      comment {
        items {
          id
          content
        }
        nextToken
      }
      company {
        id
        companyname
        email
        phonenumber
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const listResources = gql`
  query ListResources(
    $filter: ModelResourceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listResources(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        visibility
        file {
          bucket
          region
          key
        }
        content
        comment {
          items {
            id
            content
          }
          nextToken
        }
        company {
          id
          companyname
          email
          phonenumber
          files {
            bucket
            region
            key
          }
        }
      }
      nextToken
    }
  }
`;
export const getComment = gql`
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      content
      resource {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
    }
  }
`;
export const listComments = gql`
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        resource {
          id
          name
          product
          address
          location
          owner
          offering
          category
          city
          description
          number
          state
          zip
          content
        }
      }
      nextToken
    }
  }
`;
